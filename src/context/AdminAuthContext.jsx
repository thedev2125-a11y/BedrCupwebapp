import { createContext, useCallback, useState } from 'react';

export const AdminAuthContext = createContext(null);

const SESSION_KEY = 'vst:admin-session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Credentials come from environment variables (see .env.example) rather
// than being written into a component — see README "Changing the Admin
// Password" for exactly how to change them.
//
// IMPORTANT LIMITATION: this is a static, frontend-only site with no
// server to verify a password against. Any VITE_ env var is compiled
// into the JS bundle that ships to the browser, so a technically
// determined visitor could find these values by reading the built
// files. This gate is meant to keep the /admin dashboard away from
// casual visitors and accidental edits on a small community site — it
// is NOT equivalent to server-verified authentication. See README for
// how to add real backend-verified auth if that's ever needed.
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme123';

function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    if (!expiresAt || Date.now() > expiresAt) {
      window.localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(loadSession);

  const login = useCallback((username, password) => {
    const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt: Date.now() + SESSION_TTL_MS }));
      setIsAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
