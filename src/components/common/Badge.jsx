import { cn } from '../../utils/cn';

const TONES = {
  live: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  upcoming: 'bg-gold-500/10 text-gold-600 dark:text-gold-400',
  completed: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  gold: 'bg-gold-500/15 text-gold-600 dark:text-gold-400',
  neutral: 'bg-black/[0.04] text-slate-600 dark:bg-white/[0.06] dark:text-slate-300',
};

/**
 * Small status/label pill. tone="live" renders an animated pulse dot.
 * tone: live | upcoming | completed | emerald | gold | neutral
 */
export default function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider font-mono',
        TONES[tone],
        className
      )}
    >
      {tone === 'live' && (
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
      )}
      {children}
    </span>
  );
}
