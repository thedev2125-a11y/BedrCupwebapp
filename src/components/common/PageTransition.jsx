import { motion } from 'framer-motion';

/**
 * Wraps a page's content in a consistent fade/slide entrance animation.
 * Used at the root of every page component (see src/pages/).
 */
export default function PageTransition({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
