# READY Overlay Bottom Panel Stacking

## Problem

The READY overlay has a dark opaque background at `.ready-overlay::before`. It should dim the screen and the bottom dock background, but it must not cover the two bottom player panels.

The intended stack is:

1. Page and bottom dock background
2. READY overlay dark background
3. READY banner
4. Bottom player panels

## Root Cause

The regression came from treating `.bottom-dock` as the visible layer that needed to be above the overlay. That is too broad.

When `.bottom-dock` had a high `z-index` and `isolation: isolate`, the entire dock became a stacking context above the READY overlay. That kept the dock background above the dark overlay, so it was not dimmed.

After lowering `.bottom-dock`, the panels still rendered below the overlay because this more specific rule won:

```css
.bottom-dock > .player-panel {
  z-index: 2;
}
```

That overrode the later generic `.player-panel { z-index: 8; }` rule because `.bottom-dock > .player-panel` has higher specificity.

## Fix

Keep the dock container/background below the READY overlay, and put only the actual panels above it.

```css
.ready-overlay {
  z-index: 6;
}

.bottom-dock {
  position: absolute;
  z-index: auto;
  /* Do not use isolation: isolate here. */
}

.bottom-dock > .player-panel {
  z-index: 8;
}

.player-panel {
  position: relative;
  z-index: 8;
}
```

The important parts are:

- `.bottom-dock` must not have `z-index: 8`.
- `.bottom-dock` must not have `isolation: isolate`.
- `.bottom-dock > .player-panel` must be above `.ready-overlay`, currently `8 > 6`.

## Applying On A Descendant Branch

In `src/pages/index.astro`, check the desktop CSS near `.bottom-dock`.

Change this:

```css
.bottom-dock {
  position: absolute;
  z-index: 8;
  isolation: isolate;
}

.bottom-dock > .player-panel {
  z-index: 2;
}
```

To this:

```css
.bottom-dock {
  position: absolute;
  z-index: auto;
}

.bottom-dock > .player-panel {
  z-index: 8;
}
```

Leave `.player-panel { position: relative; z-index: 8; }` in place.

## Verification

Select a streamer and confirm:

- The dark READY overlay dims the bottom dock background.
- The two bottom player panels remain fully visible above the dim layer.
- The READY banner still renders above the roster.
- `npm.cmd exec astro check` passes.
- `npm.cmd run build` passes.
