import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/common/Badge';
import { useData } from '../../hooks/useData';
import { getTopScorers } from '../../utils/tournamentStats';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function AdminTopScorers() {
  const { playersWithStats } = useData();
  const ranked = getTopScorers(playersWithStats);

  return (
    <div>
      <AdminPageHeader
        title="Top Scorers"
        subtitle={
          <>
            Goals are calculated automatically from match results —{' '}
            <Link to="/admin/results" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              add goal scorers on the Results page
            </Link>{' '}
            to update this list.
          </>
        }
      />

      <DataTable
        columns={[
          { key: 'rank', label: '#', render: (p) => MEDALS[ranked.indexOf(p)] || ranked.indexOf(p) + 1 },
          { key: 'name', label: 'Player' },
          { key: 'team', label: 'Team' },
          { key: 'goals', label: 'Goals', render: (p) => <Badge tone="emerald">{p.goals}</Badge> },
          { key: 'matches', label: 'Matches' },
          { key: 'yellowCards', label: 'Yellow' },
          { key: 'redCards', label: 'Red' },
        ]}
        rows={ranked}
        emptyMessage="No goals recorded yet."
      />
    </div>
  );
}
