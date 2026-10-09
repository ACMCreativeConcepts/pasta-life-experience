import videoConfig from "@/config/videos.json";
import SectionHeader from "@/components/SectionHeader";

function ComingSoonPlaceholder() {
  return (
    <div
      className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-10 flex flex-col items-center justify-center gap-5 min-h-[280px] text-center"
    >
      {/* Play button icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#ff6b1a]/50"
        style={{ background: "rgba(255, 107, 26, 0.08)" }}
      >
        <span className="text-4xl ml-1">▶</span>
      </div>

      <div>
        <p
          className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-xl mb-2"
        >
          🎬 Videos Dropping Soon
        </p>
        <p className="text-[#f5f5f5]/50 font-[family-name:var(--font-inter)] text-sm leading-relaxed max-w-xs mx-auto">
          Music videos. Pasta cooking classes. Behind the scenes. Subscribe so
          you don&apos;t miss the drop.
        </p>
      </div>

      {/* Subscribe CTA */}
      {videoConfig.youtubeChannelUrl ? (
        <a
          href={videoConfig.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
        >
          Subscribe on YouTube
        </a>
      ) : (
        <div
          className="flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm border border-[#2a2a2a] text-[#f5f5f5]/40 cursor-default"
        >
          YouTube Channel — Coming Soon
        </div>
      )}

      {/* Category teasers */}
      <div className="flex gap-3 mt-2">
        <span className="px-3 py-1.5 rounded-full bg-[#2a2a2a] text-[#f5f5f5]/60 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide">
          🎵 Music Videos
        </span>
        <span className="px-3 py-1.5 rounded-full bg-[#2a2a2a] text-[#f5f5f5]/60 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide">
          🍝 Cooking Classes
        </span>
      </div>
    </div>
  );
}

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  category: "music" | "cooking";
  description?: string;
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a]">
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ border: "none" }}
        />
      </div>
      <div className="p-4">
        <span
          className="text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: video.category === "music" ? "rgba(230,48,48,0.2)" : "rgba(255,215,0,0.2)",
            color: video.category === "music" ? "#e63030" : "#ffd700",
          }}
        >
          {video.category === "music" ? "🎵 Music Video" : "🍝 Cooking Class"}
        </span>
        <p className="mt-2 font-[family-name:var(--font-oswald)] font-bold uppercase text-[#f5f5f5] text-base tracking-wide">
          {video.title}
        </p>
        {video.description && (
          <p className="mt-1 text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-inter)]">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

function ChannelPromoCTA({ channelUrl }: { channelUrl: string }) {
  return (
    <div
      className="mt-8 rounded-2xl border border-[#ff6b1a]/30 p-8 text-center"
      style={{ background: "rgba(255, 107, 26, 0.05)" }}
    >
      <p className="text-[#f5f5f5]/70 font-[family-name:var(--font-inter)] text-sm mb-4">
        More content dropping regularly. Subscribe so you don’t miss it.
      </p>
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-sm text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
      >
        Visit YouTube Channel
      </a>
    </div>
  );
}

export default function VideoHub() {
  const { youtubeChannelUrl, videos } = videoConfig as { youtubeChannelUrl: string; videos: Video[] };
  const hasVideos = videos.length > 0;

  return (
    <section id="videos" className="gp-section" style={{ backgroundColor: "#0f0f0f" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="On Screen"
          title="Watch"
          subtitle="Music videos & pasta cooking classes."
        />

        {hasVideos ? (
          <>
            <div className="flex flex-col gap-6">
              {/* Music Videos */}
              {videos.filter((v) => v.category === "music").length > 0 && (
                <div>
                  <h3 className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#e63030] mb-3 text-sm font-bold">
                    Music Videos
                  </h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {videos
                      .filter((v) => v.category === "music")
                      .map((v) => (
                        <VideoCard key={v.id} video={v} />
                      ))}
                  </div>
                </div>
              )}

              {/* Cooking Classes */}
              {videos.filter((v) => v.category === "cooking").length > 0 && (
                <div>
                  <h3 className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#ffd700] mb-3 text-sm font-bold">
                    Pasta Cooking Classes
                  </h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {videos
                      .filter((v) => v.category === "cooking")
                      .map((v) => (
                        <VideoCard key={v.id} video={v} />
                      ))}
                  </div>
                </div>
              )}
            </div>
            {youtubeChannelUrl && <ChannelPromoCTA channelUrl={youtubeChannelUrl} />}
          </>
        ) : (
          <ComingSoonPlaceholder />
        )}
      </div>

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
