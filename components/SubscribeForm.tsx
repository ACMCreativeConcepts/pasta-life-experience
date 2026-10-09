"use client";

import { useState } from "react";

const FALLBACK_MAILTO =
  "mailto:acmcreativeconcepts@gmail.com?subject=GPC Early Access — Join the List&body=I want to be on the Graffiti Pasta Coin early access list!";

/**
 * Email signup form. Posts to /api/subscribe; if the list backend
 * isn't configured yet, falls back to the mailto link so no signup
 * is ever a dead end.
 */
export default function SubscribeForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("done");
      } else if (data.error === "not_configured") {
        // List backend not set up yet — open the mail fallback
        window.location.href = FALLBACK_MAILTO;
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Try again.");
    }
  };

  if (status === "done") {
    return (
      <p className="font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-[#1DB954] py-3">
        🎉 You&apos;re on the list!
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="flex-1 px-5 py-3 rounded-full bg-[#0d0d0d] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-[family-name:var(--font-inter)] placeholder:text-[#f5f5f5]/30 focus:outline-none focus:border-[#ff6b1a] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 rounded-full font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0"
        style={{ background: "linear-gradient(135deg, #e63030, #ff6b1a)" }}
      >
        {status === "sending" ? "Joining..." : "Join the List"}
      </button>
      {errorMsg && (
        <p className="text-[#e63030] text-xs font-[family-name:var(--font-inter)] sm:w-full">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
