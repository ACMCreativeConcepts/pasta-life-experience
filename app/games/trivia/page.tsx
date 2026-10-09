"use client";

import { useState, useMemo } from "react";

interface Question {
  q: string;
  options: string[];
  answer: number; // index into options
  fact: string;
  category: "Pasta 101" | "GP Deep Cuts";
}

const QUESTION_POOL: Question[] = [
  {
    q: "“Al dente” literally means…",
    options: ["To the tooth", "Until soft", "Little bite", "To the pot"],
    answer: 0,
    fact: "Perfectly cooked pasta still has a slight bite to it.",
    category: "Pasta 101",
  },
  {
    q: "“Farfalle” — the bowtie pasta — actually means…",
    options: ["Bowties", "Butterflies", "Little wings", "Ribbons"],
    answer: 1,
    fact: "The bowtie is the nickname. In Italian, farfalle are butterflies.",
    category: "Pasta 101",
  },
  {
    q: "What makes bucatini different from spaghetti?",
    options: [
      "It's flat",
      "It's shorter",
      "It's hollow in the middle",
      "It's made with eggs",
    ],
    answer: 2,
    fact: "“Buco” means hole — bucatini is a straw you can slurp sauce through.",
    category: "Pasta 101",
  },
  {
    q: "“Vermicelli” translates to…",
    options: ["Little worms", "Thin strings", "Baby snakes", "Fine hairs"],
    answer: 0,
    fact: "Appetizing, right? It literally means “little worms.”",
    category: "Pasta 101",
  },
  {
    q: "Orecchiette means…",
    options: ["Little oranges", "Little ears", "Little bowls", "Little hats"],
    answer: 1,
    fact: "The little cups are shaped like tiny ears — perfect for catching sauce.",
    category: "Pasta 101",
  },
  {
    q: "The traditional pork in a real Roman carbonara is…",
    options: ["Bacon", "Pancetta", "Prosciutto", "Guanciale"],
    answer: 3,
    fact: "Guanciale — cured pork jowl. No cream in the real thing, either.",
    category: "Pasta 101",
  },
  {
    q: "Cacio e pepe is just pasta plus…",
    options: [
      "Cheese and pepper",
      "Butter and garlic",
      "Tomato and basil",
      "Oil and chili",
    ],
    answer: 0,
    fact: "Pecorino Romano + black pepper + pasta water = magic.",
    category: "Pasta 101",
  },
  {
    q: "Classic dried pasta is made from…",
    options: [
      "All-purpose flour",
      "Durum wheat semolina",
      "Rice flour",
      "Cornmeal",
    ],
    answer: 1,
    fact: "Durum semolina gives dried pasta its bite and golden color.",
    category: "Pasta 101",
  },
  {
    q: "“Linguine” translates to…",
    options: ["Little lines", "Long strings", "Little tongues", "Flat noodles"],
    answer: 2,
    fact: "Lingua = tongue. Linguine are “little tongues.”",
    category: "Pasta 101",
  },
  {
    q: "Penne gets its name from…",
    options: ["A quill pen", "A pipe", "A pencil", "A flute"],
    answer: 0,
    fact: "The angled cut looks like the tip of an old quill pen.",
    category: "Pasta 101",
  },
  {
    q: "On a menu, “rigate” means the pasta is…",
    options: ["Ridged", "Rolled", "Stuffed", "Twisted"],
    answer: 0,
    fact: "Ridges grip sauce. Team rigate all day.",
    category: "Pasta 101",
  },
  {
    q: "Classic gnocchi are mostly made of…",
    options: ["Semolina", "Ricotta", "Potato", "Breadcrumbs"],
    answer: 2,
    fact: "Little potato pillows. Light hands make light gnocchi.",
    category: "Pasta 101",
  },
  {
    q: "Capellini is better known as…",
    options: ["Angel hair", "Baby spaghetti", "Silk pasta", "Feather pasta"],
    answer: 0,
    fact: "Capelli = hair. The finest strand in the pasta game.",
    category: "Pasta 101",
  },
  {
    q: "Black pasta gets its color from…",
    options: ["Black garlic", "Charcoal", "Squid ink", "Black beans"],
    answer: 2,
    fact: "Squid (or cuttlefish) ink — briny, savory, and jet black.",
    category: "Pasta 101",
  },
  {
    q: "Tortellini come from the region around…",
    options: ["Sicily", "Bologna", "Venice", "Naples"],
    answer: 1,
    fact: "Emilia-Romagna — legend says they're shaped after Venus's navel.",
    category: "Pasta 101",
  },
  {
    q: "The word “pasta” literally means…",
    options: ["Noodle", "Wheat", "Paste or dough", "Meal"],
    answer: 2,
    fact: "Just flour and water (or eggs) — the world's greatest paste.",
    category: "Pasta 101",
  },
  {
    q: "Roughly how many pasta shapes does Italy have?",
    options: ["About 50", "About 120", "More than 300", "Exactly 99"],
    answer: 2,
    fact: "Over 300 shapes — and most have at least two names.",
    category: "Pasta 101",
  },
  {
    q: "Where does Graffiti Pasta live?",
    options: [
      "Deep Ellum, Dallas",
      "On the Square in Denton, TX",
      "Fort Worth Stockyards",
      "Austin, TX",
    ],
    answer: 1,
    fact: "118 W Oak St, right on the Denton Square. Come get saucy.",
    category: "GP Deep Cuts",
  },
  {
    q: "Who tagged the murals inside Graffiti Pasta Denton?",
    options: ["Svaya", "Banksy", "DETOX", "Artist Till Death"],
    answer: 2,
    fact: "DETOX (Jerod Davies) — from the kitchen mural to the basement.",
    category: "GP Deep Cuts",
  },
  {
    q: "The one-of-a-kind hand-painted hats at GP are made by…",
    options: ["DETOX", "Artist Till Death", "Svaya", "The kitchen crew"],
    answer: 1,
    fact: "Artist Till Death airbrushes every hat. Ask your bartender.",
    category: "GP Deep Cuts",
  },
  {
    q: "Who draws the weekly Pasta Life comic strips?",
    options: ["Svaya", "DETOX", "Tony Negroni", "Gabriel"],
    answer: 0,
    fact: "Svaya — artist, server, and bartender at GP Denton.",
    category: "GP Deep Cuts",
  },
  {
    q: "The house band behind the Pasta Life album is…",
    options: [
      "The Bucatinis",
      "theGraffiti Pastas",
      "Tony & the Negronis",
      "Pasta Life Collective",
    ],
    answer: 1,
    fact: "theGraffiti Pastas — streaming everywhere right now.",
    category: "GP Deep Cuts",
  },
  {
    q: "Tic-Tac-Pasta is a battle between…",
    options: [
      "Penne vs. Rigatoni",
      "Spaghetti vs. Linguine",
      "Bowtie vs. Ravioli",
      "Gnocchi vs. Tortellini",
    ],
    answer: 2,
    fact: "Bowtie vs. Ravioli. Play it in the Pasta Life Arcade.",
    category: "GP Deep Cuts",
  },
  {
    q: "GPC stands for…",
    options: [
      "Graffiti Pasta Coin",
      "Great Pasta Club",
      "Graffiti Pasta Crew",
      "Good Pasta Credit",
    ],
    answer: 0,
    fact: "Graffiti Pasta Coin — earn it, spend it on the good stuff. Coming soon.",
    category: "GP Deep Cuts",
  },
];

const ROUND_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): Question[] {
  // Shuffle each question's options too, re-pointing the answer index
  return shuffle(QUESTION_POOL)
    .slice(0, ROUND_SIZE)
    .map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return {
        ...q,
        options: order.map((i) => q.options[i]),
        answer: order.indexOf(q.answer),
      };
    });
}

function rankFor(score: number): { title: string; blurb: string } {
  if (score >= 9)
    return {
      title: "Graffiti Pasta Legend",
      blurb: "You basically live here. Show your server this screen.",
    };
  if (score >= 7)
    return {
      title: "Certified Pasta Head",
      blurb: "Serious noodle knowledge. We're impressed.",
    };
  if (score >= 4)
    return {
      title: "Sauce Apprentice",
      blurb: "Solid. A few more bowls and you're there.",
    };
  return {
    title: "Pasta Rookie",
    blurb: "Everyone starts somewhere. Order the ziti and study up.",
  };
}

type Screen = "menu" | "playing" | "done";

export default function TriviaPage() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [round, setRound] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const question = round[idx];
  const rank = useMemo(() => rankFor(score), [score]);

  const start = () => {
    setRound(buildRound());
    setIdx(0);
    setScore(0);
    setPicked(null);
    setScreen("playing");
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= round.length) {
      setScreen("done");
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 100%)" }}
    >
      <div className="w-full max-w-md text-center">
        {screen === "menu" && (
          <>
            <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-3">
              The Pasta Life Arcade
            </p>
            <h1
              className="font-[family-name:var(--font-oswald)] font-bold uppercase leading-tight mb-4"
              style={{
                fontSize: "clamp(2.2rem, 10vw, 3.5rem)",
                background: "linear-gradient(135deg, #e63030, #ff6b1a, #ffd700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pasta Trivia
            </h1>
            <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] mb-8 leading-relaxed">
              {ROUND_SIZE} questions. Pasta facts and Graffiti Pasta deep cuts.
              How much do you actually know?
            </p>
            <button
              onClick={start}
              className="w-full py-4 px-8 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-base text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              Start the Round
            </button>
            <a
              href="/#games"
              className="inline-block mt-8 text-[#ff6b1a] text-sm font-[family-name:var(--font-inter)] font-semibold hover:underline"
            >
              ← Back to Games
            </a>
          </>
        )}

        {screen === "playing" && question && (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between mb-2 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest text-[#f5f5f5]/50">
              <span>
                Q {idx + 1}/{round.length}
              </span>
              <span className="text-[#ffd700]">{question.category}</span>
              <span>Score {score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#2a2a2a] mb-8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((idx + (picked !== null ? 1 : 0)) / round.length) * 100}%`,
                  background: "linear-gradient(90deg, #e63030, #ff6b1a, #ffd700)",
                }}
              />
            </div>

            <h2 className="font-[family-name:var(--font-oswald)] font-bold text-[#f5f5f5] text-xl mb-6 leading-snug">
              {question.q}
            </h2>

            <div className="flex flex-col gap-3">
              {question.options.map((opt, i) => {
                const isAnswer = i === question.answer;
                const isPicked = i === picked;
                let style: React.CSSProperties = {
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#f5f5f5",
                };
                if (picked !== null && isAnswer) {
                  style = {
                    background: "rgba(29,185,84,0.15)",
                    border: "1px solid #1DB954",
                    color: "#1DB954",
                  };
                } else if (picked !== null && isPicked && !isAnswer) {
                  style = {
                    background: "rgba(230,48,48,0.15)",
                    border: "1px solid #e63030",
                    color: "#e63030",
                  };
                }
                return (
                  <button
                    key={opt}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className="py-3.5 px-5 rounded-xl text-left font-[family-name:var(--font-inter)] font-medium text-sm transition-all enabled:hover:border-[#ff6b1a] enabled:cursor-pointer"
                    style={style}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="mt-6">
                <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] leading-relaxed mb-4">
                  {picked === question.answer ? "✅ " : "❌ "}
                  {question.fact}
                </p>
                <button
                  onClick={next}
                  className="w-full py-3.5 px-8 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
                >
                  {idx + 1 >= round.length ? "See My Score" : "Next Question"}
                </button>
              </div>
            )}
          </>
        )}

        {screen === "done" && (
          <>
            <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-3">
              Final Score
            </p>
            <p
              className="font-[family-name:var(--font-oswald)] font-bold mb-2"
              style={{
                fontSize: "clamp(3.5rem, 18vw, 5.5rem)",
                background: "linear-gradient(135deg, #e63030, #ff6b1a, #ffd700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
              }}
            >
              {score}/{round.length}
            </p>
            <h2 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-2xl mb-2">
              {rank.title}
            </h2>
            <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] mb-8 leading-relaxed">
              {rank.blurb}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={start}
                className="w-full py-4 px-8 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-base text-white transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
              >
                Play Again
              </button>
              <a
                href="/#games"
                className="w-full py-3.5 px-8 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
              >
                Back to Games
              </a>
            </div>
            <p className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-inter)] mt-8">
              GPC rewards for trivia scores — coming soon.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
