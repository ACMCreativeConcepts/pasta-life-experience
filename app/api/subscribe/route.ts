import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email list signup. Forwards each signup to SUBSCRIBE_WEBHOOK_URL —
 * a Google Apps Script web app that appends a row to a Google Sheet
 * (see SETUP-EMAIL-LIST.md). No webhook configured → tell the client
 * so it can fall back to the mailto link.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source: typeof source === "string" ? source.slice(0, 40) : "site",
        date: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error("[Subscribe API] Webhook responded", res.status);
      return NextResponse.json(
        { error: "Could not save your signup. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Subscribe API] Error:", error);
    return NextResponse.json(
      { error: "Could not save your signup. Please try again." },
      { status: 500 }
    );
  }
}
