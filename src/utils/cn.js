/**
 * Joins class names, filtering out falsy values.
 * Usage: cn('base-class', isActive && 'active-class', className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
