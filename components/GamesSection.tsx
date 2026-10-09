import SectionHeader from "@/components/SectionHeader";

interface Game {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const upcomingGames: Game[] = [
  {
    emoji: "🍝",
    title: "Build Your Own Pasta Bowl",
    description: "Drag & drop your dream bowl. Share it. Eat it (maybe).",
    color: "#ff6b1a",
  },
  {
    emoji: "🍹",
    title: "Tony Negroni — Bartender Mode",
    description: "Mix cocktails under pressure. Don't spill.",
    color: "#e63030",
  },
  {
    emoji: "🏃",
    title: "Tortellini Kitchen Runner",
    description: "Infinite runner. Dodge the bad pasta. Collect the good stuff.",
    color: "#ffd700",
  },
  {
    emoji: "🖌️",
    title: "Graffiti Wall Art Maker",
    description: "Design your own GP tag. Show off in the gallery.",
    color: "#ff6b1a",
  },
  {
    emoji: "📱",
    title: "QR Scavenger Hunt",
    description: "Hidden QR codes around the restaurant. Find them all. Win stuff.",
    color: "#ffd700",
  },
];

function GameCard({ game }: { game: Game }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Locked overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span
          className="text-[10px] font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(42,42,42,0.9)", color: "#f5f5f5", border: "1px solid #3a3a3a" }}
        >
          🔒 Coming Soon
        </span>
      </div>

      {/* Game icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{ background: `${game.color}15`, border: `1px solid ${game.color}30` }}
      >
        {game.emoji}
      </div>

      {/* Info */}
      <div>
        <h3
          className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-[#f5f5f5] text-base leading-tight mb-1"
        >
          {game.title}
        </h3>
        <p className="text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-inter)] leading-relaxed">
          {game.description}
        </p>
      </div>

      {/* Locked button */}
      <div
        className="mt-auto py-2 px-4 rounded-full text-center font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider text-xs border border-[#2a2a2a] text-[#f5f5f5]/30 cursor-not-allowed select-none"
      >
        Loading...
      </div>

      {/* Color glow */}
      <div
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none opacity-20"
        style={{ background: game.color, filter: "blur(20px)" }}
      />
    </div>
  );
}

function PlayableGameCard() {
  return (
    <a
      href="/games/tictactoe"
      className="relative overflow-hidden rounded-2xl border-2 bg-[#1a1a1a] p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{ borderColor: "#ffd700" }}
    >
      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span
          className="text-[10px] font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255, 215, 0, 0.3)", color: "#ffd700", border: "1px solid #ffd700" }}
        >
          ✨ LIVE
        </span>
      </div>

      {/* Logo - Prominently Featured */}
      <div className="flex justify-center items-center my-4">
        <img
          src="/images/game-assets/tictac-pasta-logo.png"
          alt="Tic-Tac-Pasta"
          className="w-full max-w-2xl h-auto object-contain"
          style={{
            filter: 'drop-shadow(0 6px 16px rgba(255, 215, 0, 0.4))',
            maxHeight: '280px',
          }}
        />
      </div>

      {/* Description */}
      <div>
        <p className="text-[#f5f5f5]/70 text-sm font-[family-name:var(--font-inter)] leading-relaxed text-center mb-4">
          A classic game with a pasta twist. Bowtie vs. Ravioli. Challenge the AI or play with a friend.
        </p>
      </div>

      {/* Play button */}
      <button
        className="mt-auto py-3 px-6 rounded-full text-center font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border-2 border-[#ffd700] text-[#ffd700] group-hover:bg-[#ffd700] group-hover:text-[#0d0d0d] transition-all"
      >
        Play Now →
      </button>

      {/* Color glow */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: "#ffd700", filter: "blur(30px)" }}
      />
    </a>
  );
}

function TriviaGameCard() {
  return (
    <a
      href="/games/trivia"
      className="relative overflow-hidden rounded-2xl border-2 bg-[#1a1a1a] p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{ borderColor: "#e63030" }}
    >
      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span
          className="text-[10px] font-[family-name:var(--font-oswald)] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(230, 48, 48, 0.25)", color: "#e63030", border: "1px solid #e63030" }}
        >
          ✨ LIVE
        </span>
      </div>

      {/* Title treatment */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
        <span className="text-5xl mb-3">🧠</span>
        <p
          className="font-[family-name:var(--font-oswald)] font-bold uppercase leading-tight"
          style={{
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            background: "linear-gradient(135deg, #e63030, #ff6b1a, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Pasta Trivia
        </p>
      </div>

      {/* Description */}
      <p className="text-[#f5f5f5]/70 text-sm font-[family-name:var(--font-inter)] leading-relaxed text-center mb-4">
        10 questions. Pasta facts and GP deep cuts. How much do you actually
        know? Prove it.
      </p>

      {/* Play button */}
      <span className="mt-auto py-3 px-6 rounded-full text-center font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border-2 border-[#e63030] text-[#e63030] group-hover:bg-[#e63030] group-hover:text-white transition-all">
        Play Now →
      </span>

      {/* Color glow */}
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: "#e63030", filter: "blur(30px)" }}
      />
    </a>
  );
}

export default function GamesSection() {
  return (
    <section id="games" className="gp-section" style={{ backgroundColor: "#0f0f0f" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          center
          eyebrow="The Arcade"
          title="Games"
          subtitle="The Pasta Life Arcade is open. Two games live, more incoming."
        />

        {/* Live games — Featured */}
        <div className="mb-8 max-w-4xl mx-auto">
          <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest mb-3">
            ▶ NOW PLAYING
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch">
            <PlayableGameCard />
            <TriviaGameCard />
          </div>
        </div>

        {/* Game cards grid */}
        <div>
          <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest mb-3">
            COMING SOON
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingGames.map((game) => (
              <GameCard key={game.title} game={game} />
            ))}
          </div>
        </div>

        {/* Coming soon note */}
        <div className="mt-8 text-center">
          <p className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-inter)]">
            Earn GPC rewards by playing. Stay tuned.
          </p>
        </div>
      </div>

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
