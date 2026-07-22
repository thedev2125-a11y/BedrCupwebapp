/**
 * Pure helper functions that derive view-ready data from the raw JSON
 * "database". Keeping this logic here (instead of inline in pages) means
 * every page that needs, say, group standings, computes it the same way.
 */

export function getTeamsByGroup(teams, group) {
  return teams
    .filter((t) => t.group === group)
    .slice()
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
}

export function getTopScorers(players, limit = 100) {
  return players
    .filter((p) => p.goals > 0)
    .slice()
    .sort((a, b) => b.goals - a.goals || a.yellowCards - b.yellowCards)
    .slice(0, limit);
}

export function getPlayersByTeamId(players, teamId) {
  return players.filter((p) => p.teamId === teamId);
}

export function getResultsByTeamId(results, teamId) {
  return results.filter((m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
}

export function getFixturesByTeamId(fixtures, teamId) {
  return fixtures.filter((m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
}

export function getNextMatchForTeam(fixtures, teamId) {
  return fixtures.find(
    (m) => (m.homeTeam.id === teamId || m.awayTeam.id === teamId) && (m.status === 'upcoming' || m.status === 'live')
  );
}

export function getUpcomingFixtures(fixtures, limit = 100) {
  return fixtures.filter((m) => m.status === 'upcoming').slice(0, limit);
}

export function getLiveFixtures(fixtures) {
  return fixtures.filter((m) => m.status === 'live');
}

/** Returns the earliest upcoming (or currently live) match — used for the
 * homepage hero card and the countdown timer. */
export function getFeaturedMatch(fixtures) {
  const live = getLiveFixtures(fixtures);
  if (live.length) return live[0];
  return fixtures.find((m) => m.status === 'upcoming') || null;
}

/** Groups fixtures by their `round` label, preserving first-seen order. */
export function groupByRound(fixtures) {
  const order = [];
  const map = {};
  fixtures.forEach((m) => {
    if (!map[m.round]) {
      map[m.round] = [];
      order.push(m.round);
    }
    map[m.round].push(m);
  });
  return order.map((round) => ({ round, matches: map[round] }));
}

/** The team(s) sitting out in a given round — used for the "Bye Team" widget.
 * Only meaningful for the 5-team group rounds (Round 1–5). */
export function getByeTeams(teams, fixtures, round) {
  const playingIds = new Set();
  fixtures
    .filter((m) => m.round === round)
    .forEach((m) => {
      playingIds.add(m.homeTeam.id);
      playingIds.add(m.awayTeam.id);
    });
  return teams.filter((t) => !playingIds.has(t.id) && !t.id.startsWith('tbd'));
}

export function parseMatchDate(dateStr, timeStr) {
  // dateStr: "Jul 21, 2026", timeStr: "3:00 PM"
  const combined = `${dateStr} ${timeStr}`;
  const d = new Date(combined);
  return isNaN(d.getTime()) ? null : d;
}
