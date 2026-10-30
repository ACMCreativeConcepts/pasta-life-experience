"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type ComicEntry } from "@/lib/comics";
import { formatComicDate } from "@/lib/dates";

/** All panels of a strip, in reading order. */
function panelsOf(comic: ComicEntry): string[] {
  return comic.images?.length ? comic.images : [comic.image];
}

/**
 * One strip at a time, big, on paper — Far Side rules. Multi-panel strips
 * stack their panels top-to-bottom on the same sheet.
 *
 * Navigation reads like flipping a daily calendar: you start on this week's
 * strip and each flip to the RIGHT goes one strip further back — the same
 * direction as the archive row and the page counter. Left brings you back
 * toward this week.
 */
export default function ComicReader({ comics }: { comics: ComicEntry[] }) {
  // Index 0 is the newest strip
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);

  const comic = comics[idx];
  const hasOlder = idx < comics.length - 1;
  const hasNewer = idx > 0;

  const older = useCallback(
    () => setIdx((i) => Math.min(i + 1, comics.length - 1)),
    [comics.length]
  );
  const newer = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Right = continue back through the archive; left = toward this week
      if (e.key === "ArrowRight") older();
      if (e.key === "ArrowLeft") newer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [older, newer]);

  // Preload the neighboring strips so flipping feels instant
  useEffect(() => {
    [comics[idx - 1], comics[idx + 1]].forEach((c) => {
      if (c) {
        panelsOf(c).forEach((src) => {
          const img = new window.Image();
          img.src = src;
        });
      }
    });
  }, [idx, comics]);

  if (!comic) return null;

  return (
    <div>
      {/* The paper */}
      <div
        className="relative mx-auto max-w-2xl rounded-sm px-4 pt-4 pb-6 sm:px-8 sm:pt-8"
        style={{
          background: "#f7f2e5",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.6)",
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 50) return;
          // Swipe left = flip right = further back; swipe right = toward this week
          if (dx < 0) older();
          else newer();
        }}
      >
        {/* Panels, full width, in reading order */}
        <div className="flex flex-col gap-4">
          {panelsOf(comic).map((src, i) => (
            <img
              key={`${comic.id}-${i}`}
              src={src}
              alt={
                panelsOf(comic).length > 1
                  ? `${comic.title} — panel ${i + 1}`
                  : comic.title
              }
              className="w-full h-auto block"
            />
          ))}
        </div>

        {/* Syndication line */}
        <div className="mt-5 text-center border-t pt-4" style={{ borderColor: "#d8cfb8" }}>
          <p
            className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-lg"
            style={{ color: "#1c1a14" }}
          >
            {comic.title}
          </p>
          <p
            className="text-xs font-[family-name:var(--font-inter)] mt-1"
            style={{ color: "#6b6454" }}
          >
            Pasta Life Comics by Anthony Morel | Illustrations by Svaya &middot; {formatComicDate(comic.date)}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={newer}
          disabled={!hasNewer}
          aria-label="Newer comic (toward this week)"
          className="w-12 h-12 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-[#f5f5f5] text-xl leading-none transition-colors enabled:hover:bg-[#e63030] enabled:hover:border-[#e63030] disabled:opacity-25"
        >
          ←
        </button>
        <span className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest min-w-24 text-center">
          {idx === 0 ? "This Week" : `${idx + 1} of ${comics.length}`}
        </span>
        <button
          onClick={older}
          disabled={!hasOlder}
          aria-label="Older comic (back through the archive)"
          className="w-12 h-12 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-[#f5f5f5] text-xl leading-none transition-colors enabled:hover:bg-[#e63030] enabled:hover:border-[#e63030] disabled:opacity-25"
        >
          →
        </button>
      </div>
      <p className="text-center text-[#f5f5f5]/25 text-[11px] font-[family-name:var(--font-inter)] mt-2">
        Swipe or use ← → keys &middot; → flips back through the archive
      </p>

      {/* Archive */}
      <div className="mt-12">
        <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest mb-4 text-center">
          The Archive
        </p>
        <div className="flex gap-3 justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 px-1">
          {comics.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setIdx(i)}
              aria-label={`${c.title} — ${formatComicDate(c.date)}`}
              className="shrink-0 w-24 text-left group"
            >
              <div
                className="w-24 h-24 rounded-md overflow-hidden border transition-all"
                style={{
                  borderColor: i === idx ? "#ff6b1a" : "#2a2a2a",
                  borderWidth: i === idx ? 2 : 1,
                  background: "#f7f2e5",
                }}
              >
                <img
                  src={c.thumb || c.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
              <p
                className="mt-1.5 text-[10px] font-[family-name:var(--font-inter)] leading-tight truncate"
                style={{ color: i === idx ? "#ff6b1a" : "rgba(245,245,245,0.4)" }}
              >
                {c.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
