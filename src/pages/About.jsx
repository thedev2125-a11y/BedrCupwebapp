import { Target, Eye, ScrollText, MapPin, Mail, Phone } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';

const RULES = [
  'Each match consists of two 25-minute halves with a 5-minute break.',
  'Squads are limited to 6 registered players per team, all eligible to play.',
  'Group matches: 3 points for a win, 1 for a draw, 0 for a loss.',
  'Ties in the standings are broken by goal difference, then goals scored.',
  'Semi Finals and the Final are single-elimination; extra time and penalties apply if level after 90 minutes.',
  'Two yellow cards in a match result in a red card and suspension for the next fixture.',
];

export default function About() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Our Story"
        title="About the Tournament"
        subtitle="A community celebration of football, now in its latest edition."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section>
          <SectionTitle eyebrow="Since Day One" title="Tournament History" />
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The Village Summer Tournament began as a handful of informal weekend matches between neighboring
            teams and has grown into the village's biggest annual sporting event. Every summer, ten teams and
            over sixty players take to the community pitch, cheered on by families, friends, and local
            businesses who sponsor the competition. What started as a way to keep young players active during
            the school break has become a tradition that brings the whole village together.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card hover={false} className="p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400 mb-4">
              <Target size={20} />
            </span>
            <h3 className="font-display text-xl tracking-wide text-ink dark:text-chalk-50 mb-2">Mission</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To give every young footballer in the village a fair, well-organized, and joyful platform to
              compete, improve, and represent their community.
            </p>
          </Card>
          <Card hover={false} className="p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 mb-4">
              <Eye size={20} />
            </span>
            <h3 className="font-display text-xl tracking-wide text-ink dark:text-chalk-50 mb-2">Vision</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To grow the tournament into a fixture that unites neighboring villages, nurtures local talent,
              and strengthens community spirit through sport for years to come.
            </p>
          </Card>
        </div>

        <section>
          <SectionTitle eyebrow="Fair Play" title="Tournament Rules" />
          <Card hover={false} className="p-7">
            <ul className="space-y-3">
              {RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <ScrollText size={11} />
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionTitle eyebrow="Get In Touch" title="Contact Information" />
          <Card hover={false} className="p-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-500 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-ink dark:text-chalk-50">Venue</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Village Community Pitch, Main Road</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-emerald-500 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-ink dark:text-chalk-50">Email</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">info@villagecup.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-emerald-500 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-ink dark:text-chalk-50">Phone</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">+251 900 000 000</div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageTransition>
  );
}
