import { Link } from 'react-router-dom';
import {supabase } from '../lib/supabase';
import { useEffect } from 'react';
import { Users, Trophy, Goal, CalendarDays, ArrowRight, CircleDot } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import StatCard from '../components/cards/StatCard';
import MatchCard from '../components/fixtures/MatchCard';
import Countdown from '../components/fixtures/Countdown';
import NewsCard from '../components/news/NewsCard';
import GalleryCard from '../components/gallery/GalleryCard';
import StandingsTable from '../components/standings/StandingsTable';

import { useData } from '../hooks/useData';
import { formatDisplayDate } from '../utils/computeStats';

import {
  getTeamsByGroup,
  getTopScorers,
  getFeaturedMatch,
  getUpcomingFixtures,
  getByeTeams,
} from '../utils/tournamentStats';

export default function Home() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      console.log('Supabase teams:', data);
      console.log('Supabase error:', error);
    }

    testSupabase();
  }, []);
  const { teamsWithStats: teams, playersWithStats: players, fixturesDisplay: fixtures, resultsDisplay: results, news: newsRaw, gallery, sponsors } = useData();
  const news = [...newsRaw]
    .map((a) => ({ ...a, date: formatDisplayDate(a.publishedAt) }))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const featuredMatch = getFeaturedMatch(fixtures);
  const thisWeek = getUpcomingFixtures(fixtures, 4);
  const topScorers = getTopScorers(players, 3);
  const standingsA = getTeamsByGroup(teams, 'A').slice(0, 3);
  const standingsB = getTeamsByGroup(teams, 'B').slice(0, 3);
  const byeTeams = featuredMatch ? getByeTeams(teams, fixtures, featuredMatch.round) : [];
  const totalGoals = players.reduce((s, p) => s + p.goals, 0);
  const matchesPlayed = results.length;

  return (
    <PageTransition>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pitch-950 via-pitch-900 to-dark-700">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <Badge tone="gold" className="mb-5">
            Jul 19 – Sep 6, 2026 · Jemo 1 And Abichu Community Pitch
          </Badge>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-wide text-chalk-50 leading-[0.95]">
            Bedr Summer
            <br />
            Tournament <span className="text-gold-500">2026</span>
          </h1>
          <p className="mt-5 font-mono text-sm sm:text-base uppercase tracking-[0.25em] text-emerald-400">
            Unity Through Football
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link to="/fixtures">
              <Button variant="primary" size="lg">
                View Fixtures
              </Button>
            </Link>
            <Link to="/standings">
              <Button variant="outline" size="lg">
                View Standings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Featured match + countdown ---------- */}
      {featuredMatch && (
        <section className="bg-pitch-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chalk-100/60 mb-3">
                <CircleDot size={13} className="text-emerald-400" />
                {featuredMatch.status === 'live' ? "Today's Match" : 'Next Match'}
              </span>
              <div className="max-w-md">
                <MatchCard match={featuredMatch} />
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-chalk-100/60">
                {featuredMatch.status === 'live' ? 'Status' : 'Kicks off in'}
              </span>
              <Countdown match={featuredMatch} />
              {byeTeams.length > 0 && (
                <span className="text-xs text-chalk-100/50">
                  Bye this round: <span className="text-gold-400 font-semibold">{byeTeams.map((t) => t.name).join(', ')}</span>
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* ---------- This week's matches ---------- */}
        <section>
          <SectionTitle
            eyebrow="Matchday"
            title="This Week's Matches"
            action={
              <Link to="/fixtures" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                All Fixtures <ArrowRight size={15} />
              </Link>
            }
          />
          {thisWeek.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {thisWeek.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No matches scheduled this week.</p>
          )}
        </section>

        {/* ---------- Standings preview ---------- */}
        <section>
          <SectionTitle
            eyebrow="Group Stage"
            title="Standings Preview"
            action={
              <Link to="/standings" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Full Standings <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Group A</h3>
              <StandingsTable teams={standingsA} />
            </div>
            <div>
              <h3 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Group B</h3>
              <StandingsTable teams={standingsB} />
            </div>
          </div>
        </section>

        {/* ---------- Top scorers preview ---------- */}
        <section>
          <SectionTitle
            eyebrow="Golden Boot Race"
            title="Top Scorers"
            action={
              <Link to="/top-scorers" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Full Rankings <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topScorers.map((p, i) => (
              <PreviewScorer key={p.id} player={p} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* ---------- Latest news ---------- */}
        <section>
          <SectionTitle
            eyebrow="Community"
            title="Latest News"
            action={
              <Link to="/news" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                All News <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {news.slice(0, 3).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        {/* ---------- Tournament stats ---------- */}
        <section>
          <SectionTitle eyebrow="By The Numbers" title="Tournament Statistics" align="left" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={Users} value={teams.length} label="Teams" />
            <StatCard icon={Trophy} value={players.length} label="Players" />
            <StatCard icon={Goal} value={totalGoals} label="Goals" />
            <StatCard icon={CalendarDays} value={matchesPlayed} label="Matches Played" />
          </div>
        </section>

        {/* ---------- Gallery preview ---------- */}
        <section>
          <SectionTitle
            eyebrow="Moments"
            title="Gallery"
            action={
              <Link to="/gallery" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Full Gallery <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((photo) => (
              <GalleryCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>

        {/* ---------- Sponsors ---------- */}
        <section>
          <SectionTitle eyebrow="With Thanks To" title="Our Sponsors" align="left" />
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {sponsors.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400 font-display text-sm">
                  {s.logoInitials}
                </span>
                <span className="text-sm font-semibold">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function PreviewScorer({ player, rank }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <Card className="p-5 flex items-center gap-4">
      <span className="text-2xl">{medals[rank - 1]}</span>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-sm text-ink dark:text-chalk-50 truncate">{player.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{player.team}</p>
      </div>
      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{player.goals}G</span>
    </Card>
  );
}
