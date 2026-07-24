import { NavLink } from 'react-router-dom';
import { MapPin, Mail, Phone, ThumbsUp, Camera, Play, Send } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const QUICK_LINKS = [
  { label: 'Fixtures', to: '/fixtures' },
  { label: 'Standings', to: '/standings' },
  { label: 'Teams', to: '/teams' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Sponsors', to: '/sponsors' },
];

const SOCIALS = [
  { icon: ThumbsUp, label: 'Facebook', href: '#' },
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Play, label: 'YouTube', href: '#' },
  { icon: Send, label: 'Telegram', href: 'https://t.me/BADR_YOUTH_ASSOCIATION' },
];

export default function Footer() {
  return (
    <footer className="bg-pitch-950 text-chalk-100/80">
      <div className="pitch-line w-full opacity-70" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <BrandLogo size={36} />
            <span className="font-display tracking-wide text-lg text-chalk-50">
              BEDR <span className="text-gold-500">CUP</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Organized by the <span className="text-chalk-50 font-semibold">BEDR Youth Association</span> —
            ten teams, one pitch, and a whole community cheering from the touchline.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display tracking-wide text-sm text-chalk-50 mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="hover:text-emerald-400 transition-colors">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display tracking-wide text-sm text-chalk-50 mb-4">
            CONTACT
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 text-emerald-400 shrink-0" />
              Jemo 1 Community Pitch And Abichu Community Pitch
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-emerald-400 shrink-0" />
              +251 934 154 848 / +251 980 715 057
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-emerald-400 shrink-0" />
              hassumi009@gmail.com
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-display tracking-wide text-sm text-chalk-50 mb-4">
            FOLLOW THE CUP
          </h4>
          <div className="flex gap-2">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] hover:bg-emerald-600 hover:text-chalk-50 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-chalk-100/50 text-center">
          © {new Date().getFullYear()} BEDR Youth Association — Village Summer Tournament. Built with unity, for the village.
        </div>
      </div>
    </footer>
  );
}
