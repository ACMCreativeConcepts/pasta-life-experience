"use client";

import { useState, useEffect, useCallback } from "react";
import SectionHeader from "@/components/SectionHeader";

interface Comic {
  id: string;
  title: string;
  coverImage: string;
  comicImage: string;
}

const comics: Comic[] = [
  {
    id: "bucatini",
    title: "Bucatini — Hallow Inside",
    coverImage: "/images/svaya/_Bucatini/_Bucatini_Hallow Inside_Cover.jpg",
    comicImage: "/images/svaya/_Bucatini/_Bucatini_Hallow Inside_P1.jpg",
  },
  {
    id: "eatmorpazta",
    title: "Eat More Pazta",
    coverImage: "/images/svaya/_Eat Mor Pazta/PastaLife_Eat More Pazta_Cover_P1.jpg",
    comicImage: "/images/svaya/_Eat Mor Pazta/PastaLife_Eat More Pazta_P2.jpg",
  },
  {
    id: "farfalle",
    title: "Farfalle — Bowtie Anonymous",
    coverImage: "/images/svaya/_Farfalle/_Farfalle Bowtie Anonymous_Bowtie_Cover_P1.jpg",
    comicImage: "/images/svaya/_Farfalle/_Farfalle Bowtie Anonymous_Bowtie_P2.jpg",
  },
];

interface LightboxState {
  src: string;
  title: string;
}

function Lightbox({
  state,
  onClose,
}: {
  state: LightboxState;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    // Lock page scroll while reading
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={state.title}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-[#f5f5f5] text-xl leading-none hover:bg-[#e63030] hover:border-[#e63030] transition-colors"
        aria-label="Close reader"
      >
        ×
      </button>
      <img
        src={state.src}
        alt={state.title}
        className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="mt-4 text-[#f5f5f5]/70 text-sm font-[family-name:var(--font-oswald)] uppercase tracking-wider">
        {state.title}
      </p>
    </div>
  );
}

function ComicCard({
  comic,
  onOpen,
}: {
  comic: Comic;
  onOpen: (s: LightboxState) => void;
}) {
  return (
    <div className="flex flex-col gap-4 mb-12">
      <h3 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-lg">
        {comic.title}
      </h3>

      {/* Cover + strip at natural aspect ratio — tap to read full-screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {[
          { src: comic.coverImage, label: `${comic.title} — Cover` },
          { src: comic.comicImage, label: comic.title },
        ].map(({ src, label }) => (
          <button
            key={src}
            onClick={() => onOpen({ src, title: label })}
            className="group rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] cursor-zoom-in text-left transition-all duration-300 hover:border-[#ff6b1a]/60"
            aria-label={`Read ${label} full screen`}
          >
            <img
              src={src}
              alt={label}
              loading="lazy"
              className="w-full h-auto block group-hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>
      <p className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-inter)] -mt-1">
        Tap a panel to read it full screen.
      </p>
    </div>
  );
}

export default function ComicsSection() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <section id="comics" className="gp-section" style={{ backgroundColor: "#0f0f0f" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="The Pasta-Verse"
          title="Pasta Life Comics"
          subtitle="Weekly comic strips by Svaya. New comics drop every Sunday."
        />

        <div className="flex flex-col">
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} onOpen={setLightbox} />
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-4 rounded-2xl border border-[#ff6b1a]/20 bg-[#1a1a1a] p-6 text-center">
          <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#ff6b1a] font-bold mb-2">
            New Comics Every Sunday
          </p>
          <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)]">
            Keep checking back for new Pasta Life comic strips. Follow Svaya&apos;s
            journey as she continues to bring the Graffiti Pasta universe to life.
          </p>
        </div>
      </div>

      {lightbox && <Lightbox state={lightbox} onClose={closeLightbox} />}

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
