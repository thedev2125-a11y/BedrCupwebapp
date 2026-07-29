import { Link } from 'react-router-dom';
import { Users, Trophy, CalendarDays, Goal, Plus, Newspaper, Image, Handshake } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatTile from '../../components/admin/AdminStatTile';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { getUpcomingFixtures } from '../../utils/tournamentStats';

const STATUS_TONE = { live: 'live', upcoming: 'upcoming', completed: 'completed' };

export default function AdminDashboard() {
  const { teams, players, fixturesDisplay, resultsDisplay, news, gallery, sponsors } = useData();

  const upcoming = getUpcomingFixtures(fixturesDisplay, 5);
  const recentResults = [...resultsDisplay].reverse().slice(0, 5);
  const totalGoals = resultsDisplay.reduce((s, m) => s + (m.homeScore || 0) + (m.awayScore || 0), 0);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of the Bedr Summer Tournament — everything here is stored in this browser."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <AdminStatTile icon={Users} value={teams.length} label="Teams" />
        <AdminStatTile icon={Trophy} value={players.length} label="Players" />
        <AdminStatTile icon={CalendarDays} value={resultsDisplay.length} label="Matches Played" tone="gold" />
        <AdminStatTile icon={Goal} value={totalGoals} label="Goals Scored" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <section>
          <h2 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Upcoming Matches</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <Card hover={false} className="p-5 text-sm text-slate-500 dark:text-slate-400">
                No upcoming matches scheduled.
              </Card>
            )}
            {upcoming.map((m) => (
              <Card hover={false} key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink dark:text-chalk-50 truncate">
                    {m.homeTeam.name} <span className="text-slate-400">vs</span> {m.awayTeam.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.round} · {m.date} · {m.time}
                  </div>
                </div>
                <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Recent Results</h2>
          <div className="space-y-3">
            {recentResults.length === 0 && (
              <Card hover={false} className="p-5 text-sm text-slate-500 dark:text-slate-400">
                No completed matches yet.
              </Card>
            )}
            {recentResults.map((m) => (
              <Card hover={false} key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink dark:text-chalk-50 truncate">
                    {m.homeTeam.name}{' '}
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      {m.homeScore}-{m.awayScore}
                    </span>{' '}
                    {m.awayTeam.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.round} · {m.date}</div>
                </div>
                <Badge tone="completed">FT</Badge>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/admin/matches">
            <Button variant="outline" icon={Plus} className="w-full justify-center !text-ink !border-ink dark:!text-chalk-50 dark:!border-chalk-50">
              Fixture
            </Button>
          </Link>
          <Link to="/admin/news">
            <Button variant="outline" icon={Newspaper} className="w-full justify-center !text-ink !border-ink dark:!text-chalk-50 dark:!border-chalk-50">
              News
            </Button>
          </Link>
          <Link to="/admin/gallery">
            <Button variant="outline" icon={Image} className="w-full justify-center !text-ink !border-ink dark:!text-chalk-50 dark:!border-chalk-50">
              Photo
            </Button>
          </Link>
          <Link to="/admin/sponsors">
            <Button variant="outline" icon={Handshake} className="w-full justify-center !text-ink !border-ink dark:!text-chalk-50 dark:!border-chalk-50">
              Sponsor
            </Button>
          </Link>
        </div>
      </section>

      <p className="mt-10 text-xs text-slate-500 dark:text-slate-400">
        Gallery: {gallery.length} photos · Sponsors: {sponsors.length} · News: {news.length} articles
      </p>
    </div>
  );
}
