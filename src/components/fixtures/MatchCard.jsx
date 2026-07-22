import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const STATUS_TONE = { live: 'live', upcoming: 'upcoming', completed: 'completed' };
const STATUS_LABEL = { live: 'Live', upcoming: 'Upcoming', completed: 'Full Time' };

/**
 * match shape:
 * {
 *   id, round, date, time, venue, status: 'live'|'upcoming'|'completed',
 *   homeTeam: { name, logo }, awayTeam: { name, logo },
 *   homeScore?, awayScore?, motm? // Man of the Match, results only
 * }
 */
export default function MatchCard({ match, showRound = true }) {
  const { round, date, time, venue, status, homeTeam, awayTeam, homeScore, awayScore, motm } = match;
  const isCompleted = status === 'completed';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        {showRound && (
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {round}
          </span>
        )}
        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock team={homeTeam} align="right" />

        <div className="flex flex-col items-center min-w-[64px]">
          {isCompleted || status === 'live' ? (
            <span className="font-display text-2xl text-ink dark:text-chalk-50">
              {homeScore} <span className="text-slate-400 mx-0.5">-</span> {awayScore}
            </span>
          ) : (
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {time}
            </span>
          )}
        </div>

        <TeamBlock team={awayTeam} align="left" />
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-black/[0.08] dark:border-white/[0.08] flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} /> {date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} /> {time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} /> {venue}
        </span>
        {motm && (
          <span className="flex items-center gap-1.5 text-gold-600 dark:text-gold-400">
            <Star size={13} /> {motm}
          </span>
        )}
      </div>
    </Card>
  );
}

function TeamBlock({ team, align }) {
  const isRight = align === 'right';
  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${isRight ? 'flex-row-reverse text-right' : 'text-left'}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-700 dark:text-emerald-400 font-display text-xs border-2 border-dashed border-emerald-500/40">
        {team.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate text-sm font-semibold text-ink dark:text-chalk-50">
        {team.name}
      </span>
    </div>
  );
}
