"use client";

import { useState, useEffect, useRef } from "react";

interface ComicRow {
  id: string;
  title: string;
  date: string;
  image: string;
  thumb?: string;
  legacy?: boolean;
}

/** Default to today if it's Sunday, otherwise the coming Sunday. */
function defaultSunday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  return d.toISOString().slice(0, 10);
}

/** Downscale big phone photos client-side so uploads stay light. */
async function prepareImage(file: File): Promise<Blob> {
  const MAX = 1800;
  const bitmap = await createImageBitmap(file);
  if (Math.max(bitmap.width, bitmap.height) <= MAX) return file;

  const scale = MAX / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b || file), "image/jpeg", 0.88)
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-[family-name:var(--font-inter)] placeholder:text-[#f5f5f5]/30 focus:outline-none focus:border-[#ff6b1a] transition-colors";

const labelCls =
  "block text-[#f5f5f5]/60 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest mb-1.5";

export default function ComicsAdminPage() {
  const [passcode, setPasscode] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultSunday());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "publishing" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [comics, setComics] = useState<ComicRow[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("gp-comics-passcode");
      if (saved) setPasscode(saved);
    } catch {}
    refreshList();
  }, []);

  const refreshList = async () => {
    try {
      const res = await fetch("/api/comics");
      const data = await res.json();
      if (Array.isArray(data.comics)) setComics(data.comics);
    } catch {}
  };

  const onPickFile = (f: File | null) => {
    setFile(f);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return f ? URL.createObjectURL(f) : null;
    });
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Pick the comic image first.");
      return;
    }
    setStatus("publishing");
    setMessage(null);
    try {
      try {
        sessionStorage.setItem("gp-comics-passcode", passcode);
      } catch {}

      const blob = await prepareImage(file);
      const form = new FormData();
      form.append("passcode", passcode);
      form.append("title", title);
      form.append("date", date);
      form.append(
        "file",
        new File([blob], file.name, { type: blob.type || file.type })
      );

      const res = await fetch("/api/comics", { method: "POST", body: form });
      const data = await res.json();

      if (res.ok) {
        setStatus("done");
        setTitle("");
        onPickFile(null);
        if (fileInput.current) fileInput.current.value = "";
        refreshList();
      } else {
        setStatus("idle");
        setMessage(data.error || "Upload failed. Try again.");
      }
    } catch {
      setStatus("idle");
      setMessage("Upload failed. Check your connection and try again.");
    }
  };

  const remove = async (comic: ComicRow) => {
    if (!window.confirm(`Remove "${comic.title}" from the site?`)) return;
    try {
      const res = await fetch("/api/comics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comic.id, passcode }),
      });
      const data = await res.json();
      if (res.ok) refreshList();
      else setMessage(data.error || "Delete failed.");
    } catch {
      setMessage("Delete failed. Try again.");
    }
  };

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 100%)" }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#ff6b1a] text-xs font-[family-name:var(--font-oswald)] font-semibold tracking-[0.3em] uppercase mb-2">
            GP Team Only
          </p>
          <h1 className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#f5f5f5] text-3xl">
            Post This Week&apos;s Comic
          </h1>
        </div>

        {status === "done" ? (
          <div className="rounded-2xl border border-[#1DB954]/50 bg-[#1a1a1a] p-8 text-center">
            <p className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#1DB954] text-xl mb-2">
              🎉 It&apos;s live!
            </p>
            <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] mb-6">
              The comic is published and showing as this week&apos;s strip.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/comics"
                className="py-3 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white"
                style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
              >
                See It Live
              </a>
              <button
                onClick={() => setStatus("idle")}
                className="py-3 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm border border-[#ff6b1a]/60 text-[#ff6b1a] hover:bg-[#ff6b1a]/10 transition-all"
              >
                Post Another
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={publish}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 flex flex-col gap-5"
          >
            <div>
              <label className={labelCls}>Team passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Ask Anthony"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Comic image</label>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#f5f5f5]/60 font-[family-name:var(--font-inter)] file:mr-3 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a2a2a] file:text-[#f5f5f5] hover:file:bg-[#3a3a3a] file:cursor-pointer"
              />
              {preview && (
                <div className="mt-3 rounded-xl overflow-hidden border border-[#2a2a2a]" style={{ background: "#f7f2e5" }}>
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Penne for Your Thoughts"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Drop date (Sunday)</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>

            {message && (
              <p className="text-[#e63030] text-sm font-[family-name:var(--font-inter)]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "publishing"}
              className="py-3.5 px-6 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
            >
              {status === "publishing" ? "Publishing..." : "Publish Comic"}
            </button>
          </form>
        )}

        {/* Published comics */}
        {comics.length > 0 && (
          <div className="mt-10">
            <p className={labelCls}>On the site now</p>
            <div className="flex flex-col gap-2">
              {comics.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-3"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ background: "#f7f2e5" }}>
                    <img src={c.thumb || c.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-inter)] font-medium truncate">
                      {c.title}
                    </p>
                    <p className="text-[#f5f5f5]/40 text-xs font-[family-name:var(--font-inter)]">
                      {c.date}
                    </p>
                  </div>
                  {!c.legacy && (
                    <button
                      onClick={() => remove(c)}
                      className="shrink-0 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#e63030]/70 hover:text-[#e63030] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
