import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from '../common/BackToTop';

/**
 * Shared page shell: sticky Navbar, the routed page content, Footer,
 * and the floating Back-to-top button. Wraps <Routes> once in App.jsx —
 * individual pages handle their own entrance animation via PageTransition.
 */
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-chalk-50 dark:bg-pitch-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
