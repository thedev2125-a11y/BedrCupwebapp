import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { defaultData, slugify } from '../data/defaultData';
import { computeStandings, computePlayerStats, computeFixtureDisplay } from '../utils/computeStats';

export const DataContext = createContext(null);

const STORAGE_PREFIX = 'vst:'; // "Village Summer Tournament"
const KEYS = {
  teams: `${STORAGE_PREFIX}teams`,
  players: `${STORAGE_PREFIX}players`,
  fixtures: `${STORAGE_PREFIX}fixtures`,
  news: `${STORAGE_PREFIX}news`,
  gallery: `${STORAGE_PREFIX}gallery`,
  sponsors: `${STORAGE_PREFIX}sponsors`,
  settings: `${STORAGE_PREFIX}settings`,
  byeAnnouncements: `${STORAGE_PREFIX}byeAnnouncements`,
};

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can throw if full or disabled (private browsing) —
    // the app keeps working in-memory for the rest of the session.
  }
}

function makeId(prefix, label) {
  const base = label ? slugify(label).slice(0, 18) : '';
  return `${prefix}${base ? `-${base}` : ''}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function DataProvider({ children }) {
  const [teams, setTeams] = useState(() => loadFromStorage(KEYS.teams, defaultData.teams));
  const [players, setPlayers] = useState(() => loadFromStorage(KEYS.players, defaultData.players));
  const [fixtures, setFixtures] = useState(() => loadFromStorage(KEYS.fixtures, defaultData.fixtures));
  const [news, setNews] = useState(() => loadFromStorage(KEYS.news, defaultData.news));
  const [gallery, setGallery] = useState(() => loadFromStorage(KEYS.gallery, defaultData.gallery));
  const [sponsors, setSponsors] = useState(() => loadFromStorage(KEYS.sponsors, defaultData.sponsors));
  const [settings, setSettings] = useState(() => loadFromStorage(KEYS.settings, defaultData.settings));
  const [byeAnnouncements, setByeAnnouncements] = useState(() =>
    loadFromStorage(KEYS.byeAnnouncements, defaultData.byeAnnouncements)
  );

  useEffect(() => saveToStorage(KEYS.teams, teams), [teams]);
  useEffect(() => saveToStorage(KEYS.players, players), [players]);
  useEffect(() => saveToStorage(KEYS.fixtures, fixtures), [fixtures]);
  useEffect(() => saveToStorage(KEYS.news, news), [news]);
  useEffect(() => saveToStorage(KEYS.gallery, gallery), [gallery]);
  useEffect(() => saveToStorage(KEYS.sponsors, sponsors), [sponsors]);
  useEffect(() => saveToStorage(KEYS.settings, settings), [settings]);
  useEffect(() => saveToStorage(KEYS.byeAnnouncements, byeAnnouncements), [byeAnnouncements]);

  // ---------- derived, always-correct data ----------
  const teamsWithStats = useMemo(() => computeStandings(teams, fixtures), [teams, fixtures]);
  const playersWithStats = useMemo(() => computePlayerStats(players, fixtures, teams), [players, fixtures, teams]);
  const fixturesDisplay = useMemo(() => computeFixtureDisplay(fixtures, teams, players), [fixtures, teams, players]);
  const resultsDisplay = useMemo(() => fixturesDisplay.filter((f) => f.status === 'completed'), [fixturesDisplay]);

  // ================= Teams =================
  const addTeam = useCallback((team) => {
    if (!team.name?.trim()) throw new Error('Team name is required.');
    if (!['A', 'B'].includes(team.group)) throw new Error('Team must be assigned to Group A or Group B.');
    const id = makeId('team', team.name);
    setTeams((prev) => [
      ...prev,
      {
        id,
        name: team.name.trim(),
        group: team.group,
        coach: team.coach?.trim() || '',
        logoInitials: (team.logoInitials || team.name.slice(0, 2)).toUpperCase(),
        venueNote: team.venueNote?.trim() || '',
      },
    ]);
    return id;
  }, []);

  const updateTeam = useCallback((id, patch) => {
    if (patch.name !== undefined && !patch.name.trim()) throw new Error('Team name is required.');
    if (patch.group !== undefined && !['A', 'B'].includes(patch.group)) {
      throw new Error('Team must be assigned to Group A or Group B.');
    }
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTeam = useCallback((id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setPlayers((prev) => prev.filter((p) => p.teamId !== id));
    setFixtures((prev) => prev.filter((f) => f.homeTeamId !== id && f.awayTeamId !== id));
    setByeAnnouncements((prev) => prev.filter((b) => b.teamId !== id));
  }, []);

  // ================= Players =================
  const addPlayer = useCallback(
    (player) => {
      if (!player.name?.trim()) throw new Error('Player name is required.');
      if (!player.teamId) throw new Error('Player must be assigned to a team.');
      if (!teams.some((t) => t.id === player.teamId)) throw new Error('Selected team does not exist.');
      const id = makeId('player', player.name);
      setPlayers((prev) => [
        ...prev,
        {
          id,
          name: player.name.trim(),
          teamId: player.teamId,
          position: player.position || 'Midfielder',
          jerseyNumber: player.jerseyNumber ? Number(player.jerseyNumber) : null,
        },
      ]);
      return id;
    },
    [teams]
  );

  const updatePlayer = useCallback((id, patch) => {
    if (patch.name !== undefined && !patch.name.trim()) throw new Error('Player name is required.');
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...patch, jerseyNumber: patch.jerseyNumber !== undefined ? Number(patch.jerseyNumber) || null : p.jerseyNumber }
          : p
      )
    );
  }, []);

  const deletePlayer = useCallback((id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setFixtures((prev) =>
      prev.map((f) => ({
        ...f,
        goals: f.goals.filter((g) => g.playerId !== id),
        cards: f.cards.filter((c) => c.playerId !== id),
        motmPlayerId: f.motmPlayerId === id ? null : f.motmPlayerId,
      }))
    );
  }, []);

  // ================= Fixtures / Matches =================
  const addFixture = useCallback(
    (fixture) => {
      if (!fixture.round?.trim()) throw new Error('Round is required.');
      if (!fixture.date) throw new Error('Match date is required.');
      if (!fixture.homeTeamId || !fixture.awayTeamId) throw new Error('Both home and away teams are required.');
      if (fixture.homeTeamId === fixture.awayTeamId) throw new Error('Home and away teams must be different.');
      const id = makeId('match');
      setFixtures((prev) => [
        ...prev,
        {
          id,
          round: fixture.round.trim(),
          date: fixture.date,
          time: fixture.time || '3:00 PM',
          venue: fixture.venue?.trim() || 'Village Community Pitch',
          status: fixture.status || 'upcoming',
          homeTeamId: fixture.homeTeamId,
          awayTeamId: fixture.awayTeamId,
          homeScore: fixture.homeScore ?? null,
          awayScore: fixture.awayScore ?? null,
          motmPlayerId: null,
          goals: [],
          cards: [],
        },
      ]);
      return id;
    },
    []
  );

  const updateFixture = useCallback((id, patch) => {
    if (patch.homeTeamId && patch.awayTeamId && patch.homeTeamId === patch.awayTeamId) {
      throw new Error('Home and away teams must be different.');
    }
    setFixtures((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const deleteFixture = useCallback((id) => {
    setFixtures((prev) => prev.filter((f) => f.id !== id));
  }, []);

  /** Live-score / status quick update. */
  const updateScore = useCallback((id, { homeScore, awayScore, status }) => {
    setFixtures((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              homeScore: homeScore === '' || homeScore === undefined ? f.homeScore : Number(homeScore),
              awayScore: awayScore === '' || awayScore === undefined ? f.awayScore : Number(awayScore),
              status: status || f.status,
            }
          : f
      )
    );
  }, []);

  /** Resets a fixture back to upcoming with no score/goals/cards/MOTM —
   * this is the "delete a result" action (the fixture itself stays). */
  const clearResult = useCallback((id) => {
    setFixtures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'upcoming', homeScore: null, awayScore: null, motmPlayerId: null, goals: [], cards: [] } : f
      )
    );
  }, []);

  const addGoal = useCallback((fixtureId, { playerId, teamId }) => {
    if (!playerId || !teamId) throw new Error('Select a player to add a goal.');
    setFixtures((prev) =>
      prev.map((f) =>
        f.id === fixtureId
          ? { ...f, goals: [...f.goals, { id: makeId('goal'), playerId, teamId }] }
          : f
      )
    );
  }, []);

  const removeGoal = useCallback((fixtureId, goalId) => {
    setFixtures((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, goals: f.goals.filter((g) => g.id !== goalId) } : f))
    );
  }, []);

  const addCard = useCallback((fixtureId, { playerId, teamId, cardType }) => {
    if (!playerId || !teamId) throw new Error('Select a player to add a card.');
    if (!['yellow', 'red'].includes(cardType)) throw new Error('Card type must be yellow or red.');
    setFixtures((prev) =>
      prev.map((f) =>
        f.id === fixtureId
          ? { ...f, cards: [...f.cards, { id: makeId('card'), playerId, teamId, cardType }] }
          : f
      )
    );
  }, []);

  const removeCard = useCallback((fixtureId, cardId) => {
    setFixtures((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, cards: f.cards.filter((c) => c.id !== cardId) } : f))
    );
  }, []);

  const setMotm = useCallback((fixtureId, playerId) => {
    setFixtures((prev) => prev.map((f) => (f.id === fixtureId ? { ...f, motmPlayerId: playerId || null } : f)));
  }, []);

  // ================= News =================
  const addNews = useCallback((article) => {
    if (!article.title?.trim()) throw new Error('News title is required.');
    const id = makeId('news', article.title);
    setNews((prev) => [
      {
        id,
        title: article.title.trim(),
        image: article.image?.trim() || '',
        publishedAt: article.publishedAt || new Date().toISOString().slice(0, 10),
        excerpt: article.excerpt?.trim() || '',
        content: article.content?.trim() || article.excerpt?.trim() || '',
        featured: !!article.featured,
      },
      ...prev,
    ]);
    return id;
  }, []);

  const updateNews = useCallback((id, patch) => {
    if (patch.title !== undefined && !patch.title.trim()) throw new Error('News title is required.');
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const deleteNews = useCallback((id) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ================= Gallery =================
  const addGalleryImage = useCallback((photo) => {
    if (!photo.image?.trim()) throw new Error('Image URL is required.');
    if (!['Matches', 'Fans', 'Training', 'Celebrations'].includes(photo.category)) {
      throw new Error('Choose a valid category.');
    }
    const id = makeId('photo');
    setGallery((prev) => [{ id, category: photo.category, caption: photo.caption?.trim() || '', image: photo.image.trim() }, ...prev]);
    return id;
  }, []);

  const updateGalleryImage = useCallback((id, patch) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const deleteGalleryImage = useCallback((id) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // ================= Sponsors =================
  const addSponsor = useCallback((sponsor) => {
    if (!sponsor.name?.trim()) throw new Error('Sponsor name is required.');
    if (!['gold', 'silver', 'bronze'].includes(sponsor.tier)) throw new Error('Choose a valid sponsor tier.');
    const id = makeId('sponsor', sponsor.name);
    setSponsors((prev) => [
      ...prev,
      {
        id,
        name: sponsor.name.trim(),
        tier: sponsor.tier,
        logoInitials: (sponsor.logoInitials || sponsor.name.slice(0, 2)).toUpperCase(),
        description: sponsor.description?.trim() || '',
      },
    ]);
    return id;
  }, []);

  const updateSponsor = useCallback((id, patch) => {
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const deleteSponsor = useCallback((id) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ================= Settings =================
  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // ================= Bye announcements =================
  const addByeAnnouncement = useCallback((bye) => {
    if (!bye.round?.trim()) throw new Error('Round is required.');
    if (!bye.teamId) throw new Error('Select the team sitting out.');
    const id = makeId('bye');
    setByeAnnouncements((prev) => [...prev, { id, round: bye.round.trim(), teamId: bye.teamId, note: bye.note?.trim() || '' }]);
    return id;
  }, []);

  const deleteByeAnnouncement = useCallback((id) => {
    setByeAnnouncements((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // ================= Reset =================
  const resetToDefaults = useCallback(() => {
    Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
    setTeams(defaultData.teams);
    setPlayers(defaultData.players);
    setFixtures(defaultData.fixtures);
    setNews(defaultData.news);
    setGallery(defaultData.gallery);
    setSponsors(defaultData.sponsors);
    setSettings(defaultData.settings);
    setByeAnnouncements(defaultData.byeAnnouncements);
  }, []);

  const value = useMemo(
    () => ({
      // raw (editable) collections — used by admin forms
      teams,
      players,
      fixtures,
      news,
      gallery,
      sponsors,
      settings,
      byeAnnouncements,
      // derived (always-correct) collections — used by the public site
      teamsWithStats,
      playersWithStats,
      fixturesDisplay,
      resultsDisplay,
      // CRUD
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayer,
      updatePlayer,
      deletePlayer,
      addFixture,
      updateFixture,
      deleteFixture,
      updateScore,
      clearResult,
      addGoal,
      removeGoal,
      addCard,
      removeCard,
      setMotm,
      addNews,
      updateNews,
      deleteNews,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      addSponsor,
      updateSponsor,
      deleteSponsor,
      updateSettings,
      addByeAnnouncement,
      deleteByeAnnouncement,
      resetToDefaults,
    }),
    [
      teams,
      players,
      fixtures,
      news,
      gallery,
      sponsors,
      settings,
      byeAnnouncements,
      teamsWithStats,
      playersWithStats,
      fixturesDisplay,
      resultsDisplay,
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayer,
      updatePlayer,
      deletePlayer,
      addFixture,
      updateFixture,
      deleteFixture,
      updateScore,
      clearResult,
      addGoal,
      removeGoal,
      addCard,
      removeCard,
      setMotm,
      addNews,
      updateNews,
      deleteNews,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      addSponsor,
      updateSponsor,
      deleteSponsor,
      updateSettings,
      addByeAnnouncement,
      deleteByeAnnouncement,
      resetToDefaults,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
