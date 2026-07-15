# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bren Aviador's personal portfolio — a single-page, editorial one-pager built with Vite + React 19 + TypeScript, deployed to GitHub Pages. There is no backend and no routing; the whole site is one scrolling page assembled in `src/App.tsx`.

## Commands

Package manager is **pnpm** (CI uses `--frozen-lockfile`).

- `pnpm dev` — local dev server
- `pnpm build` — `tsc -b` typecheck + `vite build`, then copies `dist/index.html` to `dist/404.html` (the SPA 404 fallback for GitHub Pages)
- `pnpm lint` — oxlint (not ESLint)
- `pnpm test` — vitest, single run
- `pnpm test:watch` — vitest in watch mode
- Run one test file: `pnpm exec vitest run src/lib/ascii.test.ts`
- Filter by name: `pnpm exec vitest run -t 'gridSize'`

Vitest only picks up `src/**/*.test.ts` and runs in the `node` environment (no jsdom) — tests cover pure logic, not components.

## Architecture

**Content lives in `src/data/`, not in components.** Each section (Experience, Projects, Awards, About, Contact) reads a typed array/object from `src/data/*.ts` and maps over it. To change what the site *says*, edit the data files; components are presentation only. `profile.ts` holds identity/contact/about/tech and is consumed by the Masthead and Contact.

**Section structure.** `App.tsx` renders `Nav`, `Masthead`, then a `<main>` of content sections, then `Contact`. Content sections wrap their body in the shared `Section` component (`id` + `label` → anchor + heading), which is what `Nav`'s in-page links target.

**ASCII portrait is the one piece of real logic.** `src/lib/ascii.ts` is pure, tested, and framework-free: luminance → character-ramp mapping and grid sizing. `AsciiPortrait.tsx` runs that logic at runtime — it loads the image, draws it to an offscreen canvas, reads pixels, and renders the ASCII in a `<pre>`; hover/focus cross-fades to the real photo. **To swap the portrait, replace `public/headshot.jpg` — nothing else changes.** The `charAspect` constant (0.6) in `gridSize` matches IBM Plex Mono's cell ratio so the ASCII isn't stretched; changing the portrait font means revisiting that number. Keep `ascii.ts` pure and covered by `ascii.test.ts`.

**Styling is a single hand-written `src/styles.css`** driven by CSS custom properties (design tokens: `--paper`, `--ink`, `--serif/sans/mono`, spacing) defined in `:root`. No CSS framework, no CSS modules. Fonts are self-hosted via `@fontsource` and imported in `main.tsx`.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`: it runs `pnpm test` and `pnpm build`, then publishes `dist/` to GitHub Pages. A failing test blocks the deploy. `dist/` is gitignored and built in CI — don't commit it.
