import { Link } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <PageTransition className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
          <Trophy size={28} />
        </span>
        <h1 className="font-display text-6xl sm:text-7xl text-ink dark:text-chalk-50">404</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Looks like this page got sent off. The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="inline-block mt-7">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
      </div>
    </PageTransition>
  );
}
