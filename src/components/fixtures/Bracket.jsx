import Card from '../common/Card';
import Badge from '../common/Badge';
import { Trophy } from 'lucide-react';

/**
 * fixtures: the full fixtures array — this component pulls out the
 * Semi Final and Final entries itself.
 */
export default function Bracket({ fixtures }) {
    const quarters = fixtures.filter((m) => m.round === 'Quarter Final');
  const semis = fixtures.filter((m) => m.round === 'Semi Final');
  const final = fixtures.find((m) => m.round === 'Final');
  const isFinalPlayed = final?.status === 'completed';
  const champion = isFinalPlayed
    ? final.homeScore > final.awayScore
      ? final.homeTeam.name
      : final.awayTeam.name
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 items-center">
      <div className="flex flex-col gap-4">
        {semis.map((m) => (
          <BracketMatch key={m.id} match={m} label="Semi Final" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 items-center">
      <div className="flex flex-col gap-4">
        {quarters.map((m) => (
          <BracketMatch key={m.id} match={m} label="Quarter Final" />
        ))}
      </div>
      </div>

      <div className="flex justify-center">
        <div className="hidden lg:block h-px w-10 bg-slate-500/20" />
      </div>

      <div className="flex flex-col items-center gap-4">
        {final && <BracketMatch match={final} label="Final" />}
        <Card hover={false} className="w-full p-5 flex flex-col items-center gap-2 text-center bg-gradient-to-br from-gold-500/10 to-transparent">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
            <Trophy size={20} />
          </span>
          {champion ? (
            <>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Champion
              </span>
              <span className="font-display text-xl text-ink dark:text-chalk-50">{champion}</span>
            </>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              The champion will be crowned after the Final.
            </span>
          )}
        </Card>
      </div>
    </div>
  );
}

function BracketMatch({ match, label }) {
  return (
    <Card hover={false} className="p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <Badge tone={match.status === 'completed' ? 'completed' : match.status === 'live' ? 'live' : 'upcoming'}>
          {match.status === 'completed' ? 'FT' : match.status === 'live' ? 'Live' : match.date}
        </Badge>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink dark:text-chalk-50 font-semibold truncate">{match.homeTeam.name}</span>
          {match.status === 'completed' && <span className="font-mono">{match.homeScore}</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink dark:text-chalk-50 font-semibold truncate">{match.awayTeam.name}</span>
          {match.status === 'completed' && <span className="font-mono">{match.awayScore}</span>}
        </div>
      </div>
    </Card>
  );
}
