# Google EOI Sheet Setup

Use this setup to save the creator confirmation / EOI modal results to a Google Sheet from the static Astro site.

## Sheet

Create a Google Sheet and rename the first tab to `EOI`.

Use this header row:

```text
Timestamp | Creator Id | Creator Name | Creator Email | Stream Station | Twitch Connect | Panel Interest | Travel Funding | IRL Streaming | User Agent | Deployment Id | Source | Notes
```

The Apps Script below creates the tab and header row if they are missing.

## Apps Script
  
Open `Extensions > Apps Script` from the sheet and paste this script:

```javascript
const SHEET_NAME = 'EOI';
const HEADERS = [
  'Timestamp',
  'Creator Id',
  'Creator Name',
  'Creator Email',
  'Stream Station',
  'Twitch Connect',
  'Panel Interest',
  'Travel Funding',
  'IRL Streaming',
  'User Agent',
  'Deployment Id',
  'Source',
  'Notes',
];

function doPost(e) {
  try {
    const sheet = getEoiSheet_();
    const params = e && e.parameter ? e.parameter : {};

    const gotcha = text_(params._gotcha);
    if (gotcha) {
      return json_({ ok: true, message: 'Ignored.' });
    }

    const creatorId = text_(params.creatorId);
    const creatorName = text_(params.creatorName);
    const creatorEmail = text_(params.creatorEmail).toLowerCase();

    if (!creatorId || !creatorName) {
      return json_({ ok: false, error: 'A selected creator is required.' });
    }

    if (creatorEmail && !isValidEmail_(creatorEmail)) {
      return json_({ ok: false, error: 'Creator email is invalid.' });
    }

    sheet.appendRow([
      new Date(),
      creatorId,
      creatorName,
      creatorEmail,
      yesNo_(params.streamingStation),
      yesNo_(params.twitchConnect),
      yesNo_(params.panelInterest),
      yesNo_(params.travelFunding),
      yesNo_(params.irlStreaming),
      text_(params.userAgent),
      text_(params.deploymentId),
      text_(params.source) || 'qgf-invite',
      '',
    ]);

    return json_({ ok: true, message: 'Saved. Thanks for confirming.' });
  } catch (error) {
    return json_({
      ok: false,
      error: error && error.message ? error.message : 'EOI save failed.',
    });
  }
}

function doGet() {
  return json_({ ok: true, message: 'EOI endpoint is running.' });
}

function getEoiSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function text_(value) {
  return String(value || '').trim();
}

function yesNo_(value) {
  const normalized = text_(value).toLowerCase();
  return normalized === 'yes' || normalized === 'no' ? normalized : '';
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Deploy

1. In Apps Script, click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Deploy and approve the requested permissions.
6. Copy the `/exec` web app URL.

For GitHub Pages, add these as repository variables in
`Settings > Secrets and variables > Actions > Variables`:

```text
PUBLIC_GOOGLE_EOI_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
PUBLIC_GOOGLE_EOI_DEPLOYMENT_ID=YOUR_DEPLOYMENT_ID
```

The deploy workflow passes those variables into `npm run build`, and Astro bakes
them into the static JavaScript served by GitHub Pages.

`PUBLIC_GOOGLE_EOI_DEPLOYMENT_ID` is optional when the id can be parsed from the URL, but setting it explicitly keeps the sheet row clear.

## Verify

Submit the confirmation modal on the deployed site, then check the `EOI` tab for a new row.

The browser posts with `mode: "no-cors"`, so an opaque browser response is treated as success. If the UI reports success but the sheet is empty, check the Apps Script execution logs and deployment permissions.
