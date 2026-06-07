# Queensland Games Festival Streamer Invite

Static Astro site recreating a fighting-game character-select screen as a
Queensland Games Festival streamer signup invite.

## Commands

```sh
npm install
npm run dev
npm run build
```

The site is configured for root GitHub Pages or custom-domain hosting with
`base: "/"`.

## Content creator roster updates

Use `CONTENT_CREATOR_PROTOCOL.md` when adding a new content creator. It covers
the roster data, images, Twitch handles, generated routes, and Discord/social
embed checks.

## Twitch verification

For local development, copy `.env.example` to `.env.local` and set:

```sh
PUBLIC_TWITCH_CLIENT_ID=your_twitch_client_id_here
PUBLIC_GOOGLE_EOI_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
PUBLIC_GOOGLE_EOI_DEPLOYMENT_ID=YOUR_DEPLOYMENT_ID
```

For GitHub Pages deployment, `.env.local` is not used. Add the same value in
GitHub under **Settings -> Secrets and variables -> Actions -> Variables** as
either a repository variable or a `github-pages` environment variable named
`PUBLIC_TWITCH_CLIENT_ID`. A repository or environment secret with the same name
also works, but the Twitch client ID is public in the built site.

The deploy workflow passes that value into `npm run build` and fails before
building if it is missing. The Twitch app should register this exact redirect
URL:

```txt
https://streamatqueenslandgamesfestival.com
```

The page retries once with the slash root URL below if Twitch returns
`redirect_mismatch`, but Twitch treats registered OAuth redirect URLs as exact
values, so registering both avoids surprises:

```txt
https://streamatqueenslandgamesfestival.com/
```

If both fail, confirm the GitHub `PUBLIC_TWITCH_CLIENT_ID` value is the Client
ID from that same Twitch app.

Per-streamer Twitch names are read from `twitchHandle` in `src/data/streamers.ts`.
No Twitch client secret is used or stored by this static page.

## Google Sheets EOI writes

The confirmation / EOI modal can write to Google Sheets through a deployed
Google Apps Script web app. Because GitHub Pages serves static files, these
values must be available when GitHub Actions builds the site. They are baked
into the generated JavaScript and are not runtime server environment variables.
When a creator confirms through Twitch, the sheet row includes the Twitch login
returned by OAuth.

For the GitHub Pages deployment, add these as repository variables or
`github-pages` environment variables in
`Settings > Secrets and variables > Actions > Variables`:

```text
PUBLIC_GOOGLE_EOI_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
PUBLIC_GOOGLE_EOI_DEPLOYMENT_ID=YOUR_DEPLOYMENT_ID
```

The deploy workflow passes those variables into `npm run build` and fails before
building if they are missing. If you change them, rerun the Pages workflow or
push to `remote-deploy` so Astro rebuilds the static site with the new values.

For local testing, copy `.env.example` to `.env.local` and fill in the same
values before running `npm run dev` or `npm run build`.

See [GOOGLE_EOI_SETUP.md](GOOGLE_EOI_SETUP.md) for the sheet headers and Apps
Script deployment steps.
