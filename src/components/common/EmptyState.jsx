import { SearchX } from 'lucide-react';

/**
 * Shown when a filtered/searched list has no results
 * (e.g. no teams match a search term, no fixtures for a filter).
 */
export default function EmptyState({
  icon: Icon = SearchX,
  title = 'Nothing here yet',
  description = 'Try adjusting your search or filters.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-slate-500/25 py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-xl tracking-wide text-ink dark:text-chalk-50">
        {title}
      </h3>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action}
    </div>
  );
}
