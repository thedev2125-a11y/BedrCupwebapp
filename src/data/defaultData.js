import teamsJson from './teams.json';
import playersJson from './players.json';
import fixturesJson from './fixtures.json';
import newsJson from './news.json';
import galleryJson from './gallery.json';
import sponsorsJson from './sponsors.json';

/**
 * The original src/data/*.json files bake pre-computed stats (team.points,
 * player.goals, etc.) directly into each record. That's fine for a static
 * site, but it's the wrong shape for an editable one: if an admin edits a
 * score, every one of those baked-in numbers would need to be recalculated
 * and rewritten by hand, and it's easy for them to drift out of sync.
 *
 * This module converts the JSON once, at load time, into a "structured"
 * shape where:
 *   - teams/players carry only their own editable fields (name, group,
 *     coach, position, jersey number, ...) — no stats.
 *   - each fixture carries a `goals` array (which player, which team) and
 *     a `cards` array, instead of a flattened score/scorer string.
 *
 * Standings, top scorers, and match-history displays are then always
 * DERIVED from this structured data (see src/utils/computeStats.js),
 * so they can never go stale — the same guarantee the Supabase-view
 * approach would have given, just computed in the browser instead of SQL.
 *
 * This normalized result becomes the *default* dataset the first time the
 * app runs in a browser; after that, DataContext persists the live,
 * admin-edited version to localStorage and this module is only consulted
 * again if the person clears their data (see DataContext#resetToDefaults).
 */

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function toIsoDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function buildDefaultData() {
  const teams = teamsJson.map((t) => ({
    id: t.id,
    name: t.name,
    group: t.group,
    coach: t.coach,
    logoInitials: t.logoInitials,
    venueNote: t.venueNote || '',
  }));

  const players = playersJson.map((p) => ({
    id: p.id,
    name: p.name,
    teamId: p.teamId,
    position: p.position,
    jerseyNumber: p.jerseyNumber || null,
  }));

  const playerByNameTeam = new Map(players.map((p) => [`${p.name}::${p.teamId}`, p]));
  const teamByName = new Map(teams.map((t) => [t.name, t]));

  // Resolve each fixture's flat "Name (Team)" goalScorer strings back into
  // structured { playerId, teamId } goal records.
  function resolveGoals(fixture) {
    if (!fixture.goalScorers) return [];
    return fixture.goalScorers
      .map((entry, i) => {
        const match = entry.match(/^(.+) \((.+)\)$/);
        if (!match) return null;
        const [, playerName, teamName] = match;
        const team = teamByName.get(teamName);
        const player = team && playerByNameTeam.get(`${playerName}::${team.id}`);
        if (!player || !team) return null;
        return { id: `${fixture.id}-goal-${i}`, playerId: player.id, teamId: team.id };
      })
      .filter(Boolean);
  }

  function resolveMotm(fixture) {
    if (!fixture.motm) return null;
    const player = players.find((p) => p.name === fixture.motm);
    return player ? player.id : null;
  }

  const realTeamIds = new Set(teams.map((t) => t.id));
  const fixtures = fixturesJson
    .filter((f) => realTeamIds.has(f.homeTeam.id) && realTeamIds.has(f.awayTeam.id))
    .map((f) => ({
      id: f.id,
      round: f.round,
      date: toIsoDate(f.date),
      time: f.time,
      venue: f.venue,
      status: f.status,
      homeTeamId: f.homeTeam.id,
      awayTeamId: f.awayTeam.id,
      homeScore: f.homeScore ?? null,
      awayScore: f.awayScore ?? null,
      motmPlayerId: resolveMotm(f),
      goals: resolveGoals(f),
      cards: [],
    }));

  // players.json carries pre-existing yellow/red card *counts* with no
  // record of which match they happened in. Attach each one to that
  // player's team's most recent completed fixture so the seed data still
  // shows realistic cards without inventing fake match details.
  playersJson.forEach((p) => {
    const teamFixtures = fixtures.filter(
      (f) => f.status === 'completed' && (f.homeTeamId === p.teamId || f.awayTeamId === p.teamId)
    );
    if (teamFixtures.length === 0) return;
    const target = teamFixtures[teamFixtures.length - 1];
    for (let i = 0; i < (p.yellowCards || 0); i++) {
      target.cards.push({ id: `${target.id}-card-y-${p.id}-${i}`, playerId: p.id, teamId: p.teamId, cardType: 'yellow' });
    }
    for (let i = 0; i < (p.redCards || 0); i++) {
      target.cards.push({ id: `${target.id}-card-r-${p.id}-${i}`, playerId: p.id, teamId: p.teamId, cardType: 'red' });
    }
  });

  const news = newsJson.map((n) => ({
    id: n.id,
    title: n.title,
    image: n.image,
    publishedAt: toIsoDate(n.date),
    excerpt: n.excerpt,
    content: n.content || n.excerpt,
    featured: !!n.featured,
  }));

  const gallery = galleryJson.map((g) => ({ ...g }));
  const sponsors = sponsorsJson.map((s) => ({ ...s }));

  const settings = {
    tournamentName: 'Village Summer Tournament 2026',
    tagline: 'Unity Through Football',
    startDate: '2026-07-05',
    endDate: '2026-08-09',
    venue: 'Village Community Pitch',
    contactEmail: 'info@villagecup.com',
    contactPhone: '+251 900 000 000',
    organizer: 'BEDR Youth Association',
  };

  const byeAnnouncements = [];

  return { teams, players, fixtures, news, gallery, sponsors, settings, byeAnnouncements };
}

export const defaultData = buildDefaultData();
export { slugify };
