import { list } from "@vercel/blob";

export interface ComicEntry {
  id: string;
  title: string;
  /** Publish date, YYYY-MM-DD (comics drop on Sundays) */
  date: string;
  /** The strip itself */
  image: string;
  /** Optional archive thumbnail (defaults to the strip) */
  thumb?: string;
  /** Legacy entries live in the repo and can't be deleted from the admin page */
  legacy?: boolean;
}

export const MANIFEST_PATH = "comics/manifest.json";

// The original three strips, shipped with the site. Dates are the
// assumed drop Sundays — adjust here if they're off.
const legacyComics: ComicEntry[] = [
  {
    id: "legacy-farfalle",
    title: "Farfalle — Bowtie Anonymous",
    date: "2026-10-25",
    image: "/images/svaya/_Farfalle/_Farfalle Bowtie Anonymous_Bowtie_P2.jpg",
    thumb: "/images/svaya/_Farfalle/_Farfalle Bowtie Anonymous_Bowtie_Cover_P1.jpg",
    legacy: true,
  },
  {
    id: "legacy-eatmorpazta",
    title: "Eat More Pazta",
    date: "2026-10-18",
    image: "/images/svaya/_Eat Mor Pazta/PastaLife_Eat More Pazta_P2.jpg",
    thumb: "/images/svaya/_Eat Mor Pazta/PastaLife_Eat More Pazta_Cover_P1.jpg",
    legacy: true,
  },
  {
    id: "legacy-bucatini",
    title: "Bucatini — Hallow Inside",
    date: "2026-10-11",
    image: "/images/svaya/_Bucatini/_Bucatini_Hallow Inside_P1.jpg",
    thumb: "/images/svaya/_Bucatini/_Bucatini_Hallow Inside_Cover.jpg",
    legacy: true,
  },
];

export async function getManifest(): Promise<ComicEntry[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATH });
    const manifest = blobs.find((b) => b.pathname === MANIFEST_PATH);
    if (!manifest) return [];
    const res = await fetch(manifest.url, { cache: "no-store" });
    if (!res.ok) return [];
    const entries = (await res.json()) as ComicEntry[];
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.error("[comics] Failed to read manifest:", error);
    return [];
  }
}

/** All comics, uploaded + legacy, newest first. */
export async function getComics(): Promise<ComicEntry[]> {
  const uploaded = await getManifest();
  return [...uploaded, ...legacyComics].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );
}

export function formatComicDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
