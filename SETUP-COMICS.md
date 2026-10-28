# Weekly Comic Upload Setup (one time, ~3 minutes)

The team posts each Sunday's comic at **pastalifeexperience.com/admin/comics** —
passcode, image, title, date, Publish. It's live on `/comics`, the homepage,
and the table page within a minute. No code, no GitHub.

Two things to configure in Vercel first:

## 1. Enable Blob storage

In the Vercel dashboard → the pasta-life-experience project → **Storage** tab →
**Create Database → Blob** → connect it to the project. This automatically adds
the `BLOB_READ_WRITE_TOKEN` env var. (Free tier covers years of weekly comics.)

## 2. Set the team passcode

Project → Settings → Environment Variables:

```
COMICS_UPLOAD_CODE=<pick a passcode and share it with the team>
```

Redeploy (or wait for the next deploy) and the upload page is live.

## Notes

- **Removing a mistake:** the upload page lists everything published, with a
  Remove button (same passcode). The three original strips are part of the
  site code and can't be removed from there.
- **Image handling:** phone photos are automatically downscaled in the browser
  before upload, so big camera files are fine.
- Until both env vars exist, the upload page politely refuses — the public
  site is unaffected either way (it always shows at least the built-in strips).
