import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import PlayerCard from '../components/players/PlayerCard';
import MatchCard from '../components/fixtures/MatchCard';

import { useData } from '../hooks/useData';
import {
  getPlayersByTeamId,
  getResultsByTeamId,
  getNextMatchForTeam,
} from '../utils/tournamentStats';

export default function TeamDetails() {
  const { id } = useParams();
  const { teamsWithStats: teams, playersWithStats: players, fixturesDisplay: fixtures, resultsDisplay: results } = useData();
  const team = teams.find((t) => t.id === id);

  if (!team) return <Navigate to="/teams" replace />;

  const squad = getPlayersByTeamId(players, team.id);
  const history = getResultsByTeamId(results, team.id);
  const nextMatch = getNextMatchForTeam(fixtures, team.id);
  const topScorer = squad.slice().sort((a, b) => b.goals - a.goals)[0];

  return (
    <PageTransition>
      {/* Header */}
      <div className="relative bg-pitch-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 64px)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <Link to="/teams" className="inline-flex items-center gap-1.5 text-sm text-chalk-100/70 hover:text-chalk-50 mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to Teams
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 font-display text-2xl border-2 border-dashed border-emerald-400/50">
              {team.logoInitials}
            </span>
            <div>
              <Badge tone="emerald" className="mb-2">
                Group {team.group}
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-chalk-50">{team.name}</h1>
              <p className="mt-1 text-sm text-chalk-100/60">Coached by {team.coach}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Stats */}
        <section>
          <SectionTitle eyebrow="Season So Far" title="Team Statistics" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <StatBox label="Played" value={team.played} />
            <StatBox label="Wins" value={team.wins} />
            <StatBox label="Draws" value={team.draws} />
            <StatBox label="Losses" value={team.losses} />
            <StatBox label="GF" value={team.goalsFor} />
            <StatBox label="GA" value={team.goalsAgainst} />
            <StatBox label="Points" value={team.points} highlight />
          </div>
          {topScorer && topScorer.goals > 0 && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Top scorer:{' '}
              <span className="font-semibold text-ink dark:text-chalk-50">
                {topScorer.name}
              </span>{' '}
              ({topScorer.goals} goals)
            </p>
          )}
        </section>

        {/* Upcoming match */}
        {nextMatch && (
          <section>
            <SectionTitle eyebrow={nextMatch.status === 'live' ? 'Right Now' : 'Coming Up'} title="Next Match" />
            <div className="max-w-md">
              <MatchCard match={nextMatch} />
            </div>
          </section>
        )}

        {/* Player list */}
        <section>
          <SectionTitle eyebrow={`${squad.length} Players`} title="Squad" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {squad.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </section>

        {/* Match history */}
        <section>
          <SectionTitle eyebrow="Results" title="Match History" />
          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <Card hover={false} className="p-6 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar size={16} /> No matches played yet this season.
            </Card>
          )}
        </section>

        <Card hover={false} className="p-5 flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={16} className="text-emerald-500" /> {team.venueNote || 'Village Community Pitch'}
        </Card>
      </div>
    </PageTransition>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 shadow-[var(--shadow-card)] border border-black/[0.04] dark:border-white/[0.06] py-4 text-center">
      <div className={`font-display text-2xl ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink dark:text-chalk-50'}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
