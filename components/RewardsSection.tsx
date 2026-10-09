// IMPORTANT: GPC (Graffiti Pasta Coin) is NOT cryptocurrency.
// NOT an investment. NOT a security. NO cash value.
// It is a restaurant loyalty points system only.

import SectionHeader from "@/components/SectionHeader";

const earnWays = [
  { emoji: "📱", label: "Scan QR at the table" },
  { emoji: "🎬", label: "Watch a music video" },
  { emoji: "👕", label: "Buy merch" },
  { emoji: "🎉", label: "Attend an event" },
  { emoji: "🍝", label: "Try a new dish" },
  { emoji: "📲", label: "Share on social" },
];

const spendWays = [
  { emoji: "🥗", label: "Free appetizers" },
  { emoji: "🏷️", label: "Merch discounts" },
  { emoji: "🤫", label: "Secret menu access" },
  { emoji: "🎟️", label: "Event early access" },
  { emoji: "🍹", label: "Cocktail credits" },
  { emoji: "🎁", label: "Exclusive drops" },
];

export default function RewardsSection() {
  return (
    <section id="rewards" className="gp-section" style={{ backgroundColor: "#0d0d0d" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest mb-4 border border-[#ffd700]/30"
            style={{ color: "#ffd700", background: "rgba(255,215,0,0.08)" }}
          >
            Coming Soon
          </div>
        </div>
        <SectionHeader
          center
          eyebrow="Earn GPC. Spend it on the good stuff."
          title="Graffiti Pasta Coin"
        />
        {/* Legal disclaimer */}
        <p className="text-[#f5f5f5]/30 text-[10px] font-[family-name:var(--font-inter)] max-w-xs mx-auto leading-relaxed text-center -mt-6 mb-8">
          GPC is a restaurant loyalty points program. Not cryptocurrency.
          Not an investment. No cash value.
        </p>

        {/* Earn + Spend cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8 max-w-2xl mx-auto">
          {/* Earn */}
          <div
            className="rounded-2xl border border-[#e63030]/30 bg-[#1a1a1a] p-6"
            style={{ boxShadow: "0 0 20px rgba(230, 48, 48, 0.08)" }}
          >
            <h3
              className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#e63030] mb-4 text-sm"
            >
              💰 How You Earn
            </h3>
            <ul className="flex flex-col gap-3">
              {earnWays.map((way) => (
                <li key={way.label} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center shrink-0">{way.emoji}</span>
                  <span className="text-[#f5f5f5]/70 text-sm font-[family-name:var(--font-inter)]">
                    {way.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spend */}
          <div
            className="rounded-2xl border border-[#ffd700]/30 bg-[#1a1a1a] p-6"
            style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.08)" }}
          >
            <h3
              className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#ffd700] mb-4 text-sm"
            >
              🛍️ How You Spend
            </h3>
            <ul className="flex flex-col gap-3">
              {spendWays.map((way) => (
                <li key={way.label} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center shrink-0">{way.emoji}</span>
                  <span className="text-[#f5f5f5]/70 text-sm font-[family-name:var(--font-inter)]">
                    {way.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Join the list */}
        <div
          className="rounded-2xl border border-[#ff6b1a]/30 bg-[#1a1a1a] p-6 text-center max-w-2xl mx-auto"
        >
          <p
            className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] mb-2 text-lg"
          >
            🔔 Join the List
          </p>
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-5 leading-relaxed">
            Be first to know when GPC launches. Early members get bonus coins on
            day one.
          </p>
          <a
            href="mailto:acmcreativeconcepts@gmail.com?subject=GPC Early Access — Join the List&body=I want to be on the Graffiti Pasta Coin early access list!"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
          >
            Get Early Access
          </a>
        </div>
      </div>

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
