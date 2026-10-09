import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pastalifeexperience.com"),
  title: "Pasta Life Experience | Graffiti Pasta",
  description:
    "A full Pasta-verse with music, art, merch & more.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Pasta Life Experience",
    description: "Music. Art. Merch. Rewards. Games. All things Graffiti Pasta.",
    siteName: "Graffiti Pasta",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Pasta Life Experience",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasta Life Experience | Graffiti Pasta",
    description: "A full Pasta-verse with music, art, merch & more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full antialiased" style={{ backgroundColor: "#0d0d0d", color: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
