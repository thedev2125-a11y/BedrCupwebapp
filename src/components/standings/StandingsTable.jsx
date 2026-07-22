import Table from '../tables/Table';

const COLUMNS = [
  { key: 'pos', label: '#', align: 'center' },
  { key: 'club', label: 'Club' },
  { key: 'played', label: 'P', align: 'center' },
  { key: 'wins', label: 'W', align: 'center' },
  { key: 'draws', label: 'D', align: 'center' },
  { key: 'losses', label: 'L', align: 'center' },
  { key: 'gf', label: 'GF', align: 'center' },
  { key: 'ga', label: 'GA', align: 'center' },
  { key: 'gd', label: 'GD', align: 'center' },
  { key: 'points', label: 'Pts', align: 'center', className: 'font-bold text-emerald-600 dark:text-emerald-400' },
];

/** teams: already sorted (see utils/tournamentStats#getTeamsByGroup) */
export default function StandingsTable({ teams }) {
  const rows = teams.map((t, i) => ({
    pos: i + 1,
    club: t.name,
    played: t.played,
    wins: t.wins,
    draws: t.draws,
    losses: t.losses,
    gf: t.goalsFor,
    ga: t.goalsAgainst,
    gd: t.goalDifference > 0 ? `+${t.goalDifference}` : t.goalDifference,
    points: t.points,
  }));

  return (
    <Table
      columns={COLUMNS}
      rows={rows}
      getRowKey={(row) => row.club}
      rowClassName={(_, i) =>
        i < 2 ? 'bg-emerald-50/60 dark:bg-emerald-500/[0.06] border-l-4 border-l-emerald-500' : ''
      }
      emptyMessage="No standings available yet."
    />
  );
}
