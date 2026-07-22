import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-pitch-900 py-2.5 pl-10 pr-4 text-sm text-ink dark:text-chalk-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-shadow"
      />
    </div>
  );
}
