import { Expand } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * photo shape: { id, category, caption }
 * onOpen: called with the photo when clicked, to drive the preview Modal.
 */
export default function GalleryCard({ photo, onOpen }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen?.(photo)}
      className="group relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-emerald-600 to-pitch-800 flex items-center justify-center text-left"
    >
      <span className="font-display text-2xl text-chalk-50/20">{photo.category}</span>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-pitch-950/80 via-pitch-950/0 to-pitch-950/0 opacity-0 group-hover:opacity-100 transition-opacity p-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-chalk-50">
          <Expand size={13} /> {photo.caption}
        </span>
      </div>
    </motion.button>
  );
}
