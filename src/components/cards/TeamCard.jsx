import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * team shape: { id, name, group: 'A'|'B', played, wins, goals }
 */
export default function TeamCard({ team }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-700 dark:text-emerald-400 font-display text-xl border-2 border-dashed border-emerald-500/40 mb-3">
        {team.name.slice(0, 2).toUpperCase()}
      </span>
      <h3 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50">
        {team.name}
      </h3>
      <Badge tone="emerald" className="mt-2">
        Group {team.group}
      </Badge>

      <div className="grid grid-cols-3 gap-2 w-full mt-5 text-center">
        <Stat label="Played" value={team.played} />
        <Stat label="Wins" value={team.wins} />
        <Stat label="Goals" value={team.goals} />
      </div>

      <Link
        to={`/teams/${team.id}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2.5 transition-all"
      >
        View Team <ArrowRight size={15} />
      </Link>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.04] py-2">
      <div className="font-mono text-sm font-bold text-ink dark:text-chalk-50">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
