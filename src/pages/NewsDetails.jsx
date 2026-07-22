import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import NewsCard from '../components/news/NewsCard';

import { useData } from '../hooks/useData';
import { formatDisplayDate } from '../utils/computeStats';

export default function NewsDetails() {
  const { id } = useParams();
  const { news: newsRaw } = useData();
  const news = newsRaw.map((a) => ({ ...a, date: formatDisplayDate(a.publishedAt) }));
  const article = news.find((a) => a.id === id);

  if (!article) return <Navigate to="/news" replace />;

  const related = news.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to News
        </Link>

        <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
          <Calendar size={12} /> {article.date}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-ink dark:text-chalk-50 mb-6">
          {article.title}
        </h1>

        <div className="h-64 sm:h-80 rounded-[var(--radius-card)] bg-gradient-to-br from-emerald-600 to-pitch-800 flex items-center justify-center text-chalk-50/30 font-display text-4xl mb-8">
          {article.title.slice(0, 1)}
        </div>

        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {article.content || article.excerpt}
        </p>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl tracking-wide text-ink dark:text-chalk-50 mb-5">
              More Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
