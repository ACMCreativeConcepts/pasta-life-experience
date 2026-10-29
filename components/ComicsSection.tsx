import SectionHeader from "@/components/SectionHeader";
import { getComics, getLegacyComics, sortComics, type ComicEntry } from "@/lib/comics";
import { formatComicDate } from "@/lib/dates";

/**
 * Homepage comics section: this week's strip, big, on paper —
 * tap through to the full reader at /comics.
 */
export default async function ComicsSection() {
  let comics: ComicEntry[];
  let archiveDown = false;
  try {
    comics = await getComics();
  } catch (error) {
    console.error("[ComicsSection] Archive read failed:", error);
    comics = sortComics(getLegacyComics());
    archiveDown = true;
  }
  const latest = comics[0];

  return (
    <section id="comics" className="gp-section" style={{ backgroundColor: "#0f0f0f" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          center
          eyebrow="New Every Sunday"
          title="Pasta Life Comics"
          subtitle="Weekly comic strips by Svaya, straight from the Graffiti Pasta universe."
        />

        {latest && (
          <a href="/comics" className="block group">
            {/* This week's paper */}
            <div
              className="relative mx-auto max-w-2xl rounded-sm px-4 pt-4 pb-6 sm:px-8 sm:pt-8 transition-transform duration-300 group-hover:-translate-y-1"
              style={{
                background: "#f7f2e5",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src={latest.image}
                alt={latest.title}
                loading="lazy"
                className="w-full h-auto block mx-auto"
                style={{ maxHeight: "70vh", width: "auto", maxWidth: "100%" }}
              />
              <div
                className="mt-5 text-center border-t pt-4"
                style={{ borderColor: "#d8cfb8" }}
              >
                <p
                  className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-lg"
                  style={{ color: "#1c1a14" }}
                >
                  {latest.title}
                </p>
                <p
                  className="text-xs font-[family-name:var(--font-inter)] mt-1"
                  style={{ color: "#6b6454" }}
                >
                  Pasta Life Comics by Svaya &middot; {formatComicDate(latest.date)}
                </p>
              </div>
            </div>
          </a>
        )}

        {/* Archive CTA */}
        <div className="text-center mt-8">
          <a
            href="/comics"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
          >
            Read the Archive →
          </a>
          <p className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-inter)] mt-3">
            {archiveDown
              ? "The newest strips are temporarily unavailable — the classics are still here."
              : `${comics.length} strips and counting. New comics every Sunday.`}
          </p>
        </div>
      </div>

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
