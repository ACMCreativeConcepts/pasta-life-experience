import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { STRIP_PREFIX } from "@/lib/comics";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB per panel

/**
 * Issues short-lived tokens so the admin page can upload panels straight from
 * the browser to Blob storage. Serverless functions cap request bodies at
 * ~4.5MB, so multi-panel comics can't travel through /api/comics itself —
 * only their URLs do, after the panels are already stored.
 */
export async function POST(req: NextRequest) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const expected = process.env.COMICS_UPLOAD_CODE;
        if (!expected) {
          throw new Error(
            "Comic uploads aren't configured yet (COMICS_UPLOAD_CODE missing)."
          );
        }
        let passcode = "";
        try {
          passcode = JSON.parse(clientPayload || "{}").passcode || "";
        } catch {}
        if (passcode !== expected) {
          throw new Error("Wrong passcode.");
        }
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error("Blob storage isn't connected to this project yet.");
        }
        if (!pathname.startsWith(STRIP_PREFIX)) {
          throw new Error("Upload path isn't allowed.");
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      // The admin page registers the comic itself (POST /api/comics with the
      // panel URLs), so there's nothing to do when an upload completes.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Comics upload] Token request failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
