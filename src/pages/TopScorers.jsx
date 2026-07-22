import { useMemo } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import PlayerCard from '../components/players/PlayerCard';
import { useTournament } from '../hooks/useTournament';
import { useData } from '../hooks/useData';

import { getTopScorers } from '../utils/tournamentStats';
import { UserX } from 'lucide-react';

export default function TopScorers() {
  const { playerSearch, setPlayerSearch } = useTournament();
  const { playersWithStats } = useData();
  const ranked = useMemo(() => getTopScorers(playersWithStats), [playersWithStats]);

  const filtered = useMemo(() => {
    const term = playerSearch.toLowerCase();
    return ranked.filter((p) => p.name.toLowerCase().includes(term) || p.team.toLowerCase().includes(term));
  }, [ranked, playerSearch]);

  return (
    <PageTransition>
      <PageHero
        eyebrow="Golden Boot Race"
        title="Top Scorers"
        subtitle="Ranked by goals scored. The top three sit on the podium."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <SearchBar value={playerSearch} onChange={setPlayerSearch} placeholder="Search players or teams..." />

        {filtered.length === 0 ? (
          <EmptyState icon={UserX} title="No players found" description="Try a different search term." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const rank = ranked.findIndex((r) => r.id === p.id) + 1;
              return <PlayerCard key={p.id} player={p} rank={rank} />;
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
