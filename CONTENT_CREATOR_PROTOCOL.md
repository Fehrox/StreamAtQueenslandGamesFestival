# Content Creator Addition Protocol

Use this checklist every time a content creator is added. The goal is to update the roster, profile art, Twitch link, static route, and link preview metadata together.

## Required Inputs

Collect these before editing:

- Display name exactly as it should appear on the roster.
- Twitch handle without `@`, if they have one.
- Public profile URL, if it is different from `https://www.twitch.tv/<handle>`.
- Real profile picture file or a credible public source URL for one.
- Desired roster position.

Before adding anything, search for the display name, likely aliases, and Twitch handle so repeated requests do not create duplicate creator entries.

## Files To Edit

- `src/data/streamers.ts`
- `public/streamers/<creator-image>.<ext>`
- Optional: `public/streamers-styled/<same-file-stem>.png`

Do not edit generated files under `dist/`.

## Add The Profile Picture

1. Put the source profile image in `public/streamers/`.
2. Use a lowercase, stable filename with underscores for spaces, for example `new_creator.png`.
3. Prefer `.png` unless the source image is already a suitable `.jpg` or `.jpeg`.
4. If a styled/cutout version exists, put it in `public/streamers-styled/` using the same filename stem as the source image.
5. Keep the source image in `public/streamers/` even when a styled image exists. It is the fallback image and is used for social embeds.

For real-person creators, use an actual photo of the creator. Prefer official or high-confidence public sources such as Twitch profile images, creator sites, official management pages, Wikimedia, or verified socials. Avoid logos, avatars, heavily obscured shots, and unrelated people unless the user explicitly requests that style.

Crop source images to a clean square portrait before saving. A `600x600` PNG source has worked well for this project: it keeps social previews sharp while staying manageable. Preserve the creator's likeness and avoid cutting through the face, hair, or shoulders.

Example:

```txt
public/streamers/new_creator.png
public/streamers-styled/new_creator.png
```

## Generate Styled Portraits

Use the styled image when the creator needs to match the roster art direction.

1. Inspect the source photo locally before generation.
2. Use the built-in `imagegen` flow with the source image visible as the identity reference.
3. Prompt for a polished semi-real stylized creator portrait on a perfectly flat chroma-key background.
4. Explicitly forbid text, watermarks, black backgrounds, outlines, yellow glow, halos, and colored rim light.
5. Use a key color that is unlikely to appear in the subject. Start with `#00ff00`; use another flat key such as `#0000ff` only when it avoids the subject colors better.
6. Remove the chroma key with the installed helper:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py" --input <generated.png> --out <cutout.png> --auto-key border --soft-matte --despill
```

7. Save the final styled asset as a `300x300` PNG with alpha in `public/streamers-styled/`.
8. Keep the original generated image in the Codex generated-images directory, such as `$env:USERPROFILE\.codex\generated_images\`; copy the selected result into the project instead of moving or deleting the generated original.

If a generated portrait has black edges, colored halos, yellow rim light, background-removal artifacts, or poor likeness, regenerate from a better source or a stricter prompt. Do not try to ship a visibly patched image.

## Update Streamer Data

1. Open `src/data/streamers.ts`.
2. Add the display name to the `names` array in the intended roster position.
3. Remove one placeholder `OPEN SLOT ...` from the end if the roster would otherwise grow too large.
4. Add a matching entry to `streamerAssets` using the exact display name as the key.

Example:

```ts
"New Creator": {
  image: "/streamers/new_creator.png",
  profileUrl: "https://www.twitch.tv/newcreator",
  twitchHandle: "newcreator",
},
```

Notes:

- `image` is required for their roster portrait and Discord/social embed image.
- `twitchHandle` enables Twitch verification matching, Twitch URL aliases, and the panel Twitch button.
- `profileUrl` is optional when it is exactly `https://www.twitch.tv/<handle>`, but include it when known.
- If the creator does not have Twitch, omit `twitchHandle`; their route will use the display-name slug only.

## Status And Ordering

- Keep only one featured creator unless the page design changes. `featuredIndex` controls this.
- Add confirmed creators to `confirmedNames` only after they are actually confirmed.
- Do not rename existing creators unless that is the requested change. Their route slug and aliases come from `name` and `twitchHandle`.

## Routes And Link Previews

The build generates static pages for creators with an image or Twitch handle.

For a creator named `New Creator` with Twitch handle `newcreator`, expected paths include:

```txt
/new-creator/
/newcreator/
```

For Discord and other embed previews, the streamer page should include:

- `og:title`
- `og:description`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:image`

The embed image uses the original fallback image from `public/streamers/`, not the styled image.

## Validation Checklist

Run the build:

```sh
npm.cmd run build
```

Then check the generated streamer page:

```powershell
Select-String -Path dist\new-creator\index.html -Pattern "og:title|og:image|twitter:image|canonical"
```

Confirm:

- The build passes.
- The creator appears in `dist/index.html`.
- Their profile image path appears in `og:image`.
- Their Twitch handle route is generated if they have a Twitch handle.
- No unintended `OPEN SLOT ...` entries remain past the target roster size.

For image changes, also confirm:

- The source image in `public/streamers/` is square and uses the expected filename.
- The styled image in `public/streamers-styled/`, when present, is `300x300` and has an alpha channel.
- The styled image looks clean on transparent, white, and checkerboard backgrounds.
- No black outline, colored fringe, yellow halo, or leftover chroma-key background is visible.

## Final Review

Before committing:

- Check `git diff --stat`.
- Check `git diff -- src/data/streamers.ts`.
- Make sure only intended files changed.
- If rebasing, start from a clean worktree, rebase onto the requested branch, resolve conflicts without dropping creator/image changes, then run validation again.
- If sharing a deployed URL in Discord, remember Discord may cache old embeds for previously shared links.
