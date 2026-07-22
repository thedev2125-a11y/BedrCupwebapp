import Card from '../common/Card';

/**
 * sponsor shape: { id, name, logoInitials, tier: 'gold'|'silver'|'bronze', description }
 */
export default function SponsorCard({ sponsor }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center gap-3">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 font-display text-lg">
        {sponsor.logoInitials}
      </span>
      <h3 className="font-display text-base tracking-wide text-ink dark:text-chalk-50">
        {sponsor.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {sponsor.description}
      </p>
    </Card>
  );
}
