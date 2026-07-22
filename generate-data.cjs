// One-off generator script — run with node, not shipped in the app.
// Produces the /src/data/*.json fake-database files with realistic,
// internally-consistent sample data (goals tally to standings, etc).

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'src', 'data');

// ---------- Teams ----------
const GROUP_A = [
  { id: 'a1', name: 'Thunder Hawks FC', coach: 'Getachew Bekele', venueNote: 'Home end: North Goal' },
  { id: 'a2', name: 'Green Valley FC', coach: 'Selam Tadesse', venueNote: 'Home end: South Goal' },
  { id: 'a3', name: 'River Side United', coach: 'Dawit Mekonnen', venueNote: 'Home end: East Goal' },
  { id: 'a4', name: 'Highland Strikers', coach: 'Rahel Girma', venueNote: 'Home end: West Goal' },
  { id: 'a5', name: 'Sunrise Rovers', coach: 'Yonas Alemu', venueNote: 'Home end: North Goal' },
];
const GROUP_B = [
  { id: 'b1', name: 'Iron Lions FC', coach: 'Mulugeta Assefa', venueNote: 'Home end: South Goal' },
  { id: 'b2', name: 'Golden Eagles', coach: 'Hanna Worku', venueNote: 'Home end: East Goal' },
  { id: 'b3', name: 'Village Warriors', coach: 'Tesfaye Lemma', venueNote: 'Home end: West Goal' },
  { id: 'b4', name: 'Red Star Boys', coach: 'Bethlehem Fikru', venueNote: 'Home end: North Goal' },
  { id: 'b5', name: 'Community United', coach: 'Amanuel Tsegaye', venueNote: 'Home end: South Goal' },
];

const teamsBase = [
  ...GROUP_A.map((t) => ({ ...t, group: 'A' })),
  ...GROUP_B.map((t) => ({ ...t, group: 'B' })),
];

// ---------- Players (6 per team = 60 total) ----------
const FIRST_NAMES = ['Abel','Biniam','Caleb','Dawit','Ezra','Fikru','Girma','Henok','Isaac','Jemal','Kaleb','Lidet','Mekdes','Natnael','Obsa','Petros','Robel','Samuel','Tewodros','Yared','Zelalem','Alazar','Bereket','Chala','Daniel','Eyob','Feven','Gemechu','Hiwot','Ismael'];
const LAST_NAMES = ['Alemu','Bekele','Chala','Desta','Endale','Fantaye','Girma','Haile','Iyasu','Jemberu','Kebede','Lemma','Mengistu','Negash','Oljira','Petros','Regassa','Sisay','Tadesse','Urgessa','Worku','Yohannes','Zeleke'];

let nameCursor = 0;
function nextName() {
  const first = FIRST_NAMES[nameCursor % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(nameCursor / FIRST_NAMES.length) % LAST_NAMES.length];
  nameCursor++;
  return `${first} ${last}`;
}

const POSITIONS = ['Goalkeeper', 'Defender', 'Defender', 'Midfielder', 'Midfielder', 'Forward'];

const players = [];
let playerCounter = 1;
const playersByTeam = {};

for (const team of teamsBase) {
  playersByTeam[team.id] = [];
  for (let i = 0; i < 6; i++) {
    const id = `p${String(playerCounter).padStart(3, '0')}`;
    const player = {
      id,
      name: nextName(),
      team: team.name,
      teamId: team.id,
      position: POSITIONS[i],
      jerseyNumber: i === 0 ? 1 : i + 1 + Math.floor(Math.random() * 3),
      goals: 0,
      matches: 0,
      yellowCards: 0,
      redCards: 0,
    };
    players.push(player);
    playersByTeam[team.id].push(player);
    playerCounter++;
  }
}

// ---------- Round-robin schedule (circle method, 5 teams + bye) ----------
// Produces, for a 5-team group: 5 rounds x 2 matches, one bye per round.
function roundRobinPairs(teamIds) {
  // teamIds: array of 5 ids. Returns { rounds: [[ [home,away], [home,away] ]...], byes: [id,...] }
  const withBye = [...teamIds, 'BYE'];
  let arr = [...withBye];
  const rounds = [];
  const byes = [];
  for (let r = 0; r < 5; r++) {
    const pairs = [];
    let bye = null;
    for (let i = 0; i < 3; i++) {
      const a = arr[i];
      const b = arr[5 - i];
      if (a === 'BYE') bye = b;
      else if (b === 'BYE') bye = a;
      else pairs.push([a, b]);
    }
    rounds.push(pairs);
    byes.push(bye);
    // rotate all but the first element
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    arr = [fixed, ...rest];
  }
  return { rounds, byes };
}

const groupAIds = GROUP_A.map((t) => t.id);
const groupBIds = GROUP_B.map((t) => t.id);
const rrA = roundRobinPairs(groupAIds);
const rrB = roundRobinPairs(groupBIds);

const teamById = Object.fromEntries(teamsBase.map((t) => [t.id, t]));

const ROUND_DATES = ['Jul 5, 2026', 'Jul 12, 2026', 'Jul 19, 2026', 'Jul 21, 2026', 'Jul 26, 2026'];
const TIMES = ['3:00 PM', '4:30 PM', '5:00 PM', '6:00 PM'];
const VENUE = 'Village Community Pitch';

// deterministic pseudo-random so re-runs are stable
let seed = 42;
function rnd() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function randInt(min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}

const fixtures = [];
const results = [];
let matchCounter = 1;

let liveMatchAssigned = false;

function buildMatch({ round, roundIndex, home, away, matchIndexInRound }) {
  const id = `m${String(matchCounter).padStart(3, '0')}`;
  matchCounter++;
  const date = ROUND_DATES[roundIndex];
  const time = TIMES[matchIndexInRound % TIMES.length];

  let status = 'upcoming';
  if (roundIndex <= 2) status = 'completed';
  else if (roundIndex === 3 && !liveMatchAssigned) {
    status = 'live';
    liveMatchAssigned = true;
  }

  const match = {
    id,
    round: `Round ${round}`,
    date,
    time,
    venue: VENUE,
    status,
    homeTeam: { id: home.id, name: home.name },
    awayTeam: { id: away.id, name: away.name },
  };

  if (status === 'completed' || status === 'live') {
    const homeScore = randInt(0, 4);
    const awayScore = randInt(0, 3);
    match.homeScore = homeScore;
    match.awayScore = awayScore;

    // Attribute goals to players (weighted toward forwards/midfielders)
    const scorersPool = (team) => {
      const squad = playersByTeam[team.id];
      const weighted = [];
      squad.forEach((p) => {
        const weight = p.position === 'Forward' ? 4 : p.position === 'Midfielder' ? 3 : p.position === 'Defender' ? 1 : 0;
        for (let w = 0; w < weight; w++) weighted.push(p);
      });
      return weighted.length ? weighted : squad;
    };

    const goalScorers = [];
    for (let g = 0; g < homeScore; g++) {
      const scorer = pick(scorersPool(home));
      scorer.goals += 1;
      goalScorers.push(`${scorer.name} (${home.name})`);
    }
    for (let g = 0; g < awayScore; g++) {
      const scorer = pick(scorersPool(away));
      scorer.goals += 1;
      goalScorers.push(`${scorer.name} (${away.name})`);
    }

    // mark players from both squads as having played this match
    [...playersByTeam[home.id], ...playersByTeam[away.id]].forEach((p) => {
      p.matches += 1;
    });

    // occasional cards
    if (status === 'completed') {
      const cardPool = [...playersByTeam[home.id], ...playersByTeam[away.id]];
      if (rnd() > 0.55) pick(cardPool).yellowCards += 1;
      if (rnd() > 0.9) pick(cardPool).redCards += 1;
    }

    if (status === 'completed') {
      const motmCandidates = homeScore >= awayScore ? playersByTeam[home.id] : playersByTeam[away.id];
      match.motm = pick(motmCandidates).name;
      match.goalScorers = goalScorers;
      results.push({ ...match });
    }
  }

  fixtures.push(match);
}

function buildGroupRounds(rr, groupIds) {
  rr.rounds.forEach((pairs, roundIndex) => {
    pairs.forEach(([homeId, awayId], matchIndexInRound) => {
      buildMatch({
        round: roundIndex + 1,
        roundIndex,
        home: teamById[homeId],
        away: teamById[awayId],
        matchIndexInRound,
      });
    });
  });
}

buildGroupRounds(rrA, groupAIds);
buildGroupRounds(rrB, groupBIds);

// Sort fixtures by round then by original insertion (already grouped) —
// re-sort by round number for a clean, readable schedule.
fixtures.sort((a, b) => {
  const ra = parseInt(a.round.replace('Round ', ''), 10);
  const rb = parseInt(b.round.replace('Round ', ''), 10);
  if (ra !== rb) return ra - rb;
  return a.id.localeCompare(b.id);
});

// Semi Finals & Final — pending group stage completion, seeded as TBD
fixtures.push({
  id: 'sf1',
  round: 'Semi Final',
  date: 'Aug 2, 2026',
  time: '4:00 PM',
  venue: VENUE,
  status: 'upcoming',
  homeTeam: { id: 'tbd-a1', name: 'Group A Winner' },
  awayTeam: { id: 'tbd-b2', name: 'Group B Runner-up' },
});
fixtures.push({
  id: 'sf2',
  round: 'Semi Final',
  date: 'Aug 2, 2026',
  time: '5:30 PM',
  venue: VENUE,
  status: 'upcoming',
  homeTeam: { id: 'tbd-b1', name: 'Group B Winner' },
  awayTeam: { id: 'tbd-a2', name: 'Group A Runner-up' },
});
fixtures.push({
  id: 'final',
  round: 'Final',
  date: 'Aug 9, 2026',
  time: '5:00 PM',
  venue: VENUE,
  status: 'upcoming',
  homeTeam: { id: 'tbd-sf1', name: 'Semi Final 1 Winner' },
  awayTeam: { id: 'tbd-sf2', name: 'Semi Final 2 Winner' },
});

// ---------- Standings (derived from completed results) ----------
const standingsById = Object.fromEntries(
  teamsBase.map((t) => [t.id, { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 }])
);

results.forEach((m) => {
  const home = standingsById[m.homeTeam.id];
  const away = standingsById[m.awayTeam.id];
  home.played += 1;
  away.played += 1;
  home.gf += m.homeScore;
  home.ga += m.awayScore;
  away.gf += m.awayScore;
  away.ga += m.homeScore;

  if (m.homeScore > m.awayScore) {
    home.wins += 1;
    home.points += 3;
    away.losses += 1;
  } else if (m.homeScore < m.awayScore) {
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

const teams = teamsBase.map((t) => {
  const s = standingsById[t.id];
  return {
    id: t.id,
    name: t.name,
    group: t.group,
    coach: t.coach,
    logoInitials: t.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
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

// ---------- News ----------
const news = [
  {
    id: 'n1',
    title: 'Village Summer Tournament 2026 Kicks Off',
    image: 'https://picsum.photos/seed/vst-opening/900/600',
    date: 'Jul 5, 2026',
    excerpt: 'Ten teams, one community, and a summer of football began this weekend as the opening matches drew record crowds to the village pitch.',
    featured: true,
  },
  {
    id: 'n2',
    title: 'Thunder Hawks Fly Past Rivals in Group A Opener',
    image: 'https://picsum.photos/seed/vst-hawks/900/600',
    date: 'Jul 6, 2026',
    excerpt: 'A dominant first-half display set the tone for what could be a strong campaign for last year\'s semi-finalists.',
    featured: false,
  },
  {
    id: 'n3',
    title: 'New Floodlights Installed Ahead of Evening Fixtures',
    image: 'https://picsum.photos/seed/vst-lights/900/600',
    date: 'Jul 10, 2026',
    excerpt: 'Thanks to sponsor contributions, the village pitch now supports evening kick-offs for the first time in the tournament\'s history.',
    featured: false,
  },
  {
    id: 'n4',
    title: 'Group B Race Tightens After Round 2',
    image: 'https://picsum.photos/seed/vst-groupb/900/600',
    date: 'Jul 13, 2026',
    excerpt: 'Four points now separate the top three sides in Group B, setting up a tense finish to the group stage.',
    featured: false,
  },
  {
    id: 'n5',
    title: 'Meet the Volunteers Behind Matchday',
    image: 'https://picsum.photos/seed/vst-volunteers/900/600',
    date: 'Jul 16, 2026',
    excerpt: 'From lining the pitch to running the snack stand, a small army of volunteers keeps the tournament running every weekend.',
    featured: false,
  },
  {
    id: 'n6',
    title: 'Top Scorer Race Heats Up Heading Into Round 4',
    image: 'https://picsum.photos/seed/vst-scorers/900/600',
    date: 'Jul 20, 2026',
    excerpt: 'With the group stage entering its final rounds, three players are within a goal of each other at the top of the charts.',
    featured: true,
  },
];

// ---------- Gallery ----------
const CATEGORIES = ['Matches', 'Fans', 'Training', 'Celebrations'];
const gallery = [];
for (let i = 1; i <= 16; i++) {
  const category = CATEGORIES[(i - 1) % CATEGORIES.length];
  gallery.push({
    id: `g${i}`,
    category,
    caption: `${category} — Village Summer Tournament 2026`,
    image: `https://picsum.photos/seed/vst-gallery-${i}/600/600`,
  });
}

// ---------- Sponsors ----------
const sponsors = [
  { id: 's1', name: 'Highland Dairy Co-op', tier: 'gold', logoInitials: 'HD', description: 'Proud title sponsor supplying matchday refreshments for every fixture.' },
  { id: 's2', name: 'Riverbank Hardware', tier: 'gold', logoInitials: 'RH', description: 'Supporting pitch maintenance and goalpost upgrades this season.' },
  { id: 's3', name: 'Sunrise Bakery', tier: 'silver', logoInitials: 'SB', description: 'Serving up half-time snacks for players and fans alike.' },
  { id: 's4', name: 'Village Motors', tier: 'silver', logoInitials: 'VM', description: 'Providing transport for away-day travel between village pitches.' },
  { id: 's5', name: 'Community Pharmacy', tier: 'bronze', logoInitials: 'CP', description: 'On-call matchday first aid support for players.' },
  { id: 's6', name: 'Green Fields Nursery', tier: 'bronze', logoInitials: 'GF', description: 'Keeping the pitch green with seasonal turf care.' },
];

// ---------- Write files ----------
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'teams.json'), JSON.stringify(teams, null, 2));
fs.writeFileSync(path.join(OUT, 'players.json'), JSON.stringify(players, null, 2));
fs.writeFileSync(path.join(OUT, 'fixtures.json'), JSON.stringify(fixtures, null, 2));
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(OUT, 'news.json'), JSON.stringify(news, null, 2));
fs.writeFileSync(path.join(OUT, 'gallery.json'), JSON.stringify(gallery, null, 2));
fs.writeFileSync(path.join(OUT, 'sponsors.json'), JSON.stringify(sponsors, null, 2));

console.log('Teams:', teams.length);
console.log('Players:', players.length);
console.log('Fixtures:', fixtures.length, '(', results.length, 'completed )');
const liveMatches = fixtures.filter((m) => m.status === 'live');
const liveGoals = liveMatches.reduce((s, m) => s + (m.homeScore || 0) + (m.awayScore || 0), 0);
console.log('Live matches:', liveMatches.length, '(', liveGoals, 'goals in progress )');
console.log('Total goals in results:', results.reduce((s, m) => s + m.homeScore + m.awayScore, 0));
console.log('Total goals attributed to players:', players.reduce((s, p) => s + p.goals, 0));
console.log(
  'Reconciled:',
  results.reduce((s, m) => s + m.homeScore + m.awayScore, 0) + liveGoals ===
    players.reduce((s, p) => s + p.goals, 0)
);
