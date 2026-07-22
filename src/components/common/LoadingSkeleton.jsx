import { cn } from '../../utils/cn';

/**
 * Shimmering placeholder block. Compose these to build skeleton
 * versions of cards/tables while data is "loading".
 */
export function SkeletonBlock({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-black/[0.06] dark:bg-white/[0.08]',
        className
      )}
    />
  );
}

/** Skeleton shaped like a MatchCard / TeamCard grid item. */
export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 p-5 shadow-[var(--shadow-card)] border border-black/[0.04] dark:border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
      </div>
      <SkeletonBlock className="h-3 w-3/4 mx-auto mb-2" />
      <SkeletonBlock className="h-3 w-1/2 mx-auto" />
    </div>
  );
}

/** Skeleton grid: renders `count` SkeletonCards. */
export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
