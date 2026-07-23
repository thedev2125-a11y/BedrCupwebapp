import { supabase } from "../lib/supabase";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultData, slugify } from "../data/defaultData";
import {
  computeStandings,
  computePlayerStats,
  computeFixtureDisplay,
} from "../utils/computeStats";

export const DataContext = createContext(null);

const STORAGE_PREFIX = "vst:"; // "Village Summer Tournament"
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

// function loadFromStorage(key, fallback) {
//   if (typeof window === "undefined") return fallback;
//   try {
//     const raw = window.localStorage.getItem(key);
//     return raw ? JSON.parse(raw) : fallback;
//   } catch {
//     return fallback;
//   }
// }

// function saveToStorage(key, value) {
//   try {
//     window.localStorage.setItem(key, JSON.stringify(value));
//   } catch {
//     // localStorage can throw if full or disabled (private browsing) —
//     // the app keeps working in-memory for the rest of the session.
//   }
// }

function makeId(prefix, label) {
  const base = label ? slugify(label).slice(0, 18) : "";
  return `${prefix}${base ? `-${base}` : ""}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
// ================= Supabase ↔ React mappers =================

function mapTeamFromSupabase(team) {
  return {
    id: team.id,
    name: team.name,
    group: team.group,
    coach: team.coach || "",
    logoInitials: team.logo_initials || "",
    venueNote: team.venue_note || "",
  };
}

function mapPlayerFromSupabase(player) {
  return {
    id: player.id,
    name: player.name,
    teamId: player.team_id,
    position: player.position || "Midfielder",
    jerseyNumber: player.jersey_number ?? null,
  };
}

function mapFixtureFromSupabase(fixture) {
  return {
    id: fixture.id,
    round: fixture.round,
    date: fixture.date,
    time: fixture.time || "3:00 PM",
    venue: fixture.venue || "Village Community Pitch",
    status: fixture.status || "upcoming",
    homeTeamId: fixture.home_team_id,
    awayTeamId: fixture.away_team_id,
    homeScore: fixture.home_score ?? null,
    awayScore: fixture.away_score ?? null,
    motmPlayerId: fixture.motm_player_id || null,
    goals: [],
    cards: [],
  };
}

function mapGoalFromSupabase(goal) {
  return {
    id: goal.id,
    fixtureId: goal.fixture_id,
    playerId: goal.player_id,
    teamId: goal.team_id,
  };
}

function mapCardFromSupabase(card) {
  return {
    id: card.id,
    fixtureId: card.fixture_id,
    playerId: card.player_id,
    cardType: card.card_type,
  };
}

function mapNewsFromSupabase(article) {
  return {
    id: article.id,
    title: article.title,
    image: article.image || "",
    publishedAt: article.published_at,
    excerpt: article.expert || "",
    content: article.content || "",
    featured: !!article.featured,
  };
}

function mapGalleryFromSupabase(photo) {
  return {
    id: photo.id,
    category: photo.catagory,
    caption: photo.caption || "",
    image: photo.image || "",
  };
}

function mapSponsorFromSupabase(sponsor) {
  return {
    id: sponsor.id,
    name: sponsor.name,
    tier: sponsor.tier,
    logoInitials: sponsor.logo_initials || "",
    description: sponsor.discription || "",
  };
}

function mapByeFromSupabase(bye) {
  return {
    id: bye.id,
    round: bye.round,
    teamId: bye.team_id,
    note: bye.note || "",
  };
}

function mapSettingsFromSupabase(settings) {
  if (!settings) return defaultData.settings;

  return {
    id: settings.id,
    tournamentName: settings.tournament_name || "",
    tagline: settings.tagline || "",
    startDate: settings.start_date || "",
    endDate: settings.end_date || "",
    venue: settings.venue || "",
    contactEmail: settings.contact_email || "",
    contactPhone: settings.contact_phone || "",
    organizer: settings.organizer || "",
    updatedAt: settings.updated_at || null,
  };
}
// function mapSupabaseTeam(team) {
//   return {
//     id: team.id,
//     name: team.name,
//     group: team.group,
//     coach: team.coach || "",
//     logoInitials: team.logo_initials || "",
//     venueNote: team.venue_note || "",
//   };
// }

// function mapSupabasePlayer(player) {
//   return {
//     id: player.id,
//     name: player.name,
//     teamId: player.team_id,
//     position: player.position || "Midfielder",
//     jerseyNumber: player.jersey_number ?? null,
//   };
// }

export function DataProvider({ children }) {
  //   const loadTournamentData = async () => {
  //     try {
  //       const [
  //         teamsResult,
  //         playersResult,
  //         fixturesResult,
  //         goalsResult,
  //         cardsResult,
  //         newsResult,
  //         galleryResult,
  //         sponsorsResult,
  //         settingsResult,
  //         byeResult,
  //       ] = await Promise.all([
  //         supabase.from("teams").select("*"),

  //         supabase.from("players").select("*"),

  //         supabase.from("fixtures").select("*"),

  //         supabase.from("fixture_goals").select("*"),

  //         supabase.from("fixture_cards").select("*"),

  //         supabase.from("news").select("*"),

  //         supabase.from("gallery").select("*"),

  //         supabase.from("sponsors").select("*"),

  //         supabase.from("settings").select("*").maybeSingle(),

  //         supabase.from("bye_announcements").select("*"),
  //       ]);

  //       // Check for errors
  //       const results = [
  //         teamsResult,
  //         playersResult,
  //         fixturesResult,
  //         goalsResult,
  //         cardsResult,
  //         newsResult,
  //         galleryResult,
  //         sponsorsResult,
  //         settingsResult,
  //         byeResult,
  //       ];

  //       const failedResult = results.find((result) => result.error);

  //       if (failedResult) {
  //         throw failedResult.error;
  //       }

  //       // Teams
  //       const mappedTeams = teamsResult.data.map(mapSupabaseTeam);
  //       setTeams(mappedTeams);

  //       // Players
  //       const mappedPlayers = playersResult.data.map(mapSupabasePlayer);
  //       setPlayers(mappedPlayers);

  //       // Goals and cards
  //       const goals = goalsResult.data || [];

  //       const cards = cardsResult.data || [];

  //       // Fixtures
  //       setFixtures(
  //         fixturesResult.data.map((fixture) => {
  //           const fixtureGoals = goals.filter(
  //             (goal) => goal.fixture_id === fixture.id,
  //           );

  //           const fixtureCards = cards.filter(
  //             (card) => card.fixture_id === fixture.id,
  //           );

  //           return mapFixtureFromSupabase(fixture, fixtureGoals, fixtureCards);
  //         }),
  //       );

  //       // News
  //       setNews(
  //         (newsResult.data || []).map((item) => ({
  //           id: item.id,
  //           title: item.title,
  //           image: item.image || "",
  //           publishedAt: item.published_at,
  //           excerpt: item.excerpt || "",
  //           content: item.content || "",
  //           featured: !!item.featured,
  //         })),
  //       );

  //       // Gallery
  //       setGallery(
  //   (galleryResult.data || []).map(
  //     (item) => ({
  //       id: item.id,
  //       category: item.category,
  //       caption:
  //         item.caption || '',
  //       image:
  //         item.image || '',
  //     })
  //   )
  // );

  //       // Sponsors
  //       setSponsors(
  //   (sponsorsResult.data || []).map(
  //     (item) => ({
  //       id: item.id,
  //       name: item.name,
  //       tier: item.tier,
  //       logoInitials:
  //         item.logo_initials || '',
  //       description:
  //         item.description || '',
  //     })
  //   )
  // );

  //       // Settings
  //       if (settingsResult.data) {
  //   setSettings({
  //     id: settingsResult.data.id,
  //     tournamentName:
  //       settingsResult.data
  //         .tournament_name || '',
  //     tagline:
  //       settingsResult.data
  //         .tagline || '',
  //     startDate:
  //       settingsResult.data
  //         .start_date || '',
  //     endDate:
  //       settingsResult.data
  //         .end_date || '',
  //     venue:
  //       settingsResult.data
  //         .venue || '',
  //     contactEmail:
  //       settingsResult.data
  //         .contact_email || '',
  //     contactPhone:
  //       settingsResult.data
  //         .contact_phone || '',
  //     organizer:
  //       settingsResult.data
  //         .organizer || '',
  //     updatedAt:
  //       settingsResult.data
  //         .updated_at || null,
  //   });
  // }

  //       // Bye announcements
  //       setByeAnnouncements(
  //   (byeResult.data || []).map(
  //     (item) => ({
  //       id: item.id,
  //       round: item.round,
  //       teamId: item.team_id,
  //       note: item.note || '',
  //     })
  //   )
  // );

  //       console.log("✅ All tournament data loaded from Supabase");
  //     } catch (error) {
  //       console.error("❌ Failed to load tournament data from Supabase:", error);
  //     }
  //   };
  const loadAllData = async () => {
    try {
      const [
        teamsResult,
        playersResult,
        fixturesResult,
        goalsResult,
        cardsResult,
        newsResult,
        galleryResult,
        sponsorsResult,
        settingsResult,
        byeResult,
      ] = await Promise.all([
        supabase.from("teams").select("*"),
        supabase.from("players").select("*"),
        supabase.from("fixtures").select("*"),
        supabase.from("fixture_goals").select("*"),
        supabase.from("fixture_cards").select("*"),
        supabase.from("news").select("*"),
        supabase.from("gallery").select("*"),
        supabase.from("sponsors").select("*"),
        supabase.from("settings").select("*").maybeSingle(),
        supabase.from("bye_announcements").select("*"),
      ]);

      if (teamsResult.error) throw teamsResult.error;
      if (playersResult.error) throw playersResult.error;
      if (fixturesResult.error) throw fixturesResult.error;
      if (goalsResult.error) throw goalsResult.error;
      if (cardsResult.error) throw cardsResult.error;
      if (newsResult.error) throw newsResult.error;
      if (galleryResult.error) throw galleryResult.error;
      if (sponsorsResult.error) throw sponsorsResult.error;
      if (settingsResult.error) throw settingsResult.error;
      if (byeResult.error) throw byeResult.error;

      const mappedTeams = teamsResult.data.map(mapTeamFromSupabase);

      const mappedPlayers = playersResult.data.map(mapPlayerFromSupabase);

      const mappedGoals = goalsResult.data.map(mapGoalFromSupabase);

      const mappedCards = cardsResult.data.map(mapCardFromSupabase);

      const mappedFixtures = fixturesResult.data.map((fixture) => ({
        ...mapFixtureFromSupabase(fixture),

        goals: mappedGoals.filter((goal) => goal.fixtureId === fixture.id),

        cards: mappedCards.filter((card) => card.fixtureId === fixture.id),
      }));

      setTeams(mappedTeams);
      setPlayers(mappedPlayers);
      setFixtures(mappedFixtures);

      setNews(newsResult.data.map(mapNewsFromSupabase));

      setGallery(galleryResult.data.map(mapGalleryFromSupabase));

      setSponsors(sponsorsResult.data.map(mapSponsorFromSupabase));

      setSettings(mapSettingsFromSupabase(settingsResult.data));

      setByeAnnouncements(byeResult.data.map(mapByeFromSupabase));

      console.log("✅ All tournament data loaded from Supabase");
    } catch (error) {
      console.error("❌ Failed to load tournament data from Supabase:", error);
    }
  };
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [settings, setSettings] = useState(defaultData.settings);
  const [byeAnnouncements, setByeAnnouncements] = useState([]);
  useEffect(() => {
    loadAllData();
  }, []);

  // useEffect(() => saveToStorage(KEYS.teams, teams), [teams]);
  // useEffect(() => saveToStorage(KEYS.players, players), [players]);
  // useEffect(() => saveToStorage(KEYS.fixtures, fixtures), [fixtures]);
  // useEffect(() => saveToStorage(KEYS.news, news), [news]);
  // useEffect(() => saveToStorage(KEYS.gallery, gallery), [gallery]);
  // useEffect(() => saveToStorage(KEYS.sponsors, sponsors), [sponsors]);
  // useEffect(() => saveToStorage(KEYS.settings, settings), [settings]);
  // useEffect(
  //   () => saveToStorage(KEYS.byeAnnouncements, byeAnnouncements),
  //   [byeAnnouncements],
  // );

  // ---------- derived, always-correct data ----------
  const teamsWithStats = useMemo(
    () => computeStandings(teams, fixtures),
    [teams, fixtures],
  );
  const playersWithStats = useMemo(
    () => computePlayerStats(players, fixtures, teams),
    [players, fixtures, teams],
  );
  const fixturesDisplay = useMemo(
    () => computeFixtureDisplay(fixtures, teams, players),
    [fixtures, teams, players],
  );
  const resultsDisplay = useMemo(
    () => fixturesDisplay.filter((f) => f.status === "completed"),
    [fixturesDisplay],
  );

  // ================= Teams =================
  const addTeam = useCallback(async (team) => {
    if (!team.name?.trim()) {
      throw new Error("Team name is required.");
    }

    if (!["A", "B"].includes(team.group)) {
      throw new Error("Team must be assigned to Group A or Group B.");
    }

    const id = makeId("team", team.name);

    const newTeam = {
      id,
      name: team.name.trim(),
      group: team.group,
      coach: team.coach?.trim() || "",
      logo_initials: (team.logoInitials || team.name.slice(0, 2)).toUpperCase(),
      venue_note: team.venueNote?.trim() || "",
    };

    const { data, error } = await supabase
      .from("teams")
      .insert(newTeam)
      .select()
      .single();

    if (error) {
      console.error("Error adding team:", error);
      throw new Error(error.message);
    }

    setTeams((prev) => [...prev, mapTeamFromSupabase(data)]);

    return data.id;
  }, []);

  const updateTeam = useCallback(async (id, patch) => {
    if (patch.name !== undefined && !patch.name.trim()) {
      throw new Error("Team name is required.");
    }

    if (patch.group !== undefined && !["A", "B"].includes(patch.group)) {
      throw new Error("Team must be assigned to Group A or Group B.");
    }

    const supabasePatch = {};

    if (patch.name !== undefined) {
      supabasePatch.name = patch.name.trim();
    }

    if (patch.group !== undefined) {
      supabasePatch.group = patch.group;
    }

    if (patch.coach !== undefined) {
      supabasePatch.coach = patch.coach.trim();
    }

    if (patch.logoInitials !== undefined) {
      supabasePatch.logo_initials = patch.logoInitials;
    }

    if (patch.venueNote !== undefined) {
      supabasePatch.venue_note = patch.venueNote.trim();
    }

    const { data, error } = await supabase
      .from("teams")
      .update(supabasePatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating team:", error);
      throw new Error(error.message);
    }

    setTeams((prev) =>
      prev.map((team) => (team.id === id ? mapTeamFromSupabase(data) : team)),
    );
  }, []);

  const deleteTeam = useCallback(async (id) => {
    // Delete the team from Supabase
    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) {
      console.error("Error deleting team:", error);
      throw new Error(error.message);
    }

    // Update local React state
    setTeams((prev) => prev.filter((team) => team.id !== id));

    setPlayers((prev) => prev.filter((player) => player.teamId !== id));

    setFixtures((prev) =>
      prev.filter(
        (fixture) => fixture.homeTeamId !== id && fixture.awayTeamId !== id,
      ),
    );

    setByeAnnouncements((prev) => prev.filter((bye) => bye.teamId !== id));
  }, []);

  // ================= Players =================
  const addPlayer = useCallback(
    async (player) => {
      if (!player.name?.trim()) {
        throw new Error("Player name is required.");
      }

      if (!player.teamId) {
        throw new Error("Player must be assigned to a team.");
      }

      if (!teams.some((team) => team.id === player.teamId)) {
        throw new Error("Selected team does not exist.");
      }

      const id = makeId("player", player.name);

      const newPlayer = {
        id,
        name: player.name.trim(),
        team_id: player.teamId,
        position: player.position || "Midfielder",
        jersey_number: player.jerseyNumber ? Number(player.jerseyNumber) : null,
      };

      const { data, error } = await supabase
        .from("players")
        .insert(newPlayer)
        .select()
        .single();

      if (error) {
        console.error("Error adding player:", error);
        throw new Error(error.message);
      }

      setPlayers((prev) => [...prev, mapPlayerFromSupabase(data)]);

      return data.id;
    },
    [teams],
  );

  const updatePlayer = useCallback(
    async (id, patch) => {
      if (patch.name !== undefined && !patch.name.trim()) {
        throw new Error("Player name is required.");
      }

      if (
        patch.teamId !== undefined &&
        !teams.some((team) => team.id === patch.teamId)
      ) {
        throw new Error("Selected team does not exist.");
      }

      const supabasePatch = {};

      if (patch.name !== undefined) {
        supabasePatch.name = patch.name.trim();
      }

      if (patch.teamId !== undefined) {
        supabasePatch.team_id = patch.teamId;
      }

      if (patch.position !== undefined) {
        supabasePatch.position = patch.position;
      }

      if (patch.jerseyNumber !== undefined) {
        supabasePatch.jersey_number = Number(patch.jerseyNumber) || null;
      }

      const { data, error } = await supabase
        .from("players")
        .update(supabasePatch)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating player:", error);
        throw new Error(error.message);
      }

      setPlayers((prev) =>
        prev.map((player) =>
          player.id === id ? mapPlayerFromSupabase(data) : player,
        ),
      );
    },
    [teams],
  );

  const deletePlayer = useCallback(async (id) => {
    // Delete player from Supabase
    const { error } = await supabase.from("players").delete().eq("id", id);

    if (error) {
      console.error("Error deleting player:", error);
      throw new Error(error.message);
    }

    // Update React state
    setPlayers((prev) => prev.filter((player) => player.id !== id));

    // Remove player references from fixture data
    setFixtures((prev) =>
      prev.map((fixture) => ({
        ...fixture,
        goals: fixture.goals.filter((goal) => goal.playerId !== id),
        cards: fixture.cards.filter((card) => card.playerId !== id),
        motmPlayerId: fixture.motmPlayerId === id ? null : fixture.motmPlayerId,
      })),
    );
  }, []);

  // ================= Fixtures / Matches =================
  const addFixture = useCallback(async (fixture) => {
    if (!fixture.round?.trim()) {
      throw new Error("Round is required.");
    }

    if (!fixture.date) {
      throw new Error("Match date is required.");
    }

    if (!fixture.homeTeamId || !fixture.awayTeamId) {
      throw new Error("Both home and away teams are required.");
    }

    if (fixture.homeTeamId === fixture.awayTeamId) {
      throw new Error("Home and away teams must be different.");
    }

    const newFixture = {
      id: makeId("match"),
      round: fixture.round.trim(),
      date: fixture.date,
      time: fixture.time || "3:00 PM",
      venue: fixture.venue?.trim() || "Village Community Pitch",
      status: fixture.status || "upcoming",
      home_team_id: fixture.homeTeamId,
      away_team_id: fixture.awayTeamId,
      home_score: fixture.homeScore ?? null,
      away_score: fixture.awayScore ?? null,
      motm_player_id: null,
    };

    const { data, error } = await supabase
      .from("fixtures")
      .insert(newFixture)
      .select()
      .single();

    if (error) {
      console.error("Error adding fixture:", error);

      throw new Error(error.message);
    }

    const mappedFixture = {
      id: data.id,
      round: data.round,
      date: data.date,
      time: data.time,
      venue: data.venue,
      status: data.status,
      homeTeamId: data.home_team_id,
      awayTeamId: data.away_team_id,
      homeScore: data.home_score,
      awayScore: data.away_score,
      motmPlayerId: data.motm_player_id,
      goals: [],
      cards: [],
    };

    setFixtures((prev) => [...prev, mappedFixture]);

    return data.id;
  }, []);

  const updateFixture = useCallback(async (id, patch) => {
    if (
      patch.homeTeamId &&
      patch.awayTeamId &&
      patch.homeTeamId === patch.awayTeamId
    ) {
      throw new Error("Home and away teams must be different.");
    }

    const supabasePatch = {};

    if (patch.round !== undefined) {
      supabasePatch.round = patch.round.trim();
    }

    if (patch.date !== undefined) {
      supabasePatch.date = patch.date;
    }

    if (patch.time !== undefined) {
      supabasePatch.time = patch.time;
    }

    if (patch.venue !== undefined) {
      supabasePatch.venue = patch.venue.trim();
    }

    if (patch.status !== undefined) {
      supabasePatch.status = patch.status;
    }

    if (patch.homeTeamId !== undefined) {
      supabasePatch.home_team_id = patch.homeTeamId;
    }

    if (patch.awayTeamId !== undefined) {
      supabasePatch.away_team_id = patch.awayTeamId;
    }

    if (patch.homeScore !== undefined) {
      supabasePatch.home_score =
        patch.homeScore === "" ? null : Number(patch.homeScore);
    }

    if (patch.awayScore !== undefined) {
      supabasePatch.away_score =
        patch.awayScore === "" ? null : Number(patch.awayScore);
    }

    if (patch.motmPlayerId !== undefined) {
      supabasePatch.motm_player_id = patch.motmPlayerId || null;
    }

    const { data, error } = await supabase
      .from("fixtures")
      .update(supabasePatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating fixture:", error);

      throw new Error(error.message);
    }

    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === id
          ? {
              ...fixture,
              round: data.round,
              date: data.date,
              time: data.time,
              venue: data.venue,
              status: data.status,
              homeTeamId: data.home_team_id,
              awayTeamId: data.away_team_id,
              homeScore: data.home_score,
              awayScore: data.away_score,
              motmPlayerId: data.motm_player_id,
            }
          : fixture,
      ),
    );
  }, []);

  const deleteFixture = useCallback(async (id) => {
    // Delete related goals
    const { error: goalsError } = await supabase
      .from("fixture_goals")
      .delete()
      .eq("fixture_id", id);

    if (goalsError) {
      console.error("Error deleting fixture goals:", goalsError);

      throw new Error(goalsError.message);
    }

    // Delete related cards
    const { error: cardsError } = await supabase
      .from("fixture_cards")
      .delete()
      .eq("fixture_id", id);

    if (cardsError) {
      console.error("Error deleting fixture cards:", cardsError);

      throw new Error(cardsError.message);
    }

    // Delete fixture
    const { error: fixtureError } = await supabase
      .from("fixtures")
      .delete()
      .eq("id", id);

    if (fixtureError) {
      console.error("Error deleting fixture:", fixtureError);

      throw new Error(fixtureError.message);
    }

    // Update React state
    setFixtures((prev) => prev.filter((fixture) => fixture.id !== id));
  }, []);

  /** Live-score / status quick update. */
  const updateScore = useCallback(
    async (id, { homeScore, awayScore, status }) => {
      const updateData = {};

      if (homeScore !== "" && homeScore !== undefined) {
        updateData.home_score = Number(homeScore);
      }

      if (awayScore !== "" && awayScore !== undefined) {
        updateData.away_score = Number(awayScore);
      }

      if (status) {
        updateData.status = status;
      }

      const { data, error } = await supabase
        .from("fixtures")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating score:", error);

        throw new Error(error.message);
      }

      setFixtures((prev) =>
        prev.map((fixture) =>
          fixture.id === id
            ? {
                ...fixture,
                homeScore: data.home_score,
                awayScore: data.away_score,
                status: data.status,
              }
            : fixture,
        ),
      );
    },
    [],
  );

  /** Resets a fixture back to upcoming with no score/goals/cards/MOTM —
   * this is the "delete a result" action (the fixture itself stays). */
  const clearResult = useCallback(async (id) => {
    // Reset fixture score
    const { error: fixtureError } = await supabase
      .from("fixtures")
      .update({
        status: "upcoming",
        home_score: null,
        away_score: null,
        motm_player_id: null,
      })
      .eq("id", id);

    if (fixtureError) {
      console.error("Error clearing fixture result:", fixtureError);

      throw new Error(fixtureError.message);
    }

    // Remove goals
    const { error: goalsError } = await supabase
      .from("fixture_goals")
      .delete()
      .eq("fixture_id", id);

    if (goalsError) {
      throw new Error(goalsError.message);
    }

    // Remove cards
    const { error: cardsError } = await supabase
      .from("fixture_cards")
      .delete()
      .eq("fixture_id", id);

    if (cardsError) {
      throw new Error(cardsError.message);
    }

    // Update React state
    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === id
          ? {
              ...fixture,
              status: "upcoming",
              homeScore: null,
              awayScore: null,
              motmPlayerId: null,
              goals: [],
              cards: [],
            }
          : fixture,
      ),
    );
  }, []);

  const addGoal = useCallback(
    async (fixtureId, { playerId, teamId }) => {
      if (!playerId || !teamId) {
        throw new Error("Select a player to add a goal.");
      }

      // Make sure the player exists
      const player = players.find((p) => p.id === playerId);

      if (!player) {
        throw new Error("Selected player does not exist.");
      }

      // Make sure the player belongs to the selected team
      if (player.teamId !== teamId) {
        throw new Error(
          "Selected player does not belong to the selected team.",
        );
      }

      const newGoal = {
        id: makeId("goal"),
        fixture_id: fixtureId,
        player_id: playerId,
        team_id: teamId,
      };

      const { data, error } = await supabase
        .from("fixture_goals")
        .insert(newGoal)
        .select()
        .single();

      if (error) {
        console.error("Error adding goal:", error);

        throw new Error(error.message);
      }

      const mappedGoal = {
  id: data.id,
  fixtureId: data.fixture_id,
  playerId: data.player_id,
  teamId: data.team_id,
};

      setFixtures((prev) =>
        prev.map((fixture) =>
          fixture.id === fixtureId
            ? {
                ...fixture,
                goals: [...(fixture.goals || []), mappedGoal],
              }
            : fixture,
        ),
      );

      return data.id;
    },
    [players],
  );

  const removeGoal = useCallback(async (fixtureId, goalId) => {
    const { error } = await supabase
      .from("fixture_goals")
      .delete()
      .eq("id", goalId)
      .eq("fixture_id", fixtureId);

    if (error) {
      console.error("Error removing goal:", error);

      throw new Error(error.message);
    }

    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === fixtureId
          ? {
              ...fixture,
              goals: (fixture.goals || []).filter((goal) => goal.id !== goalId),
            }
          : fixture,
      ),
    );
  }, []);
  const addCard = useCallback(
    async (fixtureId, { playerId, teamId, cardType }) => {
      if (!playerId || !teamId) {
        throw new Error("Select a player to add a card.");
      }

      if (!["yellow", "red"].includes(cardType)) {
        throw new Error("Card type must be yellow or red.");
      }

      // Make sure the player exists
      const player = players.find((p) => p.id === playerId);

      if (!player) {
        throw new Error("Selected player does not exist.");
      }

      // Make sure player belongs to selected team
      if (player.teamId !== teamId) {
        throw new Error(
          "Selected player does not belong to the selected team.",
        );
      }

      const newCard = {
        id: makeId("card"),
        fixture_id: fixtureId,
        player_id: playerId,
        card_type: cardType,
      };

      const { data, error } = await supabase
        .from("fixture_cards")
        .insert(newCard)
        .select()
        .single();

      if (error) {
        console.error("Error adding card:", error);

        throw new Error(error.message);
      }

      const mappedCard = {
        id: data.id,
        fixtureId: data.fixture_id,
        playerId: data.player_id,
        cardType: data.card_type,
      };

      setFixtures((prev) =>
        prev.map((fixture) =>
          fixture.id === fixtureId
            ? {
                ...fixture,
                cards: [...(fixture.cards || []), mappedCard],
              }
            : fixture,
        ),
      );

      return data.id;
    },
    [players],
  );

  const removeCard = useCallback(async (fixtureId, cardId) => {
    const { error } = await supabase
      .from("fixture_cards")
      .delete()
      .eq("id", cardId)
      .eq("fixture_id", fixtureId);

    if (error) {
      console.error("Error removing card:", error);

      throw new Error(error.message);
    }

    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === fixtureId
          ? {
              ...fixture,
              cards: (fixture.cards || []).filter((card) => card.id !== cardId),
            }
          : fixture,
      ),
    );
  }, []);

  const setMotm = useCallback(async (fixtureId, playerId) => {
    const { data, error } = await supabase
      .from("fixtures")
      .update({
        motm_player_id: playerId || null,
      })
      .eq("id", fixtureId)
      .select()
      .single();

    if (error) {
      console.error("Error setting Man of the Match:", error);

      throw new Error(error.message);
    }

    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === fixtureId
          ? {
              ...fixture,
              motmPlayerId: data.motm_player_id,
            }
          : fixture,
      ),
    );
  }, []);

  // ================= News =================
  const addNews = useCallback(async (article) => {
    if (!article.title?.trim()) {
      throw new Error("News title is required.");
    }

    const newNews = {
      id: makeId("news", article.title),
      title: article.title.trim(),
      image: article.image?.trim() || "",
      published_at:
        article.publishedAt || new Date().toISOString().slice(0, 10),
      excerpt: article.excerpt?.trim() || "",
      content: article.content?.trim() || article.excerpt?.trim() || "",
      featured: !!article.featured,
    };

    const { data, error } = await supabase
      .from("news")
      .insert(newNews)
      .select()
      .single();

    if (error) {
      console.error("Error adding news:", error);
      throw new Error(error.message);
    }

    const mappedNews = {
      id: data.id,
      title: data.title,
      image: data.image || "",
      publishedAt: data.published_at,
      excerpt: data.excerpt || "",
      content: data.content || "",
      featured: !!data.featured,
    };

    setNews((prev) => [mappedNews, ...prev]);

    return data.id;
  }, []);

  const updateNews = useCallback(async (id, patch) => {
    if (patch.title !== undefined && !patch.title.trim()) {
      throw new Error("News title is required.");
    }

    const supabasePatch = {};

    if (patch.title !== undefined) {
      supabasePatch.title = patch.title.trim();
    }

    if (patch.image !== undefined) {
      supabasePatch.image = patch.image?.trim() || "";
    }

    if (patch.publishedAt !== undefined) {
      supabasePatch.published_at = patch.publishedAt;
    }

    if (patch.excerpt !== undefined) {
      supabasePatch.excerpt = patch.excerpt?.trim() || "";
    }

    if (patch.content !== undefined) {
      supabasePatch.content = patch.content?.trim() || "";
    }

    if (patch.featured !== undefined) {
      supabasePatch.featured = !!patch.featured;
    }

    const { data, error } = await supabase
      .from("news")
      .update(supabasePatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating news:", error);

      throw new Error(error.message);
    }

    const mappedNews = {
      id: data.id,
      title: data.title,
      image: data.image || "",
      publishedAt: data.published_at,
      excerpt: data.excerpt || "",
      content: data.content || "",
      featured: !!data.featured,
    };

    setNews((prev) => prev.map((item) => (item.id === id ? mappedNews : item)));
  }, []);

  const deleteNews = useCallback(async (id) => {
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      console.error("Error deleting news:", error);

      throw new Error(error.message);
    }

    setNews((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ================= Gallery =================
  const addGalleryImage = useCallback(async (photo) => {
    if (!photo.image?.trim()) {
      throw new Error("Image URL is required.");
    }

    if (
      !["Matches", "Fans", "Training", "Celebrations"].includes(photo.category)
    ) {
      throw new Error("Choose a valid category.");
    }

    const newGalleryImage = {
      id: makeId("photo"),
      category: photo.category,
      caption: photo.caption?.trim() || "",
      image: photo.image.trim(),
    };

    const { data, error } = await supabase
      .from("gallery")
      .insert(newGalleryImage)
      .select()
      .single();

    if (error) {
      console.error("Error adding gallery image:", error);

      throw new Error(error.message);
    }

    setGallery((prev) => [
      {
        id: data.id,
        category: data.category,
        caption: data.caption || "",
        image: data.image,
      },
      ...prev,
    ]);

    return data.id;
  }, []);

  const updateGalleryImage = useCallback(async (id, patch) => {
    const supabasePatch = {};

    if (patch.category !== undefined) {
      if (
        !["Matches", "Fans", "Training", "Celebrations"].includes(
          patch.category,
        )
      ) {
        throw new Error("Choose a valid category.");
      }

      supabasePatch.category = patch.category;
    }

    if (patch.caption !== undefined) {
      supabasePatch.caption = patch.caption?.trim() || "";
    }

    if (patch.image !== undefined) {
      if (!patch.image?.trim()) {
        throw new Error("Image URL is required.");
      }

      supabasePatch.image = patch.image.trim();
    }

    const { data, error } = await supabase
      .from("gallery")
      .update(supabasePatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery image:", error);

      throw new Error(error.message);
    }

    setGallery((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              id: data.id,
              category: data.category,
              caption: data.caption || "",
              image: data.image,
            }
          : item,
      ),
    );
  }, []);

  const deleteGalleryImage = useCallback(async (id) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Error deleting gallery image:", error);

      throw new Error(error.message);
    }

    setGallery((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ================= Sponsors =================
  const addSponsor = useCallback(async (sponsor) => {
    if (!sponsor.name?.trim()) {
      throw new Error("Sponsor name is required.");
    }

    if (!["gold", "silver", "bronze"].includes(sponsor.tier)) {
      throw new Error("Choose a valid sponsor tier.");
    }

    const newSponsor = {
      id: makeId("sponsor", sponsor.name),
      name: sponsor.name.trim(),
      tier: sponsor.tier,
      logo_initials: (
        sponsor.logoInitials || sponsor.name.slice(0, 2)
      ).toUpperCase(),
      description: sponsor.description?.trim() || "",
    };

    const { data, error } = await supabase
      .from("sponsors")
      .insert(newSponsor)
      .select()
      .single();

    if (error) {
      console.error("Error adding sponsor:", error);

      throw new Error(error.message);
    }

    setSponsors((prev) => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        tier: data.tier,
        logoInitials: data.logo_initials || "",
        description: data.description || "",
      },
    ]);

    return data.id;
  }, []);
  const updateSponsor = useCallback(async (id, patch) => {
    if (patch.name !== undefined && !patch.name.trim()) {
      throw new Error("Sponsor name is required.");
    }

    if (
      patch.tier !== undefined &&
      !["gold", "silver", "bronze"].includes(patch.tier)
    ) {
      throw new Error("Choose a valid sponsor tier.");
    }

    const supabasePatch = {};

    if (patch.name !== undefined) {
      supabasePatch.name = patch.name.trim();
    }

    if (patch.tier !== undefined) {
      supabasePatch.tier = patch.tier;
    }

    if (patch.logoInitials !== undefined) {
      supabasePatch.logo_initials = (patch.logoInitials || "").toUpperCase();
    }

    if (patch.description !== undefined) {
      supabasePatch.description = patch.description?.trim() || "";
    }

    const { data, error } = await supabase
      .from("sponsors")
      .update(supabasePatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating sponsor:", error);

      throw new Error(error.message);
    }

    setSponsors((prev) =>
      prev.map((sponsor) =>
        sponsor.id === id
          ? {
              id: data.id,
              name: data.name,
              tier: data.tier,
              logoInitials: data.logo_initials || "",
              description: data.description || "",
            }
          : sponsor,
      ),
    );
  }, []);

  const deleteSponsor = useCallback(async (id) => {
    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      console.error("Error deleting sponsor:", error);

      throw new Error(error.message);
    }

    setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== id));
  }, []);

  // ================= Settings =================
 const updateSettings = useCallback(
  async (patch) => {
    if (!settings?.id) {
      throw new Error("Settings record not found.");
    }

    const supabasePatch = {};

    if (patch.tournamentName !== undefined) {
      supabasePatch.tournament_name = patch.tournamentName.trim();
    }

    if (patch.tagline !== undefined) {
      supabasePatch.tagline = patch.tagline.trim();
    }

    if (patch.startDate !== undefined) {
      supabasePatch.start_date = patch.startDate || null;
    }

    if (patch.endDate !== undefined) {
      supabasePatch.end_date = patch.endDate || null;
    }

    if (patch.venue !== undefined) {
      supabasePatch.venue = patch.venue.trim();
    }

    if (patch.contactEmail !== undefined) {
      supabasePatch.contact_email = patch.contactEmail.trim();
    }

    if (patch.contactPhone !== undefined) {
      supabasePatch.contact_phone = patch.contactPhone.trim();
    }

    if (patch.organizer !== undefined) {
      supabasePatch.organizer = patch.organizer.trim();
    }

    supabasePatch.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("settings")
      .update(supabasePatch)
      .eq("id", settings.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      throw new Error(error.message);
    }

    // Update React state immediately
    setSettings(mapSettingsFromSupabase(data));

    console.log("✅ Settings updated:", data);
  },
  [settings?.id],
);

  // ================= Bye announcements =================
  const addByeAnnouncement = useCallback(
    async (bye) => {
      if (!bye.round?.trim()) {
        throw new Error("Round is required.");
      }

      if (!bye.teamId) {
        throw new Error("Select the team sitting out.");
      }

      // Make sure the selected team exists
      if (!teams.some((team) => team.id === bye.teamId)) {
        throw new Error("Selected team does not exist.");
      }

      const newBye = {
        id: makeId("bye"),
        round: bye.round.trim(),
        team_id: bye.teamId,
        note: bye.note?.trim() || "",
      };

      const { data, error } = await supabase
        .from("bye_announcements")
        .insert(newBye)
        .select()
        .single();

      if (error) {
        console.error("Error adding bye announcement:", error);

        throw new Error(error.message);
      }

      setByeAnnouncements((prev) => [
        ...prev,
        {
          id: data.id,
          round: data.round,
          teamId: data.team_id,
          note: data.note || "",
        },
      ]);

      return data.id;
    },
    [teams],
  );

  const deleteByeAnnouncement = useCallback(async (id) => {
    const { error } = await supabase
      .from("bye_announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting bye announcement:", error);

      throw new Error(error.message);
    }

    setByeAnnouncements((prev) => prev.filter((bye) => bye.id !== id));
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
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
