import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Base card surface used across the app: rounded corners, soft shadow,
 * subtle lift on hover. Pass `hover={false}` for static (non-interactive) cards.
 */
const Card = forwardRef(function Card(
  { children, className, hover = true, as: Tag = 'div', ...props },
  ref
) {
  const MotionTag = motion[Tag] ?? motion.div;
  return (
    <MotionTag
      ref={ref}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 shadow-[var(--shadow-card)]',
        hover && 'hover:shadow-[var(--shadow-card-hover)]',
        'border border-black/[0.04] dark:border-white/[0.06]',
        className
      )}
      {...props}
    >
      {children}
    </MotionTag>
  );
});

export default Card;
