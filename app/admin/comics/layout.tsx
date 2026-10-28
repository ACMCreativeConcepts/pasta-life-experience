import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Comic | Pasta Life Experience",
  robots: { index: false, follow: false },
};

export default function AdminComicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
