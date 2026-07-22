import Card from '../common/Card';
import { Square } from 'lucide-react';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * player shape: { id, name, team, position, goals, matches, yellowCards, redCards }
 * rank: 1-based ranking position, used to show a medal on the Top Scorers page.
 */
export default function PlayerCard({ player, rank }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-700 dark:text-emerald-400 font-display text-sm border-2 border-dashed border-emerald-500/40">
        {player.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)}
        {rank && rank <= 3 && (
          <span className="absolute -top-2 -right-2 text-base leading-none">{MEDALS[rank - 1]}</span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-sm text-ink dark:text-chalk-50 truncate">
          {player.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {player.team} · {player.position}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs font-mono shrink-0">
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{player.goals}G</span>
        {player.yellowCards > 0 && (
          <span className="flex items-center gap-1 text-gold-600 dark:text-gold-400">
            <Square size={10} fill="currentColor" /> {player.yellowCards}
          </span>
        )}
        {player.redCards > 0 && (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <Square size={10} fill="currentColor" /> {player.redCards}
          </span>
        )}
      </div>
    </Card>
  );
}
