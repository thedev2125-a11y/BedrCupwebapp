import bedrLogo from '../../assets/bedr-logo.png';
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
export default function BrandLogo({ size = 50, variant = 'default', className = '' }) {
  const isMono = variant === 'mono'; // single-color version for tight/dark spots

  return (
    <img
      src={bedrLogo}
      alt="BEDR Cup"
      style={{
        height: `${size}px`,
        width: 'auto',
      }}
      className={`rounded-full object-contain ${className}`}
    />
  );
}
