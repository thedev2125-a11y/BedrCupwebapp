import { useState } from 'react';
import { Mail, Phone, Heart } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import SponsorCard from '../components/cards/SponsorCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

import { useData } from '../hooks/useData';

const TIERS = [
  { key: 'gold', label: 'Gold Sponsors' },
  { key: 'silver', label: 'Silver Sponsors' },
  { key: 'bronze', label: 'Bronze Sponsors' },
];

export default function Sponsors() {
  const { sponsors, settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageTransition>
      <PageHero
        eyebrow="With Thanks To"
        title="Sponsors"
        subtitle="The Village Summer Tournament runs because of the generosity of these local businesses."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {TIERS.map(({ key, label }) => {
          const group = sponsors.filter((s) => s.tier === key);
          if (group.length === 0) return null;
          return (
            <section key={key}>
              <SectionTitle eyebrow={`${group.length} Partner${group.length > 1 ? 's' : ''}`} title={label} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} />
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-[var(--radius-card)] bg-gradient-to-br from-pitch-900 to-pitch-950 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 mx-auto mb-4">
            <Heart size={22} />
          </span>
          <h3 className="font-display text-2xl text-chalk-50 mb-2">Support Village Football</h3>
          <p className="text-sm text-chalk-100/70 max-w-md mx-auto mb-6">
            Sponsorship keeps the pitch maintained, the trophies polished, and the tournament free for every team
            in the village to enter.
          </p>
          <Button variant="gold" onClick={() => setIsOpen(true)}>
            Become a Sponsor
          </Button>
        </section>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-md">
        <div className="p-7">
          <h3 className="font-display text-2xl text-ink dark:text-chalk-50 mb-2">Become a Sponsor</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Reach out and our organizing committee will get back to you with sponsorship packages and matchday
            branding options.
          </p>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2.5 text-ink dark:text-chalk-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Mail size={16} className="text-emerald-500" /> {settings.contactEmail}
            </a>
            <a href={`tel:${settings.contactPhone?.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 text-ink dark:text-chalk-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Phone size={16} className="text-emerald-500" /> {settings.contactPhone}
            </a>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
