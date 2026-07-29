import { Expand } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * photo shape: { id, image, category, caption }
 * onOpen: called with the photo when clicked, to drive the preview Modal.
 */
export default function GalleryCard({ photo, onOpen }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen?.(photo)}
      className="group relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-emerald-600 to-pitch-800 text-left"
    >
      {/* Gallery Image */}
      {photo.image && (
        <img
          src={photo.image}
          alt={photo.caption || photo.category}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-pitch-950/80 via-pitch-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Caption */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-chalk-50">
          <Expand size={13} />
          {photo.caption}
        </span>
      </div>
    </motion.button>
  );
}