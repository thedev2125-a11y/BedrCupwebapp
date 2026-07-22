import { useMemo, useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import FilterTabs from '../components/common/FilterTabs';
import EmptyState from '../components/common/EmptyState';
import GalleryCard from '../components/gallery/GalleryCard';
import Modal from '../components/common/Modal';

import { useData } from '../hooks/useData';
import { ImageOff } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Matches', value: 'Matches' },
  { label: 'Fans', value: 'Fans' },
  { label: 'Training', value: 'Training' },
  { label: 'Celebrations', value: 'Celebrations' },
];

export default function Gallery() {
  const { gallery } = useData();
  const [category, setCategory] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);

  const filtered = useMemo(
    () => (category === 'all' ? gallery : gallery.filter((p) => p.category === category)),
    [gallery, category]
  );

  return (
    <PageTransition>
      <PageHero eyebrow="Moments" title="Gallery" subtitle="Matchday action, fans, training, and celebrations from around the village pitch." />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <FilterTabs options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />

        {filtered.length === 0 ? (
          <EmptyState icon={ImageOff} title="No photos in this category yet" description="Check back after the next matchday." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((photo) => (
              <GalleryCard key={photo.id} photo={photo} onOpen={setActivePhoto} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!activePhoto} onClose={() => setActivePhoto(null)}>
        {activePhoto && (
          <div>
            <img src={activePhoto.image} alt={activePhoto.caption} className="w-full max-h-[70vh] object-cover" />
            <div className="p-5">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {activePhoto.category}
              </span>
              <p className="mt-1 text-sm text-ink dark:text-chalk-50">{activePhoto.caption}</p>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
