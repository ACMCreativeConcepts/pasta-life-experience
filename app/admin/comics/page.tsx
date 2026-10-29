"use client";

import { useState, useEffect, useRef } from "react";
import { todayInChicago, isValidYmd, formatComicDateShort } from "@/lib/dates";

interface ComicRow {
  id: string;
  title: string;
  date: string;
  image: string;
  thumb?: string;
  legacy?: boolean;
}

interface PublishResult {
  title: string;
  date: string;
  position: number;
  total: number;
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
  const [date, setDate] = useState("");
  const [panels, setPanels] = useState<{ file: File; preview: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "publishing" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [comics, setComics] = useState<ComicRow[]>([]);
  const [published, setPublished] = useState<PublishResult | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set in an effect (not useState) so the server-rendered HTML and the
    // client agree even when they sit in different timezones.
    setDate(todayInChicago());
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
      if (res.ok && Array.isArray(data.comics)) setComics(data.comics);
      else if (data?.error) setMessage(data.error);
    } catch {}
  };

  const MAX_PANELS = 8;

  const addPanels = (list: FileList | null) => {
    // Snapshot the FileList before touching the input: clearing the input
    // empties the live FileList, and React runs state updaters after this
    // handler returns — reading `list` in the updater would find it empty.
    const added = Array.from(list ?? []).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    if (added.length === 0) return;
    setPanels((old) => {
      const next = [...old, ...added].slice(0, MAX_PANELS);
      added.slice(Math.max(0, MAX_PANELS - old.length)).forEach((p) => URL.revokeObjectURL(p.preview));
      return next;
    });
    if (fileInput.current) fileInput.current.value = "";
  };

  const removePanel = (i: number) => {
    setPanels((old) => {
      URL.revokeObjectURL(old[i].preview);
      return old.filter((_, j) => j !== i);
    });
  };

  const movePanel = (i: number, dir: -1 | 1) => {
    setPanels((old) => {
      const j = i + dir;
      if (j < 0 || j >= old.length) return old;
      const next = [...old];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const clearPanels = () => {
    setPanels((old) => {
      old.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (panels.length === 0) {
      setMessage("Pick the comic image first.");
      return;
    }
    if (!isValidYmd(date)) {
      setMessage(`"${date}" isn't a real date — use the picker.`);
      return;
    }
    const dupe = comics.find(
      (c) =>
        c.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        c.date === date
    );
    if (
      dupe &&
      !window.confirm(
        `"${dupe.title}" dated ${formatComicDateShort(dupe.date)} is already on the site. Post it again anyway?`
      )
    ) {
      return;
    }

    setStatus("publishing");
    setMessage(null);
    try {
      try {
        sessionStorage.setItem("gp-comics-passcode", passcode);
      } catch {}

      const form = new FormData();
      form.append("passcode", passcode);
      form.append("title", title);
      form.append("date", date);
      for (const p of panels) {
        const blob = await prepareImage(p.file);
        form.append(
          "files",
          new File([blob], p.file.name, { type: blob.type || p.file.type })
        );
      }

      const res = await fetch("/api/comics", { method: "POST", body: form });
      const data = await res.json();

      const confirmed =
        res.ok &&
        data?.ok === true &&
        data?.entry?.id &&
        Array.isArray(data.comics) &&
        data.comics.some((c: ComicRow) => c.id === data.entry.id);

      if (confirmed) {
        const idx = data.comics.findIndex((c: ComicRow) => c.id === data.entry.id);
        setComics(data.comics);
        setPublished({
          title: data.entry.title,
          date: data.entry.date,
          position: idx + 1,
          total: data.comics.length,
        });
        setStatus("done");
        setTitle("");
        clearPanels();
        if (fileInput.current) fileInput.current.value = "";
      } else if (res.ok) {
        setStatus("idle");
        setMessage(
          "Saved state couldn't be confirmed — refresh the list before posting again."
        );
        refreshList();
      } else {
        setStatus("idle");
        setMessage(data?.error || "Upload failed. Try again.");
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
      if (res.ok && data?.ok === true && Array.isArray(data.comics)) {
        setComics(data.comics);
      } else {
        setMessage(data?.error || "Delete failed.");
        refreshList();
      }
    } catch {
      setMessage("Delete failed. Try again.");
    }
  };

  const isNewest = published !== null && published.position === 1;

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
            Post a New Comic
          </h1>
        </div>

        {status === "done" && published ? (
          <div className="rounded-2xl border border-[#1DB954]/50 bg-[#1a1a1a] p-8 text-center">
            <p className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#1DB954] text-xl mb-2">
              🎉 Published!
            </p>
            <p className="text-[#f5f5f5]/60 text-sm font-[family-name:var(--font-inter)] mb-6">
              {isNewest
                ? `"${published.title}" is live as this week's strip.`
                : `"${published.title}" is published for ${formatComicDateShort(published.date)} — it's in the archive (#${published.position} of ${published.total}).`}
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
              <label className={labelCls}>
                Comic image{panels.length > 1 ? "s" : ""}
                {panels.length > 0 && (
                  <span className="text-[#f5f5f5]/35 normal-case tracking-normal">
                    {" "}
                    — {panels.length} panel{panels.length > 1 ? "s" : ""}
                  </span>
                )}
              </label>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => addPanels(e.target.files)}
                className="block w-full text-sm text-[#f5f5f5]/60 font-[family-name:var(--font-inter)] file:mr-3 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a2a2a] file:text-[#f5f5f5] hover:file:bg-[#3a3a3a] file:cursor-pointer"
              />
              <p className="mt-1.5 text-[#f5f5f5]/35 text-xs font-[family-name:var(--font-inter)]">
                One image, or every panel of a multi-panel strip (up to {MAX_PANELS}).
                Readers see them top to bottom in the order below — use the arrows
                to fix the order.
              </p>
              {panels.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {panels.map((p, i) => (
                    <div
                      key={p.preview}
                      className="rounded-xl overflow-hidden border border-[#2a2a2a]"
                      style={{ background: "#f7f2e5" }}
                    >
                      <img src={p.preview} alt={`Panel ${i + 1}`} className="w-full h-auto" />
                      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-t border-[#2a2a2a]">
                        <span className="text-[#f5f5f5]/50 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-widest">
                          Panel {i + 1} of {panels.length}
                        </span>
                        <div className="flex items-center gap-3">
                          {panels.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => movePanel(i, -1)}
                                disabled={i === 0}
                                aria-label={`Move panel ${i + 1} up`}
                                className="text-[#f5f5f5]/60 hover:text-[#ff6b1a] disabled:opacity-20 text-base leading-none"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => movePanel(i, 1)}
                                disabled={i === panels.length - 1}
                                aria-label={`Move panel ${i + 1} down`}
                                className="text-[#f5f5f5]/60 hover:text-[#ff6b1a] disabled:opacity-20 text-base leading-none"
                              >
                                ↓
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => removePanel(i)}
                            aria-label={`Remove panel ${i + 1}`}
                            className="text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider text-[#e63030]/70 hover:text-[#e63030]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
              <label className={labelCls}>Date posted</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
              <p className="mt-1.5 text-[#f5f5f5]/35 text-xs font-[family-name:var(--font-inter)]">
                Already set to today — leave it. Back-dating is fine; future
                dates show on the site immediately.
              </p>
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
                      {formatComicDateShort(c.date)}{" "}
                      <span className="text-[#f5f5f5]/25">({c.date})</span>
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
