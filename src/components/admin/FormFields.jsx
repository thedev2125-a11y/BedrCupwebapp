import { cn } from '../../utils/cn';

const baseInputClass =
  'w-full rounded-lg border bg-white dark:bg-pitch-900 px-3.5 py-2.5 text-sm text-ink dark:text-chalk-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-shadow disabled:opacity-50';

function FieldWrapper({ label, error, required, children, hint }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-ink dark:text-chalk-50 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      {error && <span className="block mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

export function TextField({ label, error, required, hint, className, ...props }) {
  return (
    <FieldWrapper label={label} error={error} required={required} hint={hint}>
      <input
        className={cn(baseInputClass, error ? 'border-red-400' : 'border-black/[0.1] dark:border-white/[0.12]', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TextareaField({ label, error, required, hint, rows = 4, className, ...props }) {
  return (
    <FieldWrapper label={label} error={error} required={required} hint={hint}>
      <textarea
        rows={rows}
        className={cn(baseInputClass, 'resize-y', error ? 'border-red-400' : 'border-black/[0.1] dark:border-white/[0.12]', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function SelectField({ label, error, required, hint, options, placeholder, className, ...props }) {
  return (
    <FieldWrapper label={label} error={error} required={required} hint={hint}>
      <select
        className={cn(baseInputClass, error ? 'border-red-400' : 'border-black/[0.1] dark:border-white/[0.12]', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function CheckboxField({ label, ...props }) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-chalk-50 cursor-pointer">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-black/[0.2] text-emerald-600 focus:ring-emerald-500/40"
        {...props}
      />
      {label}
    </label>
  );
}
