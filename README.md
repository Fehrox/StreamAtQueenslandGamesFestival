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

For GitHub Pages deployment, `.env.local` is not used. Add the same value in
GitHub under **Settings -> Secrets and variables -> Actions -> Variables** as
either a repository variable or a `github-pages` environment variable named
`PUBLIC_TWITCH_CLIENT_ID`. A repository or environment secret with the same name
also works, but the Twitch client ID is public in the built site.

The deploy workflow passes that value into `npm run build` and fails before
building if it is missing. The Twitch app must register this exact redirect URL:

```txt
https://streamatqueenslandgamesfestival.com/
```

Per-streamer Twitch names are read from `twitchHandle` in `src/data/streamers.ts`.
No Twitch client secret is used or stored by this static page.

Google Sheets attendance writes still need a backend or serverless endpoint
because GitHub Pages cannot securely store Google API secrets.
