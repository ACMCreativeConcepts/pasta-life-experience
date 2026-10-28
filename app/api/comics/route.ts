import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getComics, getManifest, MANIFEST_PATH, type ComicEntry } from "@/lib/comics";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function checkPasscode(passcode: unknown): NextResponse | null {
  const expected = process.env.COMICS_UPLOAD_CODE;
  if (!expected) {
    return NextResponse.json(
      { error: "Comic uploads aren't configured yet (COMICS_UPLOAD_CODE missing)." },
      { status: 503 }
    );
  }
  if (typeof passcode !== "string" || passcode !== expected) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }
  return null;
}

async function saveManifest(entries: ComicEntry[]) {
  await put(MANIFEST_PATH, JSON.stringify(entries), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

function revalidateComicPages() {
  revalidatePath("/");
  revalidatePath("/comics");
  revalidatePath("/table");
}

export async function GET() {
  const comics = await getComics();
  return NextResponse.json({ comics });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const denied = checkPasscode(form.get("passcode"));
    if (denied) return denied;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage isn't connected to this project yet." },
        { status: 503 }
      );
    }

    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const date = String(form.get("date") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image attached." }, { status: 400 });
    }
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Image must be a JPG, PNG, or WebP." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large (max 10MB)." },
        { status: 400 }
      );
    }
    if (!title || title.length > 120) {
      return NextResponse.json(
        { error: "Please give the comic a title (up to 120 characters)." },
        { status: 400 }
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "comic";

    const blob = await put(
      `comics/strips/${date}-${slug}.${ALLOWED_TYPES[file.type]}`,
      file,
      { access: "public", addRandomSuffix: true }
    );

    const entry: ComicEntry = {
      id: `${date}-${slug}-${Date.now().toString(36)}`,
      title,
      date,
      image: blob.url,
    };

    const manifest = await getManifest();
    await saveManifest([entry, ...manifest]);
    revalidateComicPages();

    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    console.error("[Comics API] Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, passcode } = await req.json();

    const denied = checkPasscode(passcode);
    if (denied) return denied;

    if (typeof id !== "string" || id.startsWith("legacy-")) {
      return NextResponse.json(
        { error: "That comic can't be removed from here." },
        { status: 400 }
      );
    }

    const manifest = await getManifest();
    const entry = manifest.find((c) => c.id === id);
    if (!entry) {
      return NextResponse.json({ error: "Comic not found." }, { status: 404 });
    }

    await saveManifest(manifest.filter((c) => c.id !== id));
    // Only delete blobs we uploaded (never repo files)
    if (entry.image.includes("blob.vercel-storage.com")) {
      try {
        await del(entry.image);
      } catch (error) {
        console.error("[Comics API] Blob delete failed (manifest updated):", error);
      }
    }
    revalidateComicPages();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Comics API] Delete failed:", error);
    return NextResponse.json(
      { error: "Delete failed. Please try again." },
      { status: 500 }
    );
  }
}
