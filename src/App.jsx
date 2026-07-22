import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';

import Home from './pages/Home';
import Fixtures from './pages/Fixtures';
import Results from './pages/Results';
import Standings from './pages/Standings';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import TopScorers from './pages/TopScorers';
import Gallery from './pages/Gallery';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Sponsors from './pages/Sponsors';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Admin section is code-split from the public bundle — visitors browsing
// the public site never download any admin code.
const RequireAdminAuth = lazy(() => import('./components/admin/RequireAdminAuth'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMatches = lazy(() => import('./pages/admin/AdminMatches'));
const AdminResults = lazy(() => import('./pages/admin/AdminResults'));
const AdminTeams = lazy(() => import('./pages/admin/AdminTeams'));
const AdminPlayers = lazy(() => import('./pages/admin/AdminPlayers'));
const AdminTopScorers = lazy(() => import('./pages/admin/AdminTopScorers'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminSponsors = lazy(() => import('./pages/admin/AdminSponsors'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

/** The public site keeps its existing Navbar/Footer shell. */
function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk-50 dark:bg-pitch-950">
      <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          {/* ---------- Public site ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/results" element={<Results />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetails />} />
            <Route path="/top-scorers" element={<TopScorers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ---------- Admin ---------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdminAuth />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="matches" element={<AdminMatches />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="players" element={<AdminPlayers />} />
              <Route path="top-scorers" element={<AdminTopScorers />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="sponsors" element={<AdminSponsors />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
