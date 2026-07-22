import { cn } from '../../utils/cn';

/**
 * options: [{ label, value }]
 */
export default function FilterTabs({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
            value === opt.value
              ? 'bg-emerald-600 text-chalk-50'
              : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.1]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
