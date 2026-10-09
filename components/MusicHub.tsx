import Image from "next/image";
import musicConfig from "@/config/music.json";
import SectionHeader from "@/components/SectionHeader";

function AlbumDropCard() {
  const { featuredAlbum } = musicConfig;
  const releaseDate = new Date(featuredAlbum.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#e63030]/40 bg-[#1a1a1a]"
      style={{ boxShadow: "0 0 40px rgba(230, 48, 48, 0.15)" }}
    >
      {/* Album cover art */}
      <div className="w-full max-w-[280px] mx-auto mt-8 rounded-xl overflow-hidden border border-[#2a2a2a] relative" style={{ aspectRatio: "1/1" }}>
        <Image
          src="/album-cover-graffiti-pastas.png"
          alt={`${featuredAlbum.title} — ${featuredAlbum.artist}`}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="p-6 text-center">
        {/* Drop badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest text-sm"
          style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
        >
          OUT NOW
        </div>

        <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] mb-6 leading-relaxed">
          The debut album. Streaming everywhere now.
        </p>

        {/* Platform buttons — live */}
        <div className="flex flex-col gap-3">
          <a
            href={featuredAlbum.spotifyAlbumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-3 px-6 rounded-full border border-[#1DB954]/60 text-[#1DB954] font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm hover:bg-[#1DB954]/10 transition-colors"
            style={{ background: "rgba(29,185,84,0.05)" }}
          >
            Listen on Spotify
          </a>
          <a
            href={featuredAlbum.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-3 px-6 rounded-full border border-[#fc3c44]/60 text-[#fc3c44] font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm hover:bg-[#fc3c44]/10 transition-colors"
            style={{ background: "rgba(252,60,68,0.05)" }}
          >
            Listen on Apple Music
          </a>
        </div>
        <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-inter)] mt-4">
          Tracks also available on TikTok &amp; Instagram — use them in your posts
        </p>
      </div>

      {/* Glow accent */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 rounded-full opacity-30 pointer-events-none"
        style={{ background: "#e63030", filter: "blur(24px)" }}
      />
    </div>
  );
}

function SpotifyPlaceholder() {
  return (
    <div
      className="rounded-2xl border border-[#1DB954]/30 bg-[#1a1a1a] p-8 flex flex-col items-center justify-center gap-4 min-h-[200px]"
      style={{ background: "rgba(29,185,84,0.03)" }}
    >
      <div className="w-14 h-14 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
        <span className="text-2xl">🎵</span>
      </div>
      <div className="text-center">
        <p
          className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#1DB954]/80 text-lg"
        >
          Playlist Dropping Monday
        </p>
        <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)] mt-1">
          Check back June 30 — full Spotify embed coming live
        </p>
      </div>
    </div>
  );
}

export default function MusicHub() {
  const { spotifyPlaylistEmbedUrl, featuredAlbum } = musicConfig;
  const hasPlaylist = Boolean(spotifyPlaylistEmbedUrl);
  const hasAlbumEmbed = Boolean(featuredAlbum.spotifyEmbedUrl);

  return (
    <section id="music" className="gp-section" style={{ backgroundColor: "#0d0d0d" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="The Soundtrack"
          title="Music"
          subtitle="Pasta on the track. Stream the album, take the dining playlist home."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Album drop card */}
          <AlbumDropCard />

          {/* Embeds column */}
          <div className="flex flex-col gap-8">
            {hasAlbumEmbed && (
              <iframe
                src={featuredAlbum.spotifyEmbedUrl}
                width="100%"
                height="352"
                style={{ borderRadius: "12px" }}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            )}

            {hasPlaylist && (
              <div>
                <div className="mb-3">
                  <p className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5]/80 text-lg">
                    The Dining Playlist
                  </p>
                  <p className="text-[#f5f5f5]/40 text-sm font-[family-name:var(--font-inter)] mt-1">
                    What&apos;s playing in the restaurant every night. Take it home.
                  </p>
                </div>
                <iframe
                  src={spotifyPlaylistEmbedUrl}
                  width="100%"
                  height="352"
                  style={{ borderRadius: "12px" }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
