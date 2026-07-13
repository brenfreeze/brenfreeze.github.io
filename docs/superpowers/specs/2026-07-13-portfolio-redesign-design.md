# Portfolio Redesign — Editorial Margin-Notes Layout

**Date:** 2026-07-13
**Repo:** brenfreeze.github.io (GitHub Pages user site)
**Status:** Approved by Bren

## Goal

Replace the current single-file Tailwind-CDN `index.html` with a rebuilt portfolio:

- Design: minimal warm-paper monotone, editorial "margin-notes" resume layout.
  Type: Instrument Serif (display) × IBM Plex Sans (body) × IBM Plex Mono
  (labels, dates, ASCII). Derived from Bren's "Web Developer Portfolio Design"
  direction in Claude Design (the page itself was not syncable; the two synced
  design-system projects, Modernist and Nocturne, were earlier candidates and
  are not used).
- Stack: Vite + React + TypeScript, built to static files, deployed to GitHub
  Pages via GitHub Actions.
- Signature element: a dynamic ASCII-art headshot converted from a real photo
  at runtime; swapping the photo requires only replacing one file.
- Content refreshed from resume v6 (adds EMAPTA as current role).

## Architecture

- Vite + React + TypeScript scaffold at the repo root. Vite's `index.html`
  replaces the current static page. App code in `src/`.
- **Styling:** hand-rolled CSS with custom properties in a single global
  stylesheet (`src/styles.css`). Tokens for paper/ink colors, type scale,
  spacing, rule opacity. No Tailwind, no CSS-in-JS.
- **Fonts:** self-hosted via `@fontsource` packages — Instrument Serif 400
  (+italic), IBM Plex Sans 400/500, IBM Plex Mono 400/500. No external font
  requests.
- **Content as typed data:** `src/data/experience.ts`, `src/data/projects.ts`,
  `src/data/awards.ts`, plus `src/data/profile.ts` (name, tagline, links,
  email). Components render from data; copy edits never touch markup.
- **Deployment:** `.github/workflows/deploy.yml` — on push to `master`:
  `npm ci` → `npm test` → `vite build` → `actions/upload-pages-artifact` →
  `actions/deploy-pages`. One-time repo setting: Pages source = GitHub Actions
  (via `gh api`). Base path `/` (user site).

## Design tokens

- Paper `#faf7f2`, ink `#1c1a17`. Monotone: hierarchy from type and spacing,
  not color. Muted ink = ink at reduced opacity mixes.
- Hairline rules: 1px, ink at ~15% opacity, between sections.
- Reading column ~62ch; mono margin column ~10rem on the left.
- `:focus-visible` styled (2px ink outline, offset); `::selection` tinted;
  no default blue rings.

## Page composition (top → bottom)

Two-column CSS grid `[margin 10rem][main minmax(0, 62ch)]`, centered.
Below 720px: single column; margin notes become small mono labels above their
blocks.

1. **Nav** — whisper-quiet mono anchor links (about / experience / projects /
   contact), top of page.
2. **Masthead** — "Bren Aviador" large in Instrument Serif;
   "Software Engineer — Las Piñas, PH" in mono beneath; ASCII portrait to the
   right (stacks above name on mobile).
3. **About** — margin label `ABOUT`; two short prose paragraphs (tightened from
   current site); current tech list in mono (JavaScript/TypeScript, React &
   React Native, Next.js, Node.js, Tailwind CSS, Redux).
4. **Experience** — margin column carries mono date ranges; main column: role +
   company in serif, 1–2 sentence description in Plex Sans. Entries:
   - EMAPTA Philippines — Senior Software Engineer, Aug 2025—present
   - KMC Mag Solutions (Sesimi) — Senior Front End Developer / Design
     Engineer, Oct 2024—Jul 2025
   - Robinsons Retail — Senior Frontend Web Developer, May 2024—Sep 2024
   - AHGLAB Consulting — Lead Frontend Web Developer, Mar 2021—Apr 2024
   - Lean Factory Technologies — Web Developer, Aug 2020—Jan 2021
   - White Cloak Technologies — Software Engineer, Apr 2018—May 2020
   - "Earlier" — one condensed entry covering the Botbros AI and Innovative
     Thinker internships, 2017—2018
5. **Projects** — an index, not cards: name (serif italic, linked where a URL
   exists) — em-dash — one-liner; margin shows year/company tag in mono.
   Ten projects: Enta, Collo PH, Doon PH, Zzagl Corporate Web, SagiPinas,
   Zing at Ayala Malls, Airship Riders, Petpal, Project Tempo (no link),
   GetGo Pay.
6. **Awards** — compact list, margin label `AWARDS`: Champion Angat.io
   HAngathon 2019 (SagiPinas); Champion WC Hack 2019 (Project Tempo);
   Leadership Award, Computer Studies Day 2018; Best in Web Programming,
   Computer Studies Day 2018.
7. **Contact / footer** — short serif invitation line; `brenfreeze@gmail.com`
   as the CTA; GitHub (`brenfreeze`) + LinkedIn (`bren-aviador`) in mono.

## ASCII portrait component

`<AsciiPortrait src="/headshot.jpg" columns={72} />`

- **Source photo:** `public/headshot.jpg`. Swapping the headshot = replacing
  that one file. Initial file: downloaded from the Cloudinary URL in the
  current site.
- **Conversion:** load image → draw to offscreen canvas at `columns × rows`
  (rows derived from image aspect ratio and the mono glyph's ~2:1
  height:width) → read pixel luminance per cell → map to character ramp
  ` .:;+*#@` → render as `<pre>` in IBM Plex Mono, ink on paper.
- **Pure core:** luminance→character mapping and grid sizing live in
  `src/lib/ascii.ts` as pure functions (unit-tested). The React component is a
  thin canvas/image-loading wrapper.
- **Hover:** cross-fades to the real photograph on hover/focus; disabled under
  `prefers-reduced-motion` (photo shown on focus/tap without animation).
- **Fallback:** if the image fails to load, render a typographic "BA" block of
  the same dimensions so layout never shifts.

## Error handling

- Missing/failed headshot → "BA" fallback block (above).
- Font loading uses `font-display: swap` fallback stacks (Georgia/serif,
  system sans, monospace).
- No runtime data fetching — all content is compiled in; no loading or error
  states beyond the image.

## Testing & verification

- Vitest unit tests for `src/lib/ascii.ts` (ramp mapping, grid sizing,
  luminance math).
- CI runs `npm test` and `vite build` before deploy; a broken build never
  ships.
- Manual verification via `npm run dev` / `vite preview`: layout at 360px,
  720px, 1200px; ASCII portrait renders and hover-reveals; anchors scroll.

## Out of scope

- Blog, CMS, dark mode, analytics, contact form (mailto only).
- Multi-page routing — this stays a one-pager.
