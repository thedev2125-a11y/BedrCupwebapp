import { useMemo } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import NewsCard from '../components/news/NewsCard';
import { useTournament } from '../hooks/useTournament';
import { useData } from '../hooks/useData';
import { formatDisplayDate } from '../utils/computeStats';

import { Newspaper } from 'lucide-react';

export default function News() {
  const { newsFilter, setNewsFilter } = useTournament();
  const { news: newsRaw } = useData();
  const news = useMemo(
    () => newsRaw.map((a) => ({ ...a, date: formatDisplayDate(a.publishedAt) })).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
    [newsRaw]
  );

  const featured = news.find((a) => a.featured);
  const rest = news.filter((a) => a.id !== featured?.id);

  const filtered = useMemo(() => {
    const term = newsFilter.toLowerCase();
    return rest.filter((a) => a.title.toLowerCase().includes(term) || a.excerpt.toLowerCase().includes(term));
  }, [rest, newsFilter]);

  return (
    <PageTransition>
      <PageHero eyebrow="Community" title="News" subtitle="Updates, stories, and behind-the-scenes coverage from the tournament." />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {featured && (
          <section>
            <SectionTitle eyebrow="Featured" title="Top Story" />
            <div className="max-w-2xl">
              <NewsCard article={featured} featured />
            </div>
          </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <SectionTitle title="All Articles" className="!mb-0" />
            <SearchBar value={newsFilter} onChange={setNewsFilter} placeholder="Search news..." />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Newspaper} title="No articles found" description="Try a different search term." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
