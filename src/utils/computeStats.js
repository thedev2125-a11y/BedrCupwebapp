/**
 * Everything in here is a pure function: given the current teams/players/
 * fixtures arrays, compute the numbers that used to be baked into the JSON.
 * DataContext calls these (memoized) whenever the underlying data changes,
 * so every admin edit is reflected everywhere immediately and correctly —
 * there's no separate "update the standings" step for the admin to forget.
 */

/** Team objects enriched with played/wins/draws/losses/GF/GA/GD/points,
 * computed from completed fixtures only. Shape matches the original
 * teams.json exactly, so TeamCard/StandingsTable/etc. need no changes. */
export function computeStandings(teams, fixtures) {
  const stats = new Map(
    teams.map((t) => [t.id, { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 }])
  );

  fixtures
    .filter((f) => f.status === 'completed' && f.homeScore != null && f.awayScore != null)
    .forEach((f) => {
      const home = stats.get(f.homeTeamId);
      const away = stats.get(f.awayTeamId);
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.gf += f.homeScore;
      home.ga += f.awayScore;
      away.gf += f.awayScore;
      away.ga += f.homeScore;

      if (f.homeScore > f.awayScore) {
        home.wins += 1;
        home.points += 3;
        away.losses += 1;
      } else if (f.homeScore < f.awayScore) {
        away.wins += 1;
        away.points += 3;
        home.losses += 1;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    });

  return teams.map((t) => {
    const s = stats.get(t.id);
    return {
      ...t,
      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,
      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDifference: s.gf - s.ga,
      points: s.points,
      goals: s.gf,
    };
  });
}

/** Player objects enriched with goals/matches/yellowCards/redCards,
 * computed from every fixture's goals[]/cards[] arrays. Shape matches
 * the original players.json exactly. */
export function computePlayerStats(players, fixtures, teams) {
  const teamNameById = new Map(teams.map((t) => [t.id, t.name]));
  const goals = new Map();
  const yellow = new Map();
  const red = new Map();
  const matches = new Map();

  fixtures.forEach((f) => {
    const countsForMatches = f.status === 'completed' || f.status === 'live';
    if (countsForMatches) {
      players
        .filter((p) => p.teamId === f.homeTeamId || p.teamId === f.awayTeamId)
        .forEach((p) => matches.set(p.id, (matches.get(p.id) || 0) + 1));
    }
    (f.goals || []).forEach((g) => goals.set(g.playerId, (goals.get(g.playerId) || 0) + 1));
    (f.cards || []).forEach((c) => {
      const map = c.cardType === 'red' ? red : yellow;
      map.set(c.playerId, (map.get(c.playerId) || 0) + 1);
    });
  });

  return players.map((p) => ({
    ...p,
    team: teamNameById.get(p.teamId) || '',
    goals: goals.get(p.id) || 0,
    matches: matches.get(p.id) || 0,
    yellowCards: yellow.get(p.id) || 0,
    redCards: red.get(p.id) || 0,
  }));
}

/** Fixtures reshaped for display — matches the original fixtures.json /
 * results.json shape (homeTeam:{id,name}, motm as a name string,
 * goalScorers as ["Name (Team)"] strings) so MatchCard etc. are unchanged. */
export function computeFixtureDisplay(fixtures, teams, players) {
  const teamById = new Map(teams.map((t) => [t.id, t]));
  const playerById = new Map(players.map((p) => [p.id, p]));

  return fixtures.map((f) => {
    const home = teamById.get(f.homeTeamId);
    const away = teamById.get(f.awayTeamId);
    const motmPlayer = f.motmPlayerId ? playerById.get(f.motmPlayerId) : null;
    const goalScorers = (f.goals || [])
      .map((g) => {
        const player = playerById.get(g.playerId);
        const team = teamById.get(g.teamId);
        return player && team ? `${player.name} (${team.name})` : null;
      })
      .filter(Boolean);

    return {
      id: f.id,
      round: f.round,
      date: formatDisplayDate(f.date),
      time: f.time,
      venue: f.venue,
      status: f.status,
      homeTeam: home ? { id: home.id, name: home.name, group: home.group } : { id: f.homeTeamId, name: 'TBD' },
      awayTeam: away ? { id: away.id, name: away.name, group: away.group } : { id: f.awayTeamId, name: 'TBD' },
      homeScore: f.homeScore ?? undefined,
      awayScore: f.awayScore ?? undefined,
      motm: motmPlayer ? motmPlayer.name : undefined,
      goalScorers: goalScorers.length ? goalScorers : undefined,
      rawDate: f.date,
    };
  });
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
