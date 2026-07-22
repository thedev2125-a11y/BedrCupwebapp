import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  ClipboardList,
  Shield,
  Users,
  Trophy,
  Newspaper,
  Image,
  Handshake,
  Settings as SettingsIcon,
  Menu,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Matches', to: '/admin/matches', icon: CalendarClock },
  { label: 'Results', to: '/admin/results', icon: ClipboardList },
  { label: 'Teams', to: '/admin/teams', icon: Shield },
  { label: 'Players', to: '/admin/players', icon: Users },
  { label: 'Top Scorers', to: '/admin/top-scorers', icon: Trophy },
  { label: 'News', to: '/admin/news', icon: Newspaper },
  { label: 'Gallery', to: '/admin/gallery', icon: Image },
  { label: 'Sponsors', to: '/admin/sponsors', icon: Handshake },
  { label: 'Settings', to: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex bg-chalk-50 dark:bg-pitch-950">
      {/* ---- Desktop sidebar ---- */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-pitch-950 text-chalk-100/80">
        <SidebarContent onNavigate={() => {}} onLogout={logout} />
      </aside>

      {/* ---- Mobile sidebar drawer ---- */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-pitch-950/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-pitch-950 text-chalk-100/80 h-full">
            <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={logout} />
          </aside>
        </div>
      )}

      {/* ---- Main content ---- */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/90 dark:bg-pitch-900/90 backdrop-blur-md px-4 sm:px-6 h-16">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-chalk-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-sm tracking-wide text-ink dark:text-chalk-50 lg:hidden">
            BEDR Admin
          </span>
          <Link
            to="/"
            target="_blank"
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            View public site <ExternalLink size={13} />
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.08]">
        <BrandLogo size={32} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm tracking-wide text-chalk-50">BEDR Admin</span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-chalk-100/40 mt-0.5">
            Village Cup
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-emerald-600 text-chalk-50'
                  : 'text-chalk-100/70 hover:text-chalk-50 hover:bg-white/[0.06]'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-chalk-100/70 hover:text-chalk-50 hover:bg-white/[0.06] transition-colors"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </>
  );
}
