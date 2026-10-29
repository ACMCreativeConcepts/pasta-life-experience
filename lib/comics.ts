import { list, put } from "@vercel/blob";

export interface ComicEntry {
  id: string;
  title: string;
  /** Publish date as a plain YYYY-MM-DD calendar date */
  date: string;
  /** The strip itself */
  image: string;
  /** Optional archive thumbnail (defaults to the strip) */
  thumb?: string;
  /** When the entry was uploaded (ISO timestamp) */
  createdAt?: string;
  /** Legacy entries live in the repo and can't be deleted from the admin page */
  legacy?: boolean;
}

/** Thrown when the uploaded archive can't be read. Callers decide how loud to be. */
export class ComicsReadError extends Error {}

// Preview deployments share the production Blob store. Prefixing every
// preview-environment path keeps preview tests away from the live comics.
const ENV_PREFIX =
  process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
    ? `${process.env.VERCEL_ENV}/`
    : "";

/** Each uploaded comic is one immutable JSON blob under this prefix. */
export const ENTRY_PREFIX = `${ENV_PREFIX}comics/entries/`;
/** Uploaded strip images live here. */
export const STRIP_PREFIX = `${ENV_PREFIX}comics/strips/`;
/** The retired single-file manifest. Read once for migration, never written. */
export const MANIFEST_PATH = "comics/manifest.json";

export function entryPath(id: string): string {
  return `${ENTRY_PREFIX}${id}.json`;
}

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

export function getLegacyComics(): ComicEntry[] {
  return [...legacyComics];
}

export function sortComics(comics: ComicEntry[]): ComicEntry[] {
  return [...comics].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );
}

function parseEntry(raw: unknown): ComicEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  if (
    typeof e.id !== "string" ||
    typeof e.title !== "string" ||
    typeof e.date !== "string" ||
    typeof e.image !== "string"
  ) {
    return null;
  }
  const entry: ComicEntry = {
    id: e.id,
    title: e.title,
    date: e.date,
    image: e.image,
  };
  if (typeof e.thumb === "string") entry.thumb = e.thumb;
  if (typeof e.createdAt === "string") entry.createdAt = e.createdAt;
  return entry;
}

/** Writes one comic as its own immutable blob. Throws if it can't. */
export async function saveEntry(entry: ComicEntry): Promise<void> {
  await put(entryPath(entry.id), JSON.stringify(entry), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });
}

/**
 * All uploaded comics, read from the per-entry blobs (plus a one-time
 * migration of the retired manifest). Throws ComicsReadError on any read
 * failure — it never silently returns an empty archive, because a caller
 * that trusts an empty list could wipe real data on its next write.
 */
export async function getUploadedComics(): Promise<ComicEntry[]> {
  // No token = Blob isn't connected (local dev). That's "not configured",
  // not a read failure.
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];

  const blobs = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: ENTRY_PREFIX, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const results = await Promise.all(
    blobs.map(async (blob) => {
      // Each entry blob is written exactly once (allowOverwrite: false), so a
      // URL cache-busted with its own upload time can never serve stale data.
      const res = await fetch(`${blob.url}?v=${new Date(blob.uploadedAt).getTime()}`);
      if (!res.ok) {
        throw new ComicsReadError(
          `Failed to read ${blob.pathname}: HTTP ${res.status}`
        );
      }
      let parsed: ComicEntry | null = null;
      try {
        parsed = parseEntry(await res.json());
      } catch {
        parsed = null;
      }
      if (!parsed) {
        console.error(`[comics] Skipping malformed entry blob: ${blob.pathname}`);
      }
      return parsed;
    })
  );

  const entries = results.filter((e): e is ComicEntry => e !== null);
  const migrated = await migrateLegacyManifest(entries);
  return [...entries, ...migrated];
}

/**
 * One-time migration from the old single-file manifest: any entry in it that
 * doesn't yet exist as its own blob gets written as one. The manifest itself
 * is never written again and stays in place (harmless; delete it whenever).
 */
async function migrateLegacyManifest(
  existing: ComicEntry[]
): Promise<ComicEntry[]> {
  const { blobs } = await list({ prefix: MANIFEST_PATH });
  const manifest = blobs.find((b) => b.pathname === MANIFEST_PATH);
  if (!manifest) return [];

  const res = await fetch(`${manifest.url}?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) {
    throw new ComicsReadError(
      `Failed to read legacy manifest: HTTP ${res.status}`
    );
  }
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    console.error("[comics] Legacy manifest isn't JSON; skipping migration.");
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const have = new Set(existing.map((e) => e.id));
  const migrated: ComicEntry[] = [];
  for (const item of raw) {
    const entry = parseEntry(item);
    if (!entry || have.has(entry.id)) continue;
    try {
      await saveEntry(entry);
    } catch {
      // A parallel request migrated it first (allowOverwrite: false refuses
      // the second write). Either way the entry exists — include it once.
    }
    migrated.push(entry);
  }
  return migrated;
}

/**
 * All comics, uploaded + legacy, newest first.
 * Throws ComicsReadError if the uploaded archive can't be read.
 */
export async function getComics(): Promise<ComicEntry[]> {
  const uploaded = await getUploadedComics();
  return sortComics([...uploaded, ...legacyComics]);
}
