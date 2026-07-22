import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import StandingsTable from '../components/standings/StandingsTable';

import { useData } from '../hooks/useData';
import { getTeamsByGroup } from '../utils/tournamentStats';

export default function Standings() {
  const { teamsWithStats } = useData();
  const groupA = getTeamsByGroup(teamsWithStats, 'A');
  const groupB = getTeamsByGroup(teamsWithStats, 'B');

  return (
    <PageTransition>
      <PageHero
        eyebrow="Group Stage"
        title="Standings"
        subtitle="Top two teams from each group advance to the Semi Finals."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <SectionTitle eyebrow="Group A" title="Standings — Group A" />
          <StandingsTable teams={groupA} />
        </section>
        <section>
          <SectionTitle eyebrow="Group B" title="Standings — Group B" />
          <StandingsTable teams={groupB} />
        </section>

        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="h-3 w-3 rounded-sm bg-emerald-500/60" />
          Highlighted rows qualify for the Semi Finals.
        </div>
      </div>
    </PageTransition>
  );
}
