/**
 * BEDR Youth Association brand mark.
 *
 * NOTE: no logo file was provided, so this is an SVG emblem built from the
 * official BEDR palette as a placeholder. To use a real logo file instead:
 *   1. Drop the file at src/assets/bedr-logo.png (or .svg)
 *   2. Replace the <svg>...</svg> block below with:
 *        <img src={bedrLogo} alt="BEDR Youth Association" className={className} />
 *      (import bedrLogo from '../../assets/bedr-logo.png' at the top)
 * Every place this component is used (Navbar, Footer, Admin login, Admin
 * sidebar) will then pick up the real logo automatically — no other
 * changes needed.
 */
export default function BrandLogo({ size = 36, variant = 'default', className = '' }) {
  const isMono = variant === 'mono'; // single-color version for tight/dark spots

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="BEDR Youth Association"
    >
      <circle cx="24" cy="24" r="22" fill={isMono ? 'transparent' : '#0B4D3B'} stroke="#C9A227" strokeWidth="2" />
      <circle cx="24" cy="24" r="17.5" fill="none" stroke="#E8F3EF" strokeOpacity="0.25" strokeWidth="1" />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="Anton, 'Arial Narrow', sans-serif"
        fontSize="15"
        letterSpacing="0.5"
        fill={isMono ? 'currentColor' : '#FFFFFF'}
      >
        BEDR
      </text>
      <path
        d="M15 33.5c3-1.5 15-1.5 18 0"
        stroke="#C9A227"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
