import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Fixtures', to: '/fixtures' },
  { label: 'Results', to: '/results' },
  { label: 'Standings', to: '/standings' },
  { label: 'Teams', to: '/teams' },
  { label: 'Top Scorers', to: '/top-scorers' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'News', to: '/news' },
  { label: 'Sponsors', to: '/sponsors' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change would normally use useLocation;
  // kept simple here since routing is wired up in a later step.

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-pitch-950/95 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(4,26,16,0.4)]'
          : 'bg-pitch-950'
      )}
    >
      {/* thin pitch-line accent along the very top of the page */}
      <div className="pitch-line w-full opacity-70" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo + tournament name */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="shrink-0 drop-shadow-sm">
            <BrandLogo size={38} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display tracking-wide text-lg text-chalk-50">
              BEDR <span className="text-gold-500">CUP</span>
            </span>
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-chalk-100/50 mt-0.5">
              by BEDR Youth Association
            </span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-full text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-ink bg-emerald-500'
                    : 'text-chalk-100/80 hover:text-chalk-50 hover:bg-white/[0.06]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full text-chalk-100/80 hover:text-gold-400 hover:bg-white/[0.06] transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full text-chalk-50 hover:bg-white/[0.06] transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-pitch-900 border-t border-white/[0.06]"
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                      isActive
                        ? 'text-ink bg-emerald-500'
                        : 'text-chalk-100/80 hover:text-chalk-50 hover:bg-white/[0.06]'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
