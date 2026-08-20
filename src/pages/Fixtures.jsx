import { useMemo, useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import FilterTabs from '../components/common/FilterTabs';
import EmptyState from '../components/common/EmptyState';
import MatchCard from '../components/fixtures/MatchCard';
import Bracket from '../components/fixtures/Bracket';

import { useData } from '../hooks/useData';
import { groupByRound } from '../utils/tournamentStats';
import { CalendarX } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Live', value: 'live' },
  { label: 'Completed', value: 'completed' },
];

const KNOCKOUT_ROUNDS = new Set(['Quarter Final', 'Semi Final', 'Final']);

export default function Fixtures() {
  const { fixturesDisplay } = useData();
  const [round, setRound] = useState('all');
  const [status, setStatus] = useState('all');

  const groupStageRounds = useMemo(() => {
    const seen = [];
    fixturesDisplay.forEach((f) => {
      if (!KNOCKOUT_ROUNDS.has(f.round) && !seen.includes(f.round)) seen.push(f.round);
    });
    return seen;
  }, [fixturesDisplay]);

  const roundOptions = [{ label: 'All Rounds', value: 'all' }, ...groupStageRounds.map((r) => ({ label: r, value: r }))];

  const filtered = useMemo(() => {
    return fixturesDisplay.filter((m) => {
      if (KNOCKOUT_ROUNDS.has(m.round)) return false; // knockout shown separately
      if (round !== 'all' && m.round !== round) return false;
      if (status !== 'all' && m.status !== status) return false;
      return true;
    });
  }, [fixturesDisplay, round, status]);

  const grouped = groupByRound(filtered);

  return (
    <PageTransition>
      <PageHero
        eyebrow="Match Schedule"
        title="Fixtures"
        subtitle="Every group-stage fixture across all five rounds, plus the road to the Final."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col gap-4">
          <FilterTabs options={roundOptions} value={round} onChange={setRound} />
          <FilterTabs options={STATUS_OPTIONS} value={status} onChange={setStatus} />
        </div>

        {grouped.length === 0 ? (
          <EmptyState icon={CalendarX} title="No fixtures match your filters" description="Try a different round or status." />
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

        <section>
          <SectionTitle eyebrow="Knockout Stage" title="Quarter Final, Semi Final & Final" />
          <Bracket fixtures={fixturesDisplay} />
        </section>
      </div>
    </PageTransition>
  );
}
