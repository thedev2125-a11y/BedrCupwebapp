import { useMemo, useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SearchBar from '../components/common/SearchBar';
import FilterTabs from '../components/common/FilterTabs';
import EmptyState from '../components/common/EmptyState';
import TeamCard from '../components/cards/TeamCard';
import { useTournament } from '../hooks/useTournament';
import { useData } from '../hooks/useData';

import { ShieldOff } from 'lucide-react';

const GROUP_OPTIONS = [
  { label: 'All Teams', value: 'all' },
  { label: 'Group A', value: 'A' },
  { label: 'Group B', value: 'B' },
];

export default function Teams() {
  const { teamSearch, setTeamSearch } = useTournament();
  const { teamsWithStats: teams } = useData();
  const [teamGroupFilter, setTeamGroupFilter] = useState('all');

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(teamSearch.toLowerCase());
      const matchesGroup = teamGroupFilter === 'all' || t.group === teamGroupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [teams, teamSearch, teamGroupFilter]);

  return (
    <PageTransition>
      <PageHero eyebrow="The Contenders" title="Teams" subtitle="All ten teams competing for the Village Cup." />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterTabs options={GROUP_OPTIONS} value={teamGroupFilter} onChange={setTeamGroupFilter} />
          <SearchBar value={teamSearch} onChange={setTeamSearch} placeholder="Search teams..." />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ShieldOff} title="No teams found" description="Try a different search term or group filter." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t) => (
              <TeamCard key={t.id} team={t} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
