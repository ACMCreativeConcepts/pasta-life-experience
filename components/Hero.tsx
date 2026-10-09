import Image from "next/image";

// Order matches the page's section order top-to-bottom; "Visit" rounds
// out the grid (2x4) and jumps to the location info in the footer
const navLinks = [
  { label: "🎵 Listen", href: "#music" },
  { label: "🎮 Games", href: "#games" },
  { label: "👕 Shop", href: "#merch" },
  { label: "🎨 Art", href: "#art" },
  { label: "💬 Comics", href: "#comics" },
  { label: "🎬 Watch", href: "#videos" },
  { label: "🏆 Rewards", href: "#rewards" },
  { label: "📍 Visit", href: "#visit" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%)" }}
    >
      {/* Background texture / noise layer */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #e63030 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #ff6b1a 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #ffd700 0%, transparent 70%)`,
        }}
      />

      {/* Decorative spray paint dots */}
      <div className="absolute top-16 left-4 w-2 h-2 rounded-full bg-[#e63030] opacity-60" />
      <div className="absolute top-32 right-8 w-3 h-3 rounded-full bg-[#ffd700] opacity-40" />
      <div className="absolute bottom-32 left-12 w-2 h-2 rounded-full bg-[#ff6b1a] opacity-50" />
      <div className="absolute bottom-16 right-6 w-1.5 h-1.5 rounded-full bg-[#e63030] opacity-70" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto pt-24 pb-12">
        {/* Eyebrow */}
        <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-4">
          Graffiti Pasta
        </p>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/pasta-life-logo.png"
            alt="Pasta Life Experience"
            width={480}
            height={184}
            className="w-full max-w-[390px] sm:max-w-[480px]"
            priority
          />
        </div>

        {/* Subheadline */}
        <p
          className="text-[#f5f5f5]/70 font-[family-name:var(--font-inter)] font-medium mb-10 leading-relaxed"
          style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}
        >
          A full Pasta-verse with music, art, merch &amp; more
        </p>

        {/* Navigation pills grid */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto sm:max-w-md sm:grid-cols-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center py-4 px-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm text-[#f5f5f5] hover:bg-[#e63030] hover:border-[#e63030] active:scale-95 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[#f5f5f5] text-xs font-[family-name:var(--font-inter)] uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#f5f5f5] to-transparent" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #e63030, #ff6b1a, #ffd700, #ff6b1a, #e63030)" }}
      />
    </section>
  );
}
