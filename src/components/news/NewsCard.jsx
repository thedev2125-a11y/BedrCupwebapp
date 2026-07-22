import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Card from '../common/Card';

/**
 * article shape: { id, title, image, date, excerpt }
 */
export default function NewsCard({ article, featured = false }) {
  return (
    <Card className="overflow-hidden flex flex-col" hover>
      <div
        className={`bg-gradient-to-br from-emerald-600 to-pitch-800 flex items-center justify-center text-chalk-50/30 font-display text-3xl ${
          featured ? 'h-56' : 'h-40'
        }`}
      >
        {article.title.slice(0, 1)}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
          <Calendar size={12} /> {article.date}
        </span>
        <h3
          className={`font-display tracking-wide text-ink dark:text-chalk-50 mb-2 ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <Link
          to={`/news/${article.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2.5 transition-all"
        >
          Read More <ArrowRight size={15} />
        </Link>
      </div>
    </Card>
  );
}
