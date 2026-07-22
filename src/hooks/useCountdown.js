import { useEffect, useState } from 'react';

/**
 * Returns a live-updating { days, hours, minutes, seconds, isPast } countdown
 * to the given target Date. Ticks every second while mounted.
 */
export function useCountdown(targetDate) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const diff = targetDate.getTime() - now;
  const isPast = diff <= 0;
  const abs = Math.max(diff, 0);

  return {
    days: Math.floor(abs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((abs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((abs / (1000 * 60)) % 60),
    seconds: Math.floor((abs / 1000) % 60),
    isPast,
  };
}
