"use client";

import { useState, useEffect } from "react";
import artConfig from "@/config/art.json"; // Note: Image import removed; using native img for simplicity

interface Artwork {
  id: string;
  title: string;
  price?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  image: string;
  available: boolean;
  stripeProductId?: string;
  inhouse?: boolean;
  storeLink?: string;
  internalLink?: string;
  buttonText?: string;
}

interface Artist {
  id: string;
  name: string;
  intro?: string;
  bio: string;
  website: string | null;
  instagram: string | null;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  ctaText?: string;
  noExternalLinks?: boolean;
  artworks: Artwork[];
}

function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePurchase = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Server looks up price + title by product ID — never trust the client
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: artwork.stripeProductId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
    >
      {/* Art image */}
      <div className="w-full aspect-square overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <>
            <span className="text-5xl mb-2">🎨</span>
            <span className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide text-center px-4">
              {artwork.title}
            </span>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-[#f5f5f5] text-base leading-tight mb-1">
          {artwork.title}
        </h3>
        {artwork.description ? (
          <p className="text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-inter)] mb-3 leading-relaxed flex-1">
            {artwork.description}
          </p>
        ) : (
          <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-inter)] mb-3">
            {artwork.medium} {artwork.dimensions && `• ${artwork.dimensions}`}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          {artwork.price && (
            <span className="font-[family-name:var(--font-oswald)] font-bold text-[#ffd700] text-lg">
              ${artwork.price}
            </span>
          )}
          {artwork.internalLink ? (
            <a
              href={artwork.internalLink}
              className="flex-1 text-center py-2 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              {artwork.buttonText || "View"}
            </a>
          ) : artwork.storeLink ? (
            <a
              href={artwork.storeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              {artwork.buttonText || "View Website"}
            </a>
          ) : artwork.inhouse ? (
            <span className="flex-1 text-center py-2 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a] text-[#ff6b1a] cursor-default">
              In-House
            </span>
          ) : artwork.available ? (
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="flex-1 text-center py-2 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              {isLoading ? "Loading..." : "Purchase"}
            </button>
          ) : (
            <span className="flex-1 text-center py-2 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#2a2a2a] text-[#f5f5f5]/30 cursor-default">
              Sold
            </span>
          )}
        </div>
        {errorMsg && (
          <p className="mt-2 text-[#e63030] text-xs font-[family-name:var(--font-inter)]">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

function CheckoutBanner() {
  const [status, setStatus] = useState<"success" | "canceled" | null>(null);
  const [piece, setPiece] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success" || checkout === "canceled") {
      setStatus(checkout);
      setPiece(params.get("piece"));
      // Clean the query string so a refresh doesn't re-show the banner
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  if (!status) return null;

  const isSuccess = status === "success";
  return (
    <div
      className="mb-8 rounded-2xl border p-5 text-center"
      style={{
        borderColor: isSuccess ? "rgba(29,185,84,0.5)" : "rgba(255,215,0,0.4)",
        background: isSuccess ? "rgba(29,185,84,0.08)" : "rgba(255,215,0,0.06)",
      }}
    >
      <p
        className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider mb-1"
        style={{ color: isSuccess ? "#1DB954" : "#ffd700" }}
      >
        {isSuccess ? "🎉 Payment received!" : "Checkout canceled"}
      </p>
      <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)]">
        {isSuccess
          ? `${piece ? `"${piece}" is yours. ` : ""}We'll reach out by email to arrange pickup at Graffiti Pasta Denton.`
          : "No charge was made. The art will be here when you're ready."}
      </p>
    </div>
  );
}

function GalleryPlaceholder({ galleryInfo }: { galleryInfo: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Mission statement */}
      <div
        className="rounded-2xl border border-[#ff6b1a]/30 bg-[#1a1a1a] p-6"
        style={{ boxShadow: "0 0 30px rgba(255, 107, 26, 0.08)" }}
      >
        <div className="text-4xl mb-4 text-center">🎨</div>
        <p
          className="text-center font-[family-name:var(--font-inter)] text-[#f5f5f5]/70 leading-relaxed text-sm"
        >
          {galleryInfo}
        </p>
      </div>

      {/* Coming soon cards */}
      <div
        className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-10 flex flex-col items-center justify-center gap-4 text-center"
      >
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["🖌️", "🖼️", "✏️", "🎭", "🖊️", "🎪"].map((emoji, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-2xl"
            >
              {emoji}
            </div>
          ))}
        </div>
        <p
          className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-xl"
        >
          Gallery Loading
        </p>
        <p className="text-[#f5f5f5]/50 font-[family-name:var(--font-inter)] text-sm max-w-xs leading-relaxed">
          Artists coming soon. Every piece sold supports the creator.
          100% goes to the artist.
        </p>
      </div>
    </div>
  );
}

function ArtistSection({ artist }: { artist: Artist }) {
  return (
    <div className="mb-12">
      {/* Artist Header */}
      <div className="mb-8">
        <h3 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-2xl mb-4">
          {artist.name}
        </h3>
        
        {/* Intro (if available) */}
        {artist.intro && (
          <p className="text-[#f5f5f5]/70 font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-4 border-l-2 border-[#ff6b1a] pl-4">
            {artist.intro}
          </p>
        )}
        
        {/* Bio */}
        <p className="text-[#f5f5f5]/60 font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-4">
          {artist.bio}
        </p>
        
        {/* Links + CTA */}
        {!artist.noExternalLinks && (
        <div className="flex flex-col gap-3">
          {artist.ctaText && (
            <p className="text-[#ff6b1a] font-[family-name:var(--font-oswald)] text-xs uppercase tracking-wider font-semibold">
              👉 {artist.ctaText}
            </p>
          )}
          {/* Social Media Links */}
          <div className="flex flex-wrap gap-3 items-center">
            {artist.instagram && (
              <a
                href={artist.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#ff6b1a] hover:text-[#ffd700] transition-colors text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide"
              >
                📱 Instagram
              </a>
            )}
            {artist.facebook && (
              <a
                href={artist.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#ff6b1a] hover:text-[#ffd700] transition-colors text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide"
              >
                👥 Facebook
              </a>
            )}
            {artist.youtube && (
              <a
                href={artist.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#ff6b1a] hover:text-[#ffd700] transition-colors text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide"
              >
                ▶️ YouTube
              </a>
            )}
            {artist.tiktok && (
              <a
                href={artist.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#ff6b1a] hover:text-[#ffd700] transition-colors text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide"
              >
                🎵 TikTok
              </a>
            )}
            {artist.website && (
              <a
                href={artist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#ff6b1a] hover:text-[#ffd700] transition-colors text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide"
              >
                🌐 Website
              </a>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {artist.artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {/* Footer note */}
      {!artist.noExternalLinks && (
        <p className="text-[#f5f5f5]/40 font-[family-name:var(--font-inter)] text-xs mt-6 italic">
          {artist.artworks[0]?.inhouse
            ? `Each design is one of a kind and hand-crafted. Available for purchase in-house at Graffiti Pasta Denton.`
            : artist.artworks[0]?.storeLink
            ? `Portfolio pieces available through ${artist.name}. Click to explore more.`
            : `All proceeds go directly to ${artist.name}. Pick up in-house at Graffiti Pasta Denton.`}
        </p>
      )}
      {artist.noExternalLinks && (
        <p className="text-[#f5f5f5]/40 font-[family-name:var(--font-inter)] text-xs mt-6 italic">
          Meet {artist.name} at Graffiti Pasta Denton. She's a server, bartender, and the creative force behind our stories.
        </p>
      )}
    </div>
  );
}

export default function ArtGallery() {
  const { artists, galleryInfo } = artConfig as {
    galleryInfo: string;
    contactEmail: string;
    artists: Artist[];
  };

  const hasArtists = artists && artists.length > 0;

  return (
    <section id="art" className="gp-section" style={{ backgroundColor: "#0f0f0f" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] mb-2"
            style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)" }}
          >
            🎨 Art Gallery
          </h2>
          <p className="text-[#f5f5f5]/50 font-[family-name:var(--font-inter)] text-sm">
            Local artists. 100% to the creator.
          </p>
        </div>

        <CheckoutBanner />

        {hasArtists ? (
          <>
            {/* Gallery mission */}
            <p className="text-[#f5f5f5]/60 font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-8 border-l-2 border-[#ff6b1a] pl-4">
              {galleryInfo}
            </p>
            {/* Artist sections */}
            {artists.map((artist) => (
              <ArtistSection key={artist.id} artist={artist} />
            ))}
          </>
        ) : (
          <GalleryPlaceholder galleryInfo={galleryInfo} />
        )}
      </div>

      <div className="mt-16 h-px max-w-2xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
