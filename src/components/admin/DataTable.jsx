import { Pencil, Trash2 } from 'lucide-react';
import Card from '../common/Card';

/**
 * columns: [{ key, label, render?: (row) => node, className? }]
 * rows: array of records (must include `id`)
 */
export default function DataTable({ columns, rows, onEdit, onDelete, emptyMessage = 'Nothing here yet.' }) {
  if (!rows || rows.length === 0) {
    return (
      <Card hover={false} className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
        {emptyMessage}
      </Card>
    );
  }

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-black/[0.04] dark:border-white/[0.06]">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-pitch-950 text-chalk-100/90">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-display text-xs tracking-wider uppercase whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-right font-display text-xs tracking-wider uppercase whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white dark:bg-pitch-900 border-t border-black/[0.04] dark:border-white/[0.06] hover:bg-emerald-50/50 dark:hover:bg-white/[0.03] transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-ink dark:text-chalk-100 ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        aria-label="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        aria-label="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
