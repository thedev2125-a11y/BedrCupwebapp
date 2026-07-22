export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div className="relative bg-pitch-950 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 64px)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {eyebrow && (
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-emerald-400 mb-2">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide text-chalk-50">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-xl text-chalk-100/70">{subtitle}</p>}
        <div className="pitch-line w-16 mt-5" />
      </div>
    </div>
  );
}
