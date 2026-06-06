# Google Signup Skill

Use this guide to add the same signup flow used by this website to another static website.

The pattern is:

1. A public HTML form collects an email address.
2. JavaScript posts the signup to a Google Apps Script web app.
3. Apps Script appends the signup to a Google Sheet.
4. The page shows loading, success, error, and confirmation modal states.

## When To Use

Use this approach when a small website needs a waitlist, newsletter interest form, beta signup form, or simple lead capture without a backend server.

Do not use this for sensitive data, passwords, payments, account creation, or anything requiring strong abuse protection.

## Prerequisites

- A Google account.
- A Google Sheet to receive signups.
- A static website where you can edit HTML and JavaScript.
- Permission to deploy a Google Apps Script web app.

## Current Website Contract

The current website submits these fields:

- `email`: the user's email address.
- `userAgent`: `navigator.userAgent` from the browser.
- `deploymentId`: the Google Apps Script deployment id.

The form also contains a hidden honeypot field named `_gotcha`. If that field has a value, the browser silently drops the submission.

The browser uses `fetch(..., { method: 'POST', mode: 'no-cors', body: formData })`. This avoids CORS setup for a static site, but it means the browser usually receives an opaque response and cannot read the Apps Script JSON. Treat an opaque response as success.

## Create The Google Sheet

1. Create a Google Sheet.
2. Rename the first sheet to `Signups`.
3. Add this header row:

```text
Timestamp | Email | User Agent | Deployment Id | Source | Notes
```

The Apps Script below will also create the header row if it is missing.

## Create The Apps Script

In the Google Sheet, open `Extensions > Apps Script`.

Paste this script:

```javascript
const SHEET_NAME = 'Signups';

function doPost(e) {
  try {
    const sheet = getSignupSheet_();
    const params = e && e.parameter ? e.parameter : {};

    const email = String(params.email || '').trim().toLowerCase();
    const userAgent = String(params.userAgent || '').trim();
    const deploymentId = String(params.deploymentId || '').trim();
    const gotcha = String(params._gotcha || '').trim();

    if (gotcha) {
      return json_({ ok: true, message: 'Ignored.' });
    }

    if (!email || !isValidEmail_(email)) {
      return json_({ ok: false, error: 'A valid email address is required.' });
    }

    sheet.appendRow([
      new Date(),
      email,
      userAgent,
      deploymentId,
      'website',
      ''
    ]);

    return json_({ ok: true, message: 'Thanks! Please check your inbox soon.' });
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : 'Signup failed.' });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Signup endpoint is running.' });
}

function getSignupSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'User Agent', 'Deployment Id', 'Source', 'Notes']);
  }

  return sheet;
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

## Deploy The Apps Script

1. In Apps Script, click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Deploy and approve the requested permissions.
6. Copy the web app URL. It will look like this:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Use that full URL as `FORM_URL`.

Use the middle deployment id as `DEPLOYMENT_ID`.

## Add The HTML

Add the form near the section where users should sign up:

```html
<form id="signup-form" class="flex w-full max-w-lg relative">
  <label for="email" class="sr-only">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="Enter your email"
    required
  />
  <input
    type="text"
    name="_gotcha"
    autocomplete="off"
    tabindex="-1"
    style="position:absolute;left:-9999px;opacity:0"
  />
  <button type="submit" id="signup-btn">
    <span id="signup-btn-text">Join Waitlist</span>
    <span id="signup-btn-spinner" hidden aria-hidden="true"></span>
  </button>
</form>

<p id="signup-msg" aria-live="polite" role="status"></p>
```

Optional confirmation modal:

```html
<div id="signup-modal" hidden aria-hidden="true">
  <div data-modal-overlay="true"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
    <button type="button" id="signup-modal-dismiss" aria-label="Close">Close</button>
    <h3 id="signup-modal-title">You're on the list!</h3>
    <p>We'll send an invite to <span id="signup-modal-email"></span> soon.</p>
    <button type="button" id="signup-modal-close">Got it</button>
  </div>
</div>
```

Style the elements to match the target site. Keep the element ids the same unless you also update the JavaScript.

## Add The JavaScript

Place this script after the form markup:

```html
<script>
  const FORM_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
  const DEPLOYMENT_ID = 'YOUR_DEPLOYMENT_ID';

  const form = document.getElementById('signup-form');
  const btn = document.getElementById('signup-btn');
  const msg = document.getElementById('signup-msg');
  const btnText = document.getElementById('signup-btn-text');
  const btnSpinner = document.getElementById('signup-btn-spinner');

  const modal = document.getElementById('signup-modal');
  const modalClose = document.getElementById('signup-modal-close');
  const modalDismiss = document.getElementById('signup-modal-dismiss');
  const modalEmail = document.getElementById('signup-modal-email');
  let lastFocusedElement = null;

  const openModal = (email) => {
    if (!modal) {
      return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (modalEmail) {
      modalEmail.textContent = email;
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');

    const focusTarget = modalClose || modalDismiss;
    if (focusTarget) {
      focusTarget.focus();
    }
  };

  const closeModal = () => {
    if (!modal || modal.hidden) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  if (modal) {
    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target === modal || (target && target.hasAttribute && target.hasAttribute('data-modal-overlay'))) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalDismiss) {
    modalDismiss.addEventListener('click', closeModal);
  }

  const setLoadingState = (isLoading) => {
    if (btn) {
      btn.disabled = isLoading;
      if (isLoading) {
        btn.setAttribute('aria-busy', 'true');
      } else {
        btn.removeAttribute('aria-busy');
      }
    }

    if (btnText) {
      btnText.textContent = isLoading ? 'Submitting...' : 'Join Waitlist';
    }

    if (btnSpinner) {
      btnSpinner.hidden = !isLoading;
    }
  };

  if (form && btn && msg) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailField = document.getElementById('email');
      if (!emailField) {
        return;
      }

      const setMessage = (text, type) => {
        msg.textContent = text;
        msg.dataset.status = type || '';
      };

      setMessage('', null);
      setLoadingState(true);

      const email = emailField.value.trim();
      const honeypotField = form.querySelector('input[name="_gotcha"]');
      const honeypot = honeypotField ? honeypotField.value.trim() : '';

      if (!email) {
        setMessage('Please enter a valid email address.', 'error');
        setLoadingState(false);
        emailField.focus();
        return;
      }

      if (honeypot) {
        setLoadingState(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('userAgent', navigator.userAgent);
        formData.append('deploymentId', DEPLOYMENT_ID);

        const response = await fetch(FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        });

        const isOpaque = response.type === 'opaque' || response.status === 0;
        let data = {};

        if (!isOpaque) {
          data = await response.json().catch(() => ({}));
        }

        const ok = isOpaque || (response.ok && (data.ok === undefined || data.ok === true));

        if (ok) {
          form.reset();
          setMessage(data.message || 'Thanks! Please check your inbox soon.', 'success');
          openModal(email);
        } else {
          setMessage(data.error || 'Something went wrong. Try again?', 'error');
        }
      } catch (error) {
        setMessage('Network error. Please try again.', 'error');
      } finally {
        setLoadingState(false);
      }
    });
  }
</script>
```

## Important Integration Notes

- Replace `YOUR_DEPLOYMENT_ID` in both constants.
- Keep `mode: 'no-cors'` if the site is static and you do not want to manage CORS.
- Because `no-cors` responses are opaque, client-side success means "the browser accepted the request", not "the sheet definitely wrote the row".
- Verify success by checking the Google Sheet after a test submission.
- Keep the `_gotcha` field hidden from users. It is a low-friction bot filter.
- Add a privacy notice if collecting emails for marketing or product updates.
- Do not commit private sheet ids, Apps Script editor links, or credentials.

## Test Checklist

1. Open the deployed website.
2. Submit a normal email address.
3. Confirm the loading state appears and then clears.
4. Confirm the success message or modal appears.
5. Confirm a new row appears in the `Signups` sheet.
6. Submit an empty email and confirm the browser blocks it or shows an error.
7. Temporarily fill `_gotcha` in dev tools and confirm no signup row is created.
8. Test on mobile width to confirm the form and modal are usable.

## Troubleshooting

If no row appears in the sheet:

- Confirm `FORM_URL` uses the deployed `/exec` URL, not the Apps Script editor URL.
- Confirm the deployment access is `Anyone`.
- Confirm Apps Script was deployed after the latest script changes.
- Open the Apps Script execution logs and check for errors.
- Submit directly with a tool like Postman or curl using `email`, `userAgent`, and `deploymentId`.

If the page always shows success but the sheet is empty:

- This is expected behavior with `mode: 'no-cors'` when the request is accepted but Apps Script fails later.
- Check Apps Script logs and the deployment permissions.

If duplicate signups are a problem:

- Add duplicate detection in Apps Script before `appendRow`.
- A simple option is to read the email column and return success without appending if the email already exists.

## Optional Duplicate Protection

Replace the `sheet.appendRow(...)` block with this version:

```javascript
const lastRow = sheet.getLastRow();
const existingEmails = lastRow > 1
  ? sheet
      .getRange(2, 2, lastRow - 1, 1)
      .getValues()
      .flat()
      .map((value) => String(value || '').trim().toLowerCase())
  : [];

if (existingEmails.includes(email)) {
  return json_({ ok: true, message: 'You are already on the list.' });
}

sheet.appendRow([
  new Date(),
  email,
  userAgent,
  deploymentId,
  'website',
  ''
]);
```

## Reuse Summary

To integrate this into a new website:

1. Create the Google Sheet.
2. Add and deploy the Apps Script.
3. Copy the deployment URL and id.
4. Add the HTML form, honeypot, status message, and optional modal.
5. Add the JavaScript and replace the constants.
6. Submit a test email and confirm the row appears in the sheet.
