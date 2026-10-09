import type { Metadata } from "next";
import musicConfig from "@/config/music.json";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "At the Table | Pasta Life Experience",
  description:
    "You're at Graffiti Pasta. The playlist, the art on the walls, comics and games — right from your table.",
  robots: { index: false }, // reached by QR code, not search
};

function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
      <p className="text-[#ff6b1a] text-[11px] font-[family-name:var(--font-oswald)] font-semibold tracking-[0.25em] uppercase mb-1">
        {eyebrow}
      </p>
      <h2 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-xl mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function TablePage() {
  const { spotifyPlaylistEmbedUrl } = musicConfig;

  return (
    <main
      className="min-h-screen px-4 py-10"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 60%, #0d0d0d 100%)" }}
    >
      <div className="max-w-md mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="text-center mb-2">
          <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-2">
            You&apos;re at Graffiti Pasta
          </p>
          <h1
            className="font-[family-name:var(--font-oswald)] font-bold uppercase leading-tight"
            style={{
              fontSize: "clamp(2rem, 9vw, 2.8rem)",
              background: "linear-gradient(135deg, #e63030, #ff6b1a, #ffd700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome to the Table
          </h1>
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mt-2">
            The Pasta-verse, right from your seat.
          </p>
        </div>

        {/* Now playing */}
        <Card eyebrow="Now Playing" title="The Dining Playlist">
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-4 leading-relaxed">
            This is what&apos;s playing in the room right now. Follow it and
            take it home.
          </p>
          {spotifyPlaylistEmbedUrl && (
            <iframe
              src={spotifyPlaylistEmbedUrl}
              width="100%"
              height="152"
              style={{ borderRadius: "12px" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
        </Card>

        {/* Trivia — the while-you-wait play */}
        <Card eyebrow="While You Wait" title="Pasta Trivia">
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-4 leading-relaxed">
            10 questions. Pasta facts and GP deep cuts. Beat your table.
          </p>
          <a
            href="/games/trivia"
            className="block text-center py-3.5 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
          >
            Play Now →
          </a>
        </Card>

        {/* The art around you */}
        <Card eyebrow="Look Around" title="The Art on These Walls">
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-4 leading-relaxed">
            Every mural and painting in here is by a local artist — and most of
            it is for sale, with 100% going to the creator. The murals? That&apos;s
            DETOX. The hand-painted hats behind the bar? Artist Till Death.
          </p>
          <a
            href="/#art"
            className="block text-center py-3 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
          >
            Browse the Gallery
          </a>
        </Card>

        {/* Comics */}
        <Card eyebrow="Fresh Off the Wall" title="Pasta Life Comics">
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-4 leading-relaxed">
            Weekly strips by Svaya — she might be the one bringing your food.
          </p>
          <a
            href="/#comics"
            className="block text-center py-3 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
          >
            Read a Strip
          </a>
        </Card>

        {/* GPC list */}
        <Card eyebrow="Coming Soon" title="Graffiti Pasta Coin">
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mb-4 leading-relaxed">
            Our rewards program is on the way — earn GPC for visits, games and
            merch, spend it on food and exclusives. Early members get bonus
            coins on day one.
          </p>
          <SubscribeForm source="table" />
        </Card>

        {/* Footer links */}
        <div className="text-center mt-4 flex flex-col gap-3">
          <a
            href="https://graffitipasta.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] hover:text-[#ff6b1a] transition-colors underline underline-offset-4 decoration-[#2a2a2a]"
          >
            Menu &amp; ordering → graffitipasta.com
          </a>
          <a
            href="/"
            className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] hover:text-[#ff6b1a] transition-colors underline underline-offset-4 decoration-[#2a2a2a]"
          >
            Explore the full Pasta Life Experience
          </a>
        </div>
      </div>
    </main>
  );
}
