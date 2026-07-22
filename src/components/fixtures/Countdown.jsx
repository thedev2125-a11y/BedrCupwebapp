import { useCountdown } from '../../hooks/useCountdown';
import { parseMatchDate } from '../../utils/tournamentStats';

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hrs' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
];

/** Live-ticking countdown to a fixture's kickoff. */
export default function Countdown({ match }) {
  const target = match ? parseMatchDate(match.date, match.time) : null;
  const time = useCountdown(target);

  if (!match || match.status === 'live') {
    return (
      <div className="flex items-center gap-2 font-display text-lg text-gold-400">
        <span className="live-dot h-2.5 w-2.5 rounded-full bg-red-500" />
        Match in progress
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {UNITS.map((u) => (
        <div key={u.key} className="flex flex-col items-center min-w-[52px]">
          <span className="font-mono text-2xl font-bold text-chalk-50 tabular-nums">
            {String(time[u.key]).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-chalk-100/60">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
