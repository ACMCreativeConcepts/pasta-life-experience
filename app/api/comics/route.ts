import { NextRequest, NextResponse } from "next/server";
import { del, head, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import {
  ComicsReadError,
  STRIP_PREFIX,
  entryPath,
  getComics,
  getLegacyComics,
  getUploadedComics,
  saveEntry,
  sortComics,
  type ComicEntry,
} from "@/lib/comics";
import { isValidYmd } from "@/lib/dates";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function checkPasscode(passcode: unknown): NextResponse | null {
  const expected = process.env.COMICS_UPLOAD_CODE;
  if (!expected) {
    return json(
      { error: "Comic uploads aren't configured yet (COMICS_UPLOAD_CODE missing)." },
      503
    );
  }
  if (typeof passcode !== "string" || passcode !== expected) {
    return json({ error: "Wrong passcode." }, 401);
  }
  return null;
}

function revalidateComicPages() {
  revalidatePath("/");
  revalidatePath("/comics");
}

/** Fresh merged list; after a confirmed write, `ensure` is added if list() lags. */
async function freshComics(ensure?: ComicEntry): Promise<ComicEntry[]> {
  const uploaded = await getUploadedComics();
  if (ensure && !uploaded.some((e) => e.id === ensure.id)) {
    uploaded.push(ensure);
  }
  return sortComics([...uploaded, ...getLegacyComics()]);
}

export async function GET() {
  try {
    const comics = await getComics();
    return json({ comics });
  } catch (error) {
    console.error("[Comics API] Read failed:", error);
    return json(
      { error: "The comics archive couldn't be read right now. Try again in a minute." },
      503
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const denied = checkPasscode(form.get("passcode"));
    if (denied) return denied;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return json({ error: "Blob storage isn't connected to this project yet." }, 503);
    }

    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const date = String(form.get("date") || "").trim();

    if (!(file instanceof File)) {
      return json({ error: "No image attached." }, 400);
    }
    if (!ALLOWED_TYPES[file.type]) {
      return json({ error: "Image must be a JPG, PNG, or WebP." }, 400);
    }
    if (file.size > MAX_BYTES) {
      return json({ error: "Image is too large (max 10MB)." }, 400);
    }
    if (!title || title.length > 120) {
      return json({ error: "Please give the comic a title (up to 120 characters)." }, 400);
    }
    if (!isValidYmd(date)) {
      return json({ error: `"${date}" isn't a real date — use the date picker.` }, 400);
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "comic";

    const blob = await put(
      `${STRIP_PREFIX}${date}-${slug}.${ALLOWED_TYPES[file.type]}`,
      file,
      { access: "public", addRandomSuffix: true }
    );

    const entry: ComicEntry = {
      id: `${date}-${slug}-${Date.now().toString(36)}`,
      title,
      date,
      image: blob.url,
      createdAt: new Date().toISOString(),
    };

    // Save the entry and confirm it actually landed (head() reads the store
    // directly, not the CDN). If anything fails, clean up the image and
    // report failure — never claim success for an unconfirmed save.
    try {
      if (
        process.env.VERCEL_ENV !== "production" &&
        form.get("__test_fail_entry") === "1"
      ) {
        throw new Error("Forced entry-write failure (preview test hook)");
      }
      await saveEntry(entry);
      await head(entryPath(entry.id));
    } catch (error) {
      console.error("[Comics API] Entry save/confirm failed:", error);
      try {
        await del(blob.url);
      } catch (cleanupError) {
        console.error("[Comics API] Image cleanup also failed:", cleanupError);
      }
      return json(
        { error: "The comic couldn't be saved — nothing was published. Try again." },
        500
      );
    }

    revalidateComicPages();

    let comics: ComicEntry[];
    try {
      comics = await freshComics(entry);
    } catch (error) {
      // The save is confirmed; only the fresh listing failed. Return what we
      // know for sure so the admin UI stays truthful.
      console.error("[Comics API] Post-save listing failed:", error);
      comics = sortComics([entry, ...getLegacyComics()]);
    }

    return json({ ok: true, entry, comics });
  } catch (error) {
    console.error("[Comics API] Upload failed:", error);
    return json({ error: "Upload failed. Please try again." }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, passcode } = await req.json();

    const denied = checkPasscode(passcode);
    if (denied) return denied;

    if (typeof id !== "string" || id.startsWith("legacy-")) {
      return json({ error: "That comic can't be removed from here." }, 400);
    }

    // Read first; a failed read throws to the 500 below and nothing is written.
    const uploaded = await getUploadedComics();
    const entry = uploaded.find((c) => c.id === id);
    if (!entry) {
      return json({ error: "Comic not found." }, 404);
    }

    await del(entryPath(id));

    // Only delete images in this environment's own strip folder. Blob-store
    // URLs outside it (e.g. production images listed on a preview deploy via
    // the migrated manifest) are left alone; repo files are never touched.
    let imagePath = "";
    try {
      imagePath = new URL(entry.image).pathname;
    } catch {}
    if (
      entry.image.includes("blob.vercel-storage.com") &&
      imagePath.startsWith(`/${STRIP_PREFIX}`)
    ) {
      try {
        await del(entry.image);
      } catch (error) {
        console.error("[Comics API] Image delete failed (entry removed):", error);
      }
    }

    revalidateComicPages();

    let comics: ComicEntry[];
    try {
      const fresh = await getUploadedComics();
      comics = sortComics([
        ...fresh.filter((c) => c.id !== id),
        ...getLegacyComics(),
      ]);
    } catch (error) {
      console.error("[Comics API] Post-delete listing failed:", error);
      comics = sortComics([
        ...uploaded.filter((c) => c.id !== id),
        ...getLegacyComics(),
      ]);
    }

    return json({ ok: true, comics });
  } catch (error) {
    const blocked = error instanceof ComicsReadError;
    console.error("[Comics API] Delete failed:", error);
    return json(
      {
        error: blocked
          ? "The archive couldn't be read, so nothing was removed. Try again in a minute."
          : "Delete failed. Please try again.",
      },
      blocked ? 503 : 500
    );
  }
}
