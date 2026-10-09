const socialLinks = [
  { label: "graffitipasta.com", href: "https://graffitipasta.com" },
  { label: "Instagram", href: "https://www.instagram.com/graffiti_pasta" },
  { label: "TikTok", href: "https://tiktok.com/@graffitipasta" },
];

// Order matches the page's section order top-to-bottom
const sectionLinks = [
  { label: "Music", href: "#music" },
  { label: "Games", href: "#games" },
  { label: "Merch", href: "#merch" },
  { label: "Art", href: "#art" },
  { label: "Comics", href: "#comics" },
  { label: "Watch", href: "#videos" },
  { label: "Rewards", href: "#rewards" },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-[#2a2a2a] pt-12 pb-8 px-4"
      style={{ backgroundColor: "#0d0d0d" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #e63030, #ff6b1a, #ffd700, #ff6b1a, #e63030)" }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Visit block — the bridge from the Pasta-verse to a real table */}
        <div
          id="visit"
          className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 mb-12 text-center scroll-mt-24"
        >
          <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-2">
            Come Get Saucy
          </p>
          <h2 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest text-[#f5f5f5] text-2xl mb-6">
            Visit Graffiti Pasta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-8 text-left sm:text-center">
            <div>
              <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#f5f5f5]/80 text-sm font-bold mb-1">
                On the Square in Denton
              </p>
              <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] leading-relaxed">
                118 W Oak St
                <br />
                Denton, TX 76201
                <br />
                <a href="tel:+19403239489" className="hover:text-[#ff6b1a] transition-colors">
                  (940) 323-9489
                </a>
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#f5f5f5]/80 text-sm font-bold mb-1">
                Hours
              </p>
              <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] leading-relaxed">
                Open every day
                <br />
                11:00 am &ndash; 12:00 am
                <br />
                Full menu till close
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://graffitipasta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              View Menu
            </a>
            <a
              href="https://graffitipasta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
            >
              Reserve a Table
            </a>
          </div>
        </div>

        {/* Logo area */}
        <div className="text-center mb-8">
          <h2 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest text-[#f5f5f5] text-2xl">
            GRAFFITI PASTA
          </h2>
        </div>

        {/* Section nav */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider hover:text-[#ff6b1a] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }}
        />

        {/* External links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] hover:text-[#ff6b1a] transition-colors underline underline-offset-4 decoration-[#2a2a2a]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Powered by */}
        <p
          className="text-center text-[10px] font-[family-name:var(--font-oswald)] uppercase tracking-widest"
          style={{ color: "#f5f5f5", opacity: 0.2 }}
        >
          Powered by Pasta Life
        </p>

        {/* Copyright */}
        <p className="text-center text-[#f5f5f5]/20 text-[10px] font-[family-name:var(--font-inter)] mt-2">
          © {new Date().getFullYear()} Graffiti Pasta / ACM Creative Concepts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
