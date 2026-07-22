import { cn } from '../../utils/cn';

const VARIANTS = {
  primary:
    'bg-emerald-600 text-chalk-50 hover:bg-emerald-500 shadow-[0_4px_14px_-4px_rgba(14,159,90,0.5)]',
  gold:
    'bg-gold-500 text-ink hover:bg-gold-400 shadow-[0_4px_14px_-4px_rgba(201,151,31,0.5)]',
  outline:
    'bg-transparent border-2 border-chalk-50 text-chalk-50 hover:bg-chalk-50 hover:text-pitch-900 dark:border-pitch-800 dark:text-ink dark:hover:bg-pitch-900 dark:hover:text-chalk-50',
  ghost:
    'bg-transparent text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-pitch-800',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/**
 * Reusable action button.
 * variant: primary | gold | outline | ghost
 * size: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} strokeWidth={2.25} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} strokeWidth={2.25} />}
    </button>
  );
}
