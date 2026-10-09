interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

/**
 * Unified section header: orange eyebrow tag, Oswald title,
 * spray-stroke underline, muted subtitle. Used by every section
 * so the whole page reads as one system.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <h2
        className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5]"
        style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)" }}
      >
        {title}
      </h2>
      {/* Spray-stroke underline */}
      <div
        className={`mt-2 mb-3 flex ${center ? "justify-center" : ""}`}
        aria-hidden="true"
      >
        <div
          className="h-1.5 w-20 rounded-full"
          style={{
            background: "linear-gradient(90deg, #e63030, #ff6b1a, #ffd700)",
            transform: "rotate(-1.2deg)",
            boxShadow: "0 2px 10px rgba(230, 48, 48, 0.4)",
          }}
        />
      </div>
      {subtitle && (
        <p
          className={`text-[#f5f5f5]/50 font-[family-name:var(--font-inter)] text-sm leading-relaxed max-w-xl ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
