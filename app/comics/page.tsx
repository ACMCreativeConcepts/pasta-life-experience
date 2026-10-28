import type { Metadata } from "next";
import { getComics } from "@/lib/comics";
import ComicReader from "@/components/ComicReader";

export const metadata: Metadata = {
  title: "Pasta Life Comics | Graffiti Pasta",
  description:
    "Weekly comic strips by Svaya from the Graffiti Pasta universe. New comics every Sunday.",
};

export default async function ComicsPage() {
  const comics = await getComics();

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #14100c 60%, #0d0d0d 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-2">
            The Pasta-Verse &middot; New Every Sunday
          </p>
          <h1
            className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5]"
            style={{ fontSize: "clamp(1.8rem, 7vw, 2.8rem)" }}
          >
            Pasta Life Comics
          </h1>
          <div className="mt-2 flex justify-center" aria-hidden="true">
            <div
              className="h-1.5 w-20 rounded-full"
              style={{
                background: "linear-gradient(90deg, #e63030, #ff6b1a, #ffd700)",
                transform: "rotate(-1.2deg)",
                boxShadow: "0 2px 10px rgba(230, 48, 48, 0.4)",
              }}
            />
          </div>
        </div>

        <ComicReader comics={comics} />

        {/* Back link */}
        <div className="text-center mt-14">
          <a
            href="/#comics"
            className="text-[#ff6b1a] text-sm font-[family-name:var(--font-inter)] font-semibold hover:underline"
          >
            ← Back to the Pasta Life Experience
          </a>
        </div>
      </div>
    </main>
  );
}
