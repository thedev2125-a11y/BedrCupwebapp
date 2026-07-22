import { useMemo, useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import FilterTabs from '../components/common/FilterTabs';
import EmptyState from '../components/common/EmptyState';
import MatchCard from '../components/fixtures/MatchCard';

import { useData } from '../hooks/useData';
import { groupByRound } from '../utils/tournamentStats';
import { ClipboardX } from 'lucide-react';

export default function Results() {
  const { resultsDisplay: results } = useData();
  const [round, setRound] = useState('all');

  const rounds = useMemo(() => {
    const seen = new Set();
    results.forEach((m) => seen.add(m.round));
    return Array.from(seen);
  }, [results]);

  const roundOptions = [{ label: 'All Rounds', value: 'all' }, ...rounds.map((r) => ({ label: r, value: r }))];

  const filtered = round === 'all' ? results : results.filter((m) => m.round === round);
  const grouped = groupByRound(filtered);

  return (
    <PageTransition>
      <PageHero
        eyebrow="Full Time"
        title="Results"
        subtitle="Final scores, goal scorers, and Man of the Match for every completed fixture."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <FilterTabs options={roundOptions} value={round} onChange={setRound} />

        {grouped.length === 0 ? (
          <EmptyState icon={ClipboardX} title="No results yet" description="Check back once matches have been played." />
        ) : (
          grouped.map(({ round: r, matches }) => (
            <section key={r}>
              <SectionTitle title={r} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} showRound={false} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </PageTransition>
  );
}
