import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import Button from '../../components/common/Button';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter both a username and password.');
      return;
    }
    setIsSubmitting(true);
    // Local credential check — no network round-trip, but we keep this
    // async-shaped so swapping in real backend auth later is a small diff.
    setTimeout(() => {
      const ok = login(username.trim(), password);
      setIsSubmitting(false);
      if (!ok) {
        setError('Incorrect username or password.');
        return;
      }
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk-50 dark:bg-pitch-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size={56} />
          <h1 className="font-display text-2xl tracking-wide text-ink dark:text-chalk-50 mt-4">
            BEDR Admin
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Village Summer Tournament dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 shadow-[var(--shadow-card)] border border-black/[0.04] dark:border-white/[0.06] p-7 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3.5 py-2.5">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <label className="block">
            <span className="block text-sm font-semibold text-ink dark:text-chalk-50 mb-1.5">Username</span>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-pitch-900 py-2.5 pl-10 pr-4 text-sm text-ink dark:text-chalk-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="admin"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-ink dark:text-chalk-50 mb-1.5">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-pitch-900 py-2.5 pl-10 pr-4 text-sm text-ink dark:text-chalk-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="••••••••"
              />
            </div>
          </label>

          <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Data is stored locally in this browser only. See the README for how to change these credentials.
        </p>
      </div>
    </div>
  );
}
