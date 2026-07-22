import { cn } from '../../utils/cn';

/**
 * Generic responsive table.
 * columns: [{ key, label, align?: 'left'|'center'|'right', className? }]
 * rows: array of objects keyed by column.key
 * rowClassName: (row, index) => string   — e.g. to highlight top-2 standings
 * getRowKey: (row, index) => string|number
 */
export default function Table({ columns, rows, rowClassName, getRowKey, emptyMessage = 'No data available.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-slate-500/25 py-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-black/[0.04] dark:border-white/[0.06]">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-pitch-900 text-chalk-100/90">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 font-display text-xs tracking-wider uppercase whitespace-nowrap',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  (!col.align || col.align === 'left') && 'text-left',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getRowKey ? getRowKey(row, i) : i}
              className={cn(
                'bg-white dark:bg-pitch-900 border-t border-black/[0.04] dark:border-white/[0.06] hover:bg-emerald-50/50 dark:hover:bg-white/[0.03] transition-colors',
                rowClassName?.(row, i)
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-3 font-mono whitespace-nowrap text-ink dark:text-chalk-100',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className
                  )}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
