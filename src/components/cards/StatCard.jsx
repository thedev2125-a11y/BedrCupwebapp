import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import Card from '../common/Card';

/**
 * Displays a single tournament statistic (Teams, Players, Goals, Matches...)
 * with a count-up animation once it scrolls into view.
 */
export default function StatCard({ icon: Icon, value, label, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <Card ref={ref} className="flex flex-col items-center gap-2 py-8 px-4 text-center">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400 mb-1">
          <Icon size={20} />
        </span>
      )}
      <span className="font-display text-4xl text-ink dark:text-chalk-50">
        {display}
        {suffix}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </Card>
  );
}
