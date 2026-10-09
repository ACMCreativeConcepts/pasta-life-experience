import Image from "next/image";
import merchConfig from "@/config/merch.json";
import SectionHeader from "@/components/SectionHeader";

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  buyUrl: string;
  available: boolean;
  inhouse?: boolean;
}

function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div
      className="w-full aspect-square flex flex-col items-center justify-center bg-[#2a2a2a] rounded-t-xl"
    >
      <span className="text-4xl mb-2">🍝</span>
      <span className="text-[#f5f5f5]/30 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide text-center px-4">
        {title}
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const notifyHref = `mailto:acmcreativeconcepts@gmail.com?subject=GP Merch Notify Me — ${encodeURIComponent(product.title)}&body=I'd like to be notified when ${encodeURIComponent(product.title)} is available.`;

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
    >
      {/* Image */}
      {product.image && product.image !== "/merch/gp-tee.jpg" ? (
        <div className="w-full aspect-square overflow-hidden bg-[#1a1a1a] relative">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      ) : (
        <ImagePlaceholder title={product.title} />
      )}

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-[#f5f5f5] text-base leading-tight"
          >
            {product.title}
          </h3>
          <span
            className="font-[family-name:var(--font-oswald)] font-bold text-[#ffd700] text-base shrink-0"
          >
            {product.price}
          </span>
        </div>

        <p className="text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-inter)] leading-relaxed flex-1 mb-4">
          {product.description}
        </p>

        {!product.available && (
          <span
            className="inline-block mb-2 text-[10px] font-[family-name:var(--font-oswald)] uppercase tracking-widest px-2 py-0.5 rounded-full self-start"
            style={{ background: "rgba(255,215,0,0.15)", color: "#ffd700" }}
          >
            Coming Soon
          </span>
        )}

        {product.inhouse ? (
          <span
            className="block text-center py-2.5 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a] text-[#ff6b1a] cursor-default"
          >
            Ask at the Bar
          </span>
        ) : product.available ? (
          <a
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2.5 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
          >
            Shop Now
          </a>
        ) : (
          <a
            href={notifyHref}
            className="block text-center py-2.5 px-4 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/50 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
          >
            Notify Me
          </a>
        )}
      </div>
    </div>
  );
}

export default function MerchSection() {
  const { products, shopUrl } = merchConfig as { shopUrl: string; products: Product[] };

  return (
    <section id="merch" className="gp-section" style={{ backgroundColor: "#0d0d0d" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Wear the Sauce"
            title="Merch"
            subtitle="One-of-a-kind hats, hand-painted and airbrushed by Artist Till Death. Grab yours in house — just ask your bartender."
          />
          {shopUrl && (
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#ff6b1a] hover:underline shrink-0 mb-10"
            >
              Full Store →
            </a>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* All unavailable notice */}
        {products.every((p) => !p.available) && (
          <div
            className="mt-6 rounded-xl border border-[#ffd700]/20 bg-[#1a1a1a] p-5 text-center"
          >
            <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#ffd700]/80 font-bold mb-1">
              🔥 Store launching soon
            </p>
            <p className="text-[#f5f5f5]/50 text-sm font-[family-name:var(--font-inter)]">
              Hit &ldquo;Notify Me&rdquo; on any item — we&apos;ll email when it&apos;s live.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }} />
    </section>
  );
}
