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

## Twitch verification

For local development, copy `.env.example` to `.env.local` and set:

```sh
PUBLIC_TWITCH_CLIENT_ID=your_twitch_client_id_here
```

For deployment, add the same `PUBLIC_TWITCH_CLIENT_ID` value as a build-time
environment variable in the hosting provider. The Twitch app must register the
deployed page URL, and any local dev URL used for testing, as OAuth redirect
URLs.

Per-streamer Twitch names are read from `twitchHandle` in `src/data/streamers.ts`.
No Twitch client secret is used or stored by this static page.

Google Sheets attendance writes still need a backend or serverless endpoint
because GitHub Pages cannot securely store Google API secrets.
