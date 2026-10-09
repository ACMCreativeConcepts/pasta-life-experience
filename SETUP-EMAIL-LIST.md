# Email List Setup (5 minutes, one time)

The "Join the List" forms on the site POST to `/api/subscribe`, which forwards
each signup to a Google Sheet through a Google Apps Script webhook. Until the
webhook is configured, the form safely falls back to the old mailto link —
nothing breaks, but signups aren't collected automatically.

## Steps

1. **Create the sheet.** In Google Drive (acmcreativeconcepts@gmail.com),
   create a spreadsheet named `GPC Email List` with headers in row 1:
   `email | source | date`

2. **Add the script.** In the sheet: Extensions → Apps Script. Replace the
   contents with:

   ```javascript
   function doPost(e) {
     var data = JSON.parse(e.postData.contents);
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     sheet.appendRow([data.email, data.source, data.date]);
     return ContentService.createTextOutput(
       JSON.stringify({ ok: true })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy it.** Deploy → New deployment → type "Web app" →
   Execute as: **Me** → Who has access: **Anyone** → Deploy.
   Copy the Web app URL (ends in `/exec`).

4. **Set the env var.** In the Vercel project settings for
   pastalifeexperience.com, add:

   ```
   SUBSCRIBE_WEBHOOK_URL=<the Web app URL>
   ```

   Then redeploy (or it picks up on the next deploy).

That's it. Signups land in the sheet with their source (`rewards` = homepage
rewards section, `table` = the table QR page).
