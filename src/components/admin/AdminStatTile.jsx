import Card from '../common/Card';

export default function AdminStatTile({ icon: Icon, value, label, tone = 'emerald' }) {
  const toneClass =
    tone === 'gold'
      ? 'bg-gold-500/15 text-gold-600 dark:text-gold-400'
      : 'bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400';

  return (
    <Card hover={false} className="p-5 flex items-center gap-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon size={20} />
      </span>
      <div>
        <div className="font-display text-2xl text-ink dark:text-chalk-50 leading-none">{value}</div>
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">{label}</div>
      </div>
    </Card>
  );
}
