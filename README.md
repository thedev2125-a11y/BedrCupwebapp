# Village Summer Tournament — BEDR Youth Association

A responsive football-tournament website (React + Vite + Tailwind CSS) with a
built-in `/admin` dashboard for the organizer to manage teams, players,
fixtures, results, news, gallery, and sponsors — no backend required.

## Quick start

```bash
npm install
cp .env.example .env.local   # then edit the admin username/password
npm run dev
```

Open `http://localhost:5173` for the public site, and
`http://localhost:5173/admin` for the dashboard.

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

---

## Admin Dashboard

### Accessing it

Go to `/admin` (or `/admin/login` directly). You'll be redirected to the
login page if you're not signed in. After logging in you land on the
Dashboard, with a sidebar for Matches, Results, Teams, Players, Top Scorers,
News, Gallery, Sponsors, and Settings. Use the **Log Out** button at the
bottom of the sidebar to end your session.

### Changing the admin username/password

Credentials come from environment variables, **not** from any file you'd
see in the UI:

```bash
# .env.local (gitignored — never commit this file)
VITE_ADMIN_USERNAME=your-username
VITE_ADMIN_PASSWORD=your-strong-password
```

1. Copy `.env.example` to `.env.local` if you haven't already.
2. Set your own values.
3. Restart `npm run dev` (or rebuild for production) — Vite only reads
   `VITE_*` env vars at build/start time, not live.

If no `.env.local` is present, the app falls back to `admin` /
`changeme123` — **change this before showing the site to anyone else.**

### ⚠️ Important security limitation

This is a fully static, frontend-only site with no server. Any `VITE_*`
environment variable gets compiled directly into the JavaScript that ships
to every visitor's browser — so a technically determined person could find
your admin password by reading the built files, even though it never
appears in the UI. The login screen keeps out casual visitors and prevents
accidental edits by people browsing the public site; it is **not**
equivalent to real server-verified authentication.

For a small single-organizer community site this is a reasonable
trade-off. If you need real security (e.g. multiple admins, sensitive
data, public deployment at scale), the next step up is adding a proper
backend (e.g. Supabase Auth, Firebase Auth, or a small API with hashed
passwords) — ask your developer to wire that in before relying on this
for anything sensitive.

---

## How data storage works (localStorage)

There is **no database and no backend**. All tournament data lives in the
browser's `localStorage`, under keys prefixed `vst:` (e.g. `vst:teams`,
`vst:fixtures`). The flow is:

1. On first visit, the app has no `localStorage` data yet, so it seeds
   itself from the original JSON files in `src/data/*.json` (via
   `src/data/defaultData.js`).
2. Every admin action (add/edit/delete anything) updates React state in
   `DataContext` **and** writes the updated collection to `localStorage`
   immediately.
3. Both the public pages and the admin dashboard read from the same
   `DataContext`, so changes appear instantly everywhere — no page reload
   needed.
4. Refreshing the page reloads from `localStorage`, so changes persist
   across sessions.

### This is per-browser, not shared

**Changes made in the admin dashboard are only stored in that one
browser, on that one device.** They are not synced to a server and are
not visible to anyone using a different browser or device — including
you, if you open the site somewhere else. If you clear your browser's
site data (or use a different browser/incognito window), you'll see the
original sample data again.

If you need the tournament organizer's edits to be visible to every
visitor everywhere (i.e. a real shared, multi-device data source), the
data layer needs to move to a real backend (Supabase, Firebase, or a
custom API) — the `DataContext` in `src/context/DataContext.jsx` is
written as a single, isolated module specifically so that swap is
contained to one file plus the admin write calls; no public-page or
component changes should be needed.

### Resetting your data

Admin → Settings → **Reset to Sample Data** wipes everything in
`localStorage` and restores the original demo dataset. Useful if you want
to start clean or hand off a fresh copy of the site.

---

## How results propagate correctly (standings, top scorers, etc.)

Nothing about a team's win/loss record or a player's goal tally is stored
directly — it's **always calculated fresh** from the match data:

- `src/data/defaultData.js` converts the original flat JSON into a
  structured form: each fixture holds a `goals: []` array (which player,
  which team) and a `cards: []` array, instead of a pre-computed score
  summary.
- `src/utils/computeStats.js` exports pure functions —
  `computeStandings()` and `computePlayerStats()` — that derive every
  team's played/won/drawn/lost/points and every player's goals/cards/
  matches directly from the fixtures list, every time they're called.
- `DataContext` recomputes these (memoized) whenever fixtures, teams, or
  players change, and exposes them as `teamsWithStats` /
  `playersWithStats` for every page to consume.

This means editing a result in the admin dashboard can never leave
Standings, Top Scorers, or a Team's stats out of sync — there's no
separate "recalculate" step to forget, because there's nothing to
recalculate by hand in the first place.

---

## BEDR branding

The exact brand palette is defined once, in `src/index.css` under the
`@theme` block, and mapped onto the existing Tailwind color tokens
(`pitch-*`, `emerald-*`, `gold-*`, `chalk-*`, `slate-*`, plus a new `ink`
token for body text) — so every existing component picked up the rebrand
automatically:

| Token | Hex | Used for |
|---|---|---|
| `pitch-950` | `#0B4D3B` (Primary Dark Green) | Navbar, Footer, hero, dark-mode surfaces |
| `dark-700` / `emerald-600` | `#0F6B52` (Primary Green) | Primary buttons, links, active states |
| `emerald-100` | `#E8F3EF` (Light Green) | Soft badge/background fills |
| `gold-500` | `#C9A227` (Accent Gold) | Accents, CTAs, medals |
| `chalk-100` | `#FFFFFF` (White) | — |
| `chalk-50` | `#F8FAF9` (Light Background) | Default page background |
| `ink` | `#12312A` (Dark Text) | Headings/body text in light mode |
| `slate-500` | `#64748B` (Muted Text) | Secondary/meta text |

**Light Mode is the default** for first-time visitors (no `localStorage`
theme preference yet) — the existing Dark Mode toggle in the Navbar still
works and is remembered once used.

### About the logo

**No BEDR logo file was included in the project upload used to build
this** — only pre-existing placeholder assets were found. `src/components/
common/BrandLogo.jsx` is an SVG emblem built from the brand palette as a
stand-in, used in the Navbar, Footer, and Admin Login/Sidebar. To swap in
the real logo:

1. Add your logo file at `src/assets/bedr-logo.png` (or `.svg`).
2. In `src/components/common/BrandLogo.jsx`, replace the `<svg>...</svg>`
   block with an `<img src={bedrLogo} alt="BEDR Youth Association" ... />`
   (import the file at the top of that component).

Every place the logo appears will then update automatically — no other
file needs to change.

---

## Project structure

```
src/
  components/
    layout/        Navbar, Footer, Layout (public site shell)
    admin/          AdminLayout, DataTable, FormModal, ConfirmDialog, form fields, RequireAdminAuth
    common/         Button, Card, Modal, Badge, BrandLogo, PageHero, ...
    cards/ fixtures/ gallery/ news/ players/ standings/ tables/   (public UI)
  pages/            Public pages (Home, Fixtures, Results, Standings, Teams, ...)
  pages/admin/      Admin pages (Dashboard, Matches, Results, Teams, Players, ...)
  context/          ThemeContext, DataContext, AdminAuthContext, ToastContext, TournamentContext
  hooks/            useData, useAdminAuth, useToast, useTheme, useTournament, useCountdown
  data/             Original JSON "sample database" + defaultData.js (structuring/seeding logic)
  utils/            tournamentStats.js (display helpers), computeStats.js (standings/top-scorers derivation)
```

The public-facing pages, routes, and reusable components are unchanged
from the original project — the admin dashboard was added alongside them,
reusing the same design system (`src/index.css` tokens) and many of the
same components (`Card`, `Badge`, `Button`, `Modal`, `SearchBar`, ...).

The `/admin/*` route tree is code-split (`React.lazy`) from the public
bundle, so regular visitors never download any admin code.

---

## Known limitations

- **Per-browser data** — see "How data storage works" above. This is the
  single biggest limitation of the localStorage approach: it's genuinely
  frontend-only, with no shared source of truth across devices/browsers.
- **Client-only auth** — see the security note above.
- **No image uploads** — News/Gallery/Team logos take an image *URL*
  (paste a link), since there's no backend to store uploaded files.
- **No official BEDR logo yet** — see "About the logo" above.
- Semi Final / Final fixtures don't exist until the admin creates them
  (once real group-stage qualifiers are known) — the Fixtures page's
  bracket section stays empty until then, which is intentionally honest
  rather than showing a placeholder that doesn't correspond to real data.
