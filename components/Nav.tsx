"use client";

import { useState, useEffect } from "react";

// Order matches the page's section order top-to-bottom
const navLinks = [
  { label: "Listen", href: "#music" },
  { label: "Games", href: "#games" },
  { label: "Shop", href: "#merch" },
  { label: "Art", href: "#art" },
  { label: "Comics", href: "#comics" },
  { label: "Watch", href: "#videos" },
  { label: "Rewards", href: "#rewards" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2a2a2a] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#top"
          className="font-[family-name:var(--font-oswald)] text-lg font-bold tracking-widest uppercase text-[#ffd700] hover:text-[#ff6b1a] transition-colors"
        >
          GP
        </a>

        {/* Nav pills — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[calc(100vw-80px)] pb-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wider border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#e63030] hover:border-[#e63030] hover:text-white transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
