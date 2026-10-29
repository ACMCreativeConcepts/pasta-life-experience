/**
 * Calendar-date helpers for comics.
 *
 * A comic's `date` is a plain YYYY-MM-DD calendar date. It must never pass
 * through Date#toISOString() or local-time formatting — both shift the day
 * depending on the clock's timezone. All math here is done in UTC on
 * Date.UTC values, so every server region and every visitor's browser
 * produce the same result.
 */

/** Today's calendar date at the restaurant (America/Chicago), as YYYY-MM-DD. */
export function todayInChicago(): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
}

/** True for a well-formed, real calendar date (rejects 2026-02-30 etc.). */
export function isValidYmd(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function utcNoon(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** "Sunday, September 20, 2026" — identical on the server and in any browser. */
export function formatComicDate(date: string): string {
  if (!isValidYmd(date)) return date;
  return utcNoon(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Sun, Sep 20, 2026" — compact form for admin lists. */
export function formatComicDateShort(date: string): string {
  if (!isValidYmd(date)) return date;
  return utcNoon(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
