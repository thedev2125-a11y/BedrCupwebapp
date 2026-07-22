import { cn } from '../../utils/cn';

/**
 * Section heading used to introduce each block of content on a page.
 * eyebrow: small label above the title (e.g. "GROUP STAGE")
 * action: optional element rendered on the right (e.g. a "View all" link)
 */
export default function SectionTitle({ eyebrow, title, action, align = 'left', className }) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 mb-6',
        align === 'center' && 'flex-col items-center text-center',
        className
      )}
    >
      <div>
        {eyebrow && (
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1.5">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-4xl tracking-wide text-ink dark:text-chalk-50">
          {title}
        </h2>
        <div className="pitch-line w-14 mt-3" />
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
