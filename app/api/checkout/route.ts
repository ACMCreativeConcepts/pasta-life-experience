import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import artConfig from "@/config/art.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as Stripe.LatestApiVersion,
});

interface CatalogArtwork {
  id: string;
  title: string;
  price?: number;
  available: boolean;
  stripeProductId?: string;
}

// Server-side price lookup. The client only tells us WHICH product —
// price and title always come from our own config.
function findArtwork(productId: string): CatalogArtwork | undefined {
  for (const artist of artConfig.artists) {
    for (const artwork of artist.artworks as CatalogArtwork[]) {
      if (artwork.stripeProductId === productId) return artwork;
    }
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const artwork = findArtwork(productId);

    if (!artwork) {
      return NextResponse.json(
        { error: "Unknown product" },
        { status: 404 }
      );
    }

    if (!artwork.available || !artwork.price || artwork.price <= 0) {
      return NextResponse.json(
        { error: "This piece is no longer available" },
        { status: 409 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[Checkout API] STRIPE_SECRET_KEY not set");
      return NextResponse.json(
        { error: "Checkout is not configured. Contact support." },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://pastalifeexperience.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: artwork.title,
              metadata: { productId },
            },
            unit_amount: Math.round(artwork.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Query params must come BEFORE the hash fragment to be readable.
      success_url: `${baseUrl}/?checkout=success&piece=${encodeURIComponent(artwork.title)}#art`,
      cancel_url: `${baseUrl}/?checkout=canceled#art`,
      metadata: {
        productId,
        title: artwork.title,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Checkout API] Stripe error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout session creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
