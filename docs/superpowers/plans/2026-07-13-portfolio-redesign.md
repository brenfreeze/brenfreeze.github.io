# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild brenfreeze.github.io as an editorial margin-notes portfolio (warm paper, Instrument Serif × IBM Plex Sans × IBM Plex Mono) in Vite + React + TypeScript with a runtime ASCII-art headshot, deployed to GitHub Pages via Actions.

**Architecture:** Single-page React app; content lives in typed data modules, presentation in small components, all styling in one token-driven global stylesheet. The ASCII portrait's math is a pure tested utility wrapped by a thin canvas component. CI builds and deploys static files to Pages.

**Tech Stack:** Vite (scaffolded with create-vite), React 19, TypeScript, pnpm, Vitest, @fontsource (Instrument Serif, IBM Plex Sans, IBM Plex Mono), GitHub Actions + actions/deploy-pages.

**User decisions (already made):**
- Design: warm-paper monotone editorial layout from the user's Claude Design direction — NOT the synced Modernist/Nocturne systems.
- Composition: margin-notes (mono margin column of dates/labels beside a ~62ch reading column).
- Stack: Vite + React + TS deployed to GitHub Pages via Actions (source stays on `master`).
- ASCII headshot: runtime canvas conversion of `public/headshot.jpg`; swapping the photo = replacing that file; hover reveals the real photo.
- Content refreshed from resume v6: EMAPTA current role (Aug 2025—), KMC ended Jul 2025, internships condensed into one "Earlier" entry; 10 projects.
- Spec: `docs/superpowers/specs/2026-07-13-portfolio-redesign-design.md` (approved).
- Scaffold with `pnpm create vite@latest` (not hand-written config); pnpm as the package manager (requested at execution handoff).

---

## File structure

```
index.html                      # Vite entry (replaces the old static page)
package.json / pnpm-lock.yaml / tsconfig*.json / vite.config.ts / eslint.config.js / .gitignore
public/headshot.jpg             # the swappable portrait photo
public/favicon.svg              # "BA" mark (Task 7)
.github/workflows/deploy.yml    # build + deploy to Pages (Task 8)
src/main.tsx                    # mount + font/style imports
src/styles.css                  # tokens + all styling
src/App.tsx                     # page composition
src/lib/ascii.ts                # pure ASCII conversion (tested)
src/lib/ascii.test.ts
src/components/AsciiPortrait.tsx
src/components/{Nav,Masthead,Section,About,Experience,Projects,Awards,Contact}.tsx
src/data/{profile,experience,projects,awards}.ts
```

---

### Task 1: Scaffold Vite + React + TypeScript project

**Goal:** A building, committable Vite+React+TS skeleton at the repo root — scaffolded with create-vite, managed with pnpm — replacing the old static index.html.

**Files:**
- Create (scaffolded): `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`, `.gitignore`, `src/*`
- Modify: `index.html` (template entry, retitled — replaces the old static page)
- Create: `src/styles.css`; replace template `src/App.tsx`, `src/main.tsx`

**Acceptance Criteria:**
- [ ] `pnpm build` exits 0 and produces `dist/index.html`
- [ ] `pnpm dev` serves a page rendering "Bren Aviador"
- [ ] `node_modules/` and `dist/` are git-ignored

**Verify:** `pnpm build` → `✓ built in …`, `dist/index.html` exists

**Steps:**

- [ ] **Step 1: Scaffold with create-vite and merge into the repo root**

create-vite prompts interactively when the target directory is non-empty, so scaffold into a temp dir and merge:

```bash
cd /Users/bren/brenfreeze.github.io
pnpm create vite@latest tmp-scaffold --template react-ts
rsync -a tmp-scaffold/ ./
rm -rf tmp-scaffold
```

Note: `rsync` overwrites the old static `index.html` with the template entry — intended; the old page stays in git history.

- [ ] **Step 2: Install dependencies**

```bash
pnpm install
pnpm add @fontsource/instrument-serif @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
pnpm add -D vitest
```

- [ ] **Step 3: Remove template boilerplate**

```bash
rm -rf src/App.css src/index.css src/assets public/vite.svg
```

- [ ] **Step 4: Replace `index.html`** (full file)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bren Aviador — Software Engineer</title>
    <meta
      name="description"
      content="Bren Aviador is a software engineer in Metro Manila building web products with React, Next.js and TypeScript."
    />
    <meta name="theme-color" content="#faf7f2" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Replace `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Replace `src/App.tsx` and create `src/styles.css`**

`src/App.tsx`:

```tsx
export function App() {
  return <main>Bren Aviador</main>
}
```

`src/styles.css`:

```css
/* tokens + component styles arrive in Task 2 */
```

- [ ] **Step 7: Add vitest to `vite.config.ts`** (full file)

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 8: Add test scripts to `package.json`** (keep the template's `"build": "tsc -b && vite build"`)

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 9: Verify and commit**

Run: `pnpm build`
Expected: `✓ built in …` and `dist/index.html` exists.

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript app (create-vite, pnpm)"
```

---

### Task 2: Design tokens, fonts and the full stylesheet

**Goal:** The complete token-driven stylesheet (paper/ink, type, margin-notes grid, portrait, responsive collapse) plus self-hosted font imports.

**Files:**
- Modify: `src/styles.css` (full content below)
- Modify: `src/main.tsx` (font imports)

**Acceptance Criteria:**
- [ ] Fonts load locally (network tab shows /node_modules or bundled woff2, no external font hosts)
- [ ] `pnpm build` exits 0
- [ ] Body renders in IBM Plex Sans on `#faf7f2` paper

**Verify:** `pnpm build` → exits 0; `pnpm dev` → page shows warm paper background

**Steps:**

- [ ] **Step 1: Add font imports to `src/main.tsx`** (above `./styles.css`)

```tsx
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
```

- [ ] **Step 2: Replace `src/styles.css` with the full stylesheet**

```css
/* ————— tokens ————— */
:root {
  --paper: #faf7f2;
  --ink: #1c1a17;
  --ink-soft: rgba(28, 26, 23, 0.74);
  --ink-faint: rgba(28, 26, 23, 0.52);
  --rule: rgba(28, 26, 23, 0.15);
  --serif: 'Instrument Serif', Georgia, 'Times New Roman', serif;
  --sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
  --note-col: 10rem;
  --gap: 2.5rem;
  --measure: 62ch;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 1rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: rgba(28, 26, 23, 0.14);
}

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

a {
  color: inherit;
  text-decoration-color: var(--ink-faint);
  text-underline-offset: 3px;
}
a:hover {
  text-decoration-color: var(--ink);
}

.page {
  max-width: calc(var(--note-col) + var(--gap) + var(--measure));
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
}

/* ————— nav ————— */
.nav {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  font-family: var(--mono);
  font-size: 0.8125rem;
  padding-block: 0.75rem 3rem;
}
.nav a {
  text-decoration: none;
  color: var(--ink-soft);
}
.nav a:hover {
  color: var(--ink);
  text-decoration: underline;
}

/* ————— masthead ————— */
.masthead {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--gap);
  align-items: end;
  padding-bottom: 3.5rem;
}
.masthead h1 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(3rem, 9vw, 5.25rem);
  line-height: 1.02;
  letter-spacing: -0.015em;
  margin: 0;
}
.masthead .tagline {
  font-family: var(--mono);
  font-size: 0.875rem;
  color: var(--ink-soft);
  margin: 1.25rem 0 0;
}

/* ————— ascii portrait ————— */
.portrait {
  position: relative;
  margin: 0;
  line-height: 0;
}
.portrait pre {
  font-family: var(--mono);
  font-size: 5.5px;
  line-height: 1;
  letter-spacing: 0;
  margin: 0;
  color: var(--ink);
  user-select: none;
}
.portrait-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.45s ease;
}
.portrait:hover .portrait-photo,
.portrait:focus .portrait-photo,
.portrait:focus-within .portrait-photo {
  opacity: 1;
}
.portrait-fallback {
  display: grid;
  place-items: center;
  width: 14rem;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--rule);
  font-family: var(--serif);
  font-size: 4rem;
  line-height: 1;
}

/* ————— sections ————— */
.section {
  padding-block: 2.5rem;
}
.section-head {
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.5rem;
  margin-bottom: 1.75rem;
}
.section-head h2 {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: var(--note-col) minmax(0, 1fr);
  gap: 0.25rem var(--gap);
  padding-block: 0.875rem;
}
.note {
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--ink-faint);
  margin: 0;
  padding-top: 0.3rem; /* optically aligns mono notes with serif titles */
}

.entry h3 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.2;
  margin: 0;
}
.entry h3 .company {
  color: var(--ink-soft);
}
.entry p {
  margin: 0.5rem 0 0;
  color: var(--ink-soft);
  max-width: 58ch;
}

/* ————— about ————— */
.about p {
  margin: 0 0 1rem;
  color: var(--ink-soft);
}
.tech-list {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--ink-soft);
}

/* ————— projects ————— */
.project-line {
  margin: 0;
}
.project-line .name {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.3125rem;
}
.project-line .blurb {
  color: var(--ink-soft);
}

/* ————— footer / contact ————— */
.footer .invite {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 2rem;
  line-height: 1.25;
  margin: 0 0 1.25rem;
  max-width: 24ch;
}
.footer .links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-family: var(--mono);
  font-size: 0.875rem;
}
.footer .colophon {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--ink-faint);
  margin: 2.5rem 0 0;
}

/* ————— responsive ————— */
@media (max-width: 45rem) {
  .masthead {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .portrait {
    order: -1;
  }
  .row {
    grid-template-columns: 1fr;
  }
  .note {
    padding-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .portrait-photo {
    transition: none;
  }
}
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm build`
Expected: exits 0.

```bash
git add src/main.tsx src/styles.css
git commit -m "feat: add design tokens, fonts and full stylesheet"
```

---

### Task 3: Typed content data modules

**Goal:** All page content (profile, experience, projects, awards) as typed data, refreshed from resume v6.

**Files:**
- Create: `src/data/profile.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/awards.ts`

**Acceptance Criteria:**
- [ ] `pnpm exec tsc -b` exits 0 (all modules typecheck strictly)
- [ ] Experience lists EMAPTA (2025—now) first and a condensed "Earlier" internships entry last
- [ ] Projects contains 10 entries; Project Tempo has no URL

**Verify:** `pnpm exec tsc -b` → exits 0

**Steps:**

- [ ] **Step 1: Write `src/data/profile.ts`**

```ts
export const profile = {
  name: 'Bren Aviador',
  role: 'Software Engineer',
  location: 'Las Piñas, PH',
  email: 'brenfreeze@gmail.com',
  github: 'https://github.com/brenfreeze',
  linkedin: 'https://linkedin.com/in/bren-aviador',
  about: [
    "I'm a software engineer based in Las Piñas, Philippines. My path into web development started with curiosity about how things work, and turned into a career of shipping interfaces that are functional and enjoyable to use.",
    "I've built augmented-reality tools, e-commerce platforms, real-estate marketplaces and brand-management systems — and along the way led teams, mentored developers and taught at a bootcamp.",
  ],
  tech: [
    'TypeScript / JavaScript',
    'React & React Native',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'Redux',
  ],
}
```

- [ ] **Step 2: Write `src/data/experience.ts`**

```ts
export interface Experience {
  dates: string
  role: string
  company: string
  description: string
}

export const experience: Experience[] = [
  {
    dates: '2025—now',
    role: 'Senior Software Engineer',
    company: 'EMAPTA Philippines · Makati',
    description:
      "Building software for global clients as part of EMAPTA's engineering teams.",
  },
  {
    dates: '2024—25',
    role: 'Design Engineer',
    company: 'KMC Mag Solutions (Sesimi) · Pasig',
    description:
      "Built user-centric platforms with CSS, responsive design and React on Sesimi's brand-management platform — dynamic marketing templates, animated content and EDMs, bridging brand guidelines and engineering.",
  },
  {
    dates: '2024',
    role: 'Senior Frontend Web Developer',
    company: 'Robinsons Retail · Quezon City',
    description:
      'Developed e-commerce sites for business units across the Robinsons group with Next.js, Redux, Ant Design and UmiJS.',
  },
  {
    dates: '2021—24',
    role: 'Lead Frontend Web Developer',
    company: 'AHGLAB Consulting · Makati',
    description:
      "Led frontend development across real-estate products built on Next.js and Tailwind CSS, and taught in the company's first tech bootcamp.",
  },
  {
    dates: '2020—21',
    role: 'Web Developer',
    company: 'Lean Factory Technologies · Pasig',
    description:
      'Built augmented-reality solutions for human performance support in factories.',
  },
  {
    dates: '2018—20',
    role: 'Software Engineer',
    company: 'White Cloak Technologies · Pasig',
    description:
      'Translated wireframes into production frontends for Zing at Ayala Malls, Petpal and GetGo Pay with React, growing into full-stack work on Node.js.',
  },
  {
    dates: '2017—18',
    role: 'Earlier — internships',
    company: 'Botbros AI · Innovative Thinker',
    description:
      'Web development internship across Laravel, Vue and React (including Airship Riders in React Native), and a .NET/MSSQL GIS grant tracker.',
  },
]
```

- [ ] **Step 3: Write `src/data/projects.ts`**

```ts
export interface Project {
  name: string
  blurb: string
  url?: string
  tag: string
}

export const projects: Project[] = [
  { name: 'Enta', blurb: 'One marketplace, everything real estate.', url: 'https://enta.ph/', tag: 'AHGLAB' },
  { name: 'Collo PH', blurb: 'Manage your properties the easiest way.', url: 'https://collo.ph/', tag: 'AHGLAB' },
  { name: 'Doon PH', blurb: 'Rent a car and enjoy the journey.', url: 'https://doon.ph/', tag: 'AHGLAB' },
  { name: 'Zzagl Corporate Web', blurb: 'Connecting businesses to customers through in-app booking.', url: 'https://zzagl.me/', tag: 'AHGLAB' },
  { name: 'SagiPinas', blurb: 'A disaster-risk response platform for a safer country.', url: 'https://sagipinas.nplixel.now.sh/', tag: 'HAngathon 2019' },
  { name: 'Zing at Ayala Malls', blurb: 'Discovery platform for shoppers at Ayala Malls.', url: 'https://www.ayalamalls.com/', tag: 'White Cloak' },
  { name: 'Airship Riders', blurb: 'Real-time package handoffs from hub to rider to client.', url: 'https://www.airship.me/', tag: 'Airship' },
  { name: 'Petpal', blurb: 'A social community for pet lovers.', url: 'https://petpal.whitecloak.com/home', tag: 'White Cloak' },
  { name: 'Project Tempo', blurb: 'A simple, elegant time logger.', tag: 'WC Hack 2019' },
  { name: 'GetGo Pay', blurb: 'A prepaid mobile banking app with rewards.', url: 'https://www.getgopay.com.ph/login/email', tag: 'White Cloak' },
]
```

- [ ] **Step 4: Write `src/data/awards.ts`**

```ts
export interface Award {
  year: string
  text: string
}

export const awards: Award[] = [
  { year: '2019', text: 'Champion — Angat.io HAngathon, for SagiPinas' },
  { year: '2019', text: 'Champion — WC Hack, for Project Tempo' },
  { year: '2018', text: 'Leadership Award — Computer Studies Day' },
  { year: '2018', text: 'Best in Web Programming — Computer Studies Day' },
]
```

- [ ] **Step 5: Verify and commit**

Run: `pnpm exec tsc -b`
Expected: exits 0.

```bash
git add src/data/
git commit -m "feat: add typed content data from resume v6"
```

---

### Task 4: ASCII conversion utility with tests (TDD)

**Goal:** Pure, unit-tested luminance→character conversion and grid sizing in `src/lib/ascii.ts`.

**Files:**
- Create: `src/lib/ascii.ts`
- Test: `src/lib/ascii.test.ts`

**Acceptance Criteria:**
- [ ] `pnpm test` passes all tests
- [ ] Black maps to `@`, white to space; transparent pixels render as paper (space)
- [ ] `gridSize` halves rows to compensate for ~2:1 mono glyph aspect

**Verify:** `pnpm test` → all tests pass

**Steps:**

- [ ] **Step 1: Write the failing tests — `src/lib/ascii.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_RAMP,
  asciiFromPixels,
  charForLuminance,
  gridSize,
  luminance,
} from './ascii'

describe('luminance', () => {
  it('is 0 for black and 255 for white', () => {
    expect(luminance(0, 0, 0)).toBe(0)
    expect(luminance(255, 255, 255)).toBeCloseTo(255)
  })

  it('weights green heaviest, blue lightest', () => {
    expect(luminance(0, 255, 0)).toBeGreaterThan(luminance(255, 0, 0))
    expect(luminance(255, 0, 0)).toBeGreaterThan(luminance(0, 0, 255))
  })
})

describe('charForLuminance', () => {
  it('maps dark to the densest character', () => {
    expect(charForLuminance(0)).toBe('@')
  })

  it('maps light to space', () => {
    expect(charForLuminance(255)).toBe(' ')
  })

  it('stays inside the ramp for every luminance', () => {
    for (let l = 0; l <= 255; l++) {
      expect(DEFAULT_RAMP.includes(charForLuminance(l))).toBe(true)
    }
  })
})

describe('gridSize', () => {
  it('keeps the requested column count', () => {
    expect(gridSize(800, 1000, 72).cols).toBe(72)
  })

  it('halves rows to compensate for tall mono glyphs', () => {
    expect(gridSize(100, 100, 80).rows).toBe(40)
  })

  it('never returns fewer than 1 row', () => {
    expect(gridSize(10000, 1, 10).rows).toBe(1)
  })
})

describe('asciiFromPixels', () => {
  it('renders a black/white 2×1 strip as dense char + space', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255])
    expect(asciiFromPixels(data, 2, 1)).toBe('@ ')
  })

  it('joins rows with newlines', () => {
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,
      255, 255, 255, 255,
    ])
    expect(asciiFromPixels(data, 1, 2)).toBe(' \n ')
  })

  it('treats transparent pixels as paper', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 0])
    expect(asciiFromPixels(data, 1, 1)).toBe(' ')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./ascii`.

- [ ] **Step 3: Write the implementation — `src/lib/ascii.ts`**

```ts
/** Characters from lightest (paper) to densest (ink). */
export const DEFAULT_RAMP = ' .:;+*#@'

/** Rec. 709 relative luminance on 0–255 channel values. */
export function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Dark pixels get dense characters; light pixels fade to paper. */
export function charForLuminance(lum: number, ramp: string = DEFAULT_RAMP): string {
  const idx = Math.floor((1 - lum / 255) * ramp.length)
  return ramp[Math.max(0, Math.min(ramp.length - 1, idx))]
}

/**
 * Character-grid dimensions for an image. `charAspect` is the width:height
 * ratio of a mono glyph (~0.5), so rows are halved to keep proportions.
 */
export function gridSize(
  imgWidth: number,
  imgHeight: number,
  columns: number,
  charAspect = 0.5,
): { cols: number; rows: number } {
  const rows = Math.max(1, Math.round((imgHeight / imgWidth) * columns * charAspect))
  return { cols: columns, rows }
}

/** Convert RGBA pixel data (cols × rows) into an ASCII string. */
export function asciiFromPixels(
  data: Uint8ClampedArray,
  cols: number,
  rows: number,
  ramp: string = DEFAULT_RAMP,
): string {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      if (data[i + 3] < 128) {
        line += ' '
        continue
      }
      line += charForLuminance(luminance(data[i], data[i + 1], data[i + 2]), ramp)
    }
    lines.push(line)
  }
  return lines.join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add tested ASCII conversion utility"
```

---

### Task 5: AsciiPortrait component + headshot asset

**Goal:** A React component that converts `public/headshot.jpg` to ASCII at runtime, cross-fades to the photo on hover/focus, and falls back to a "BA" block.

**Files:**
- Create: `src/components/AsciiPortrait.tsx`
- Create: `public/headshot.jpg` (downloaded)

**Acceptance Criteria:**
- [ ] Portrait renders as ASCII characters in the browser
- [ ] Hover/focus reveals the real photo
- [ ] Renaming headshot.jpg away shows the "BA" fallback without layout errors
- [ ] `pnpm build` exits 0

**Verify:** `pnpm build` → exits 0; manual check in `pnpm dev`

**Steps:**

- [ ] **Step 1: Download the current headshot into `public/`**

```bash
mkdir -p public
curl -fL -o public/headshot.jpg 'https://res.cloudinary.com/dhafrnevh/image/upload/v1752062681/B86CCA8A-EC0C-4E94-8E8B-E97683366BB1_1_105_c_swcjck.jpg'
```

Expected: `public/headshot.jpg` exists and is a JPEG (`file public/headshot.jpg`).

- [ ] **Step 2: Write `src/components/AsciiPortrait.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { asciiFromPixels, gridSize } from '../lib/ascii'

interface AsciiPortraitProps {
  src: string
  columns?: number
}

/**
 * Renders `src` as ASCII art (converted at runtime via canvas).
 * Hover or focus cross-fades to the real photograph.
 * Swap the portrait by replacing the image file — nothing else changes.
 */
export function AsciiPortrait({ src, columns = 72 }: AsciiPortraitProps) {
  const [ascii, setAscii] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = src
    img.onload = () => {
      if (cancelled) return
      const { cols, rows } = gridSize(img.naturalWidth, img.naturalHeight, columns)
      const canvas = document.createElement('canvas')
      canvas.width = cols
      canvas.height = rows
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        setFailed(true)
        return
      }
      ctx.drawImage(img, 0, 0, cols, rows)
      const { data } = ctx.getImageData(0, 0, cols, rows)
      setAscii(asciiFromPixels(data, cols, rows))
    }
    img.onerror = () => {
      if (!cancelled) setFailed(true)
    }
    return () => {
      cancelled = true
    }
  }, [src, columns])

  if (failed) {
    return (
      <div className="portrait portrait-fallback" aria-hidden="true">
        BA
      </div>
    )
  }

  return (
    <figure className="portrait" tabIndex={0}>
      <pre aria-hidden="true">{ascii ?? ''}</pre>
      <img className="portrait-photo" src={src} alt="Portrait of Bren Aviador" />
    </figure>
  )
}
```

- [ ] **Step 3: Wire it into the placeholder App for a visual check**

Replace `src/App.tsx`:

```tsx
import { AsciiPortrait } from './components/AsciiPortrait'

export function App() {
  return (
    <main className="page">
      <AsciiPortrait src="/headshot.jpg" columns={72} />
    </main>
  )
}
```

(Task 6 replaces this with the full page composition.)

- [ ] **Step 4: Verify**

Run: `pnpm dev` — portrait renders as ink characters on paper; hovering fades in the photo.
Run: `pnpm build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add public/headshot.jpg src/components/AsciiPortrait.tsx src/App.tsx
git commit -m "feat: add runtime ASCII portrait with hover reveal"
```

---

### Task 6: Page sections and composition

**Goal:** The full editorial page — nav, masthead, about, experience, projects, awards, contact — rendered from the data modules.

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Masthead.tsx`, `src/components/Section.tsx`, `src/components/About.tsx`, `src/components/Experience.tsx`, `src/components/Projects.tsx`, `src/components/Awards.tsx`, `src/components/Contact.tsx`
- Modify: `src/App.tsx`

**Acceptance Criteria:**
- [ ] All sections render in order with margin-notes layout (dates/tags in the mono margin)
- [ ] Anchor nav scrolls to about / experience / projects / contact
- [ ] Layout collapses to a single column below 720px (notes above content)
- [ ] `pnpm build` exits 0

**Verify:** `pnpm build` → exits 0; manual check at 360px/720px/1200px in dev tools

**Steps:**

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```tsx
export function Nav() {
  return (
    <nav className="nav" aria-label="Site">
      <a href="#about">about</a>
      <a href="#experience">experience</a>
      <a href="#projects">projects</a>
      <a href="#contact">contact</a>
    </nav>
  )
}
```

- [ ] **Step 2: Write `src/components/Masthead.tsx`**

```tsx
import { profile } from '../data/profile'
import { AsciiPortrait } from './AsciiPortrait'

export function Masthead() {
  return (
    <header className="masthead">
      <div>
        <h1>{profile.name}</h1>
        <p className="tagline">
          {profile.role} — {profile.location}
        </p>
      </div>
      <AsciiPortrait src="/headshot.jpg" columns={72} />
    </header>
  )
}
```

- [ ] **Step 3: Write `src/components/Section.tsx`**

```tsx
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  label: string
  children: ReactNode
}

export function Section({ id, label, children }: SectionProps) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <h2>{label}</h2>
      </div>
      {children}
    </section>
  )
}
```

- [ ] **Step 4: Write `src/components/About.tsx`**

```tsx
import { profile } from '../data/profile'
import { Section } from './Section'

export function About() {
  return (
    <Section id="about" label="About">
      <div className="row">
        <div className="note" aria-hidden="true" />
        <div className="about">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <ul className="tech-list">
            {profile.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Write `src/components/Experience.tsx`**

```tsx
import { experience } from '../data/experience'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" label="Experience">
      {experience.map((job) => (
        <div className="row" key={`${job.company}-${job.dates}`}>
          <p className="note">{job.dates}</p>
          <div className="entry">
            <h3>
              {job.role} <span className="company">· {job.company}</span>
            </h3>
            <p>{job.description}</p>
          </div>
        </div>
      ))}
    </Section>
  )
}
```

- [ ] **Step 6: Write `src/components/Projects.tsx`**

```tsx
import { projects } from '../data/projects'
import { Section } from './Section'

export function Projects() {
  return (
    <Section id="projects" label="Projects">
      {projects.map((project) => (
        <div className="row" key={project.name}>
          <p className="note">{project.tag}</p>
          <p className="project-line">
            {project.url ? (
              <a className="name" href={project.url} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            ) : (
              <span className="name">{project.name}</span>
            )}
            <span className="blurb"> — {project.blurb}</span>
          </p>
        </div>
      ))}
    </Section>
  )
}
```

- [ ] **Step 7: Write `src/components/Awards.tsx`**

```tsx
import { awards } from '../data/awards'
import { Section } from './Section'

export function Awards() {
  return (
    <Section id="awards" label="Awards">
      {awards.map((award) => (
        <div className="row" key={award.text}>
          <p className="note">{award.year}</p>
          <p className="project-line">
            <span className="blurb">{award.text}</span>
          </p>
        </div>
      ))}
    </Section>
  )
}
```

- [ ] **Step 8: Write `src/components/Contact.tsx`**

```tsx
import { profile } from '../data/profile'

export function Contact() {
  return (
    <footer className="section footer" id="contact">
      <div className="section-head">
        <h2>Contact</h2>
      </div>
      <div className="row">
        <div className="note" aria-hidden="true" />
        <div>
          <p className="invite">Always open to new opportunities and collaborations — say hello.</p>
          <div className="links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
          </div>
          <p className="colophon">
            Designed &amp; built by Bren Aviador · set in Instrument Serif, IBM Plex Sans &amp; Mono
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 9: Compose the page — replace `src/App.tsx`**

```tsx
import { About } from './components/About'
import { Awards } from './components/Awards'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Masthead } from './components/Masthead'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'

export function App() {
  return (
    <div className="page">
      <Nav />
      <Masthead />
      <main>
        <About />
        <Experience />
        <Projects />
        <Awards />
      </main>
      <Contact />
    </div>
  )
}
```

- [ ] **Step 10: Verify**

Run: `pnpm build`
Expected: exits 0.

Run: `pnpm dev` — check all sections render, anchors scroll, and the layout collapses to one column at 360px (device toolbar).

- [ ] **Step 11: Commit**

```bash
git add src/components/ src/App.tsx
git commit -m "feat: compose editorial margin-notes page from content data"
```

---

### Task 7: Meta tags, favicon, 404 fallback

**Goal:** Publication hygiene — OG tags, an SVG favicon, and a 404.html copy for Pages.

**Files:**
- Modify: `index.html` (favicon link + OG tags)
- Create: `public/favicon.svg`
- Modify: `package.json` (build script copies 404.html)

**Acceptance Criteria:**
- [ ] `dist/404.html` exists after build and equals `dist/index.html`
- [ ] Favicon renders in the browser tab
- [ ] OG title/description/url present in built HTML

**Verify:** `pnpm build && diff dist/index.html dist/404.html` → exits 0, no diff output

**Steps:**

- [ ] **Step 1: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#faf7f2"/>
  <text x="32" y="43" font-family="Georgia, serif" font-size="30" text-anchor="middle" fill="#1c1a17">BA</text>
</svg>
```

- [ ] **Step 2: Add favicon + OG tags to `index.html` `<head>`** (after the description meta)

```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:title" content="Bren Aviador — Software Engineer" />
    <meta
      property="og:description"
      content="Bren Aviador is a software engineer in Metro Manila building web products with React, Next.js and TypeScript."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://brenfreeze.github.io/" />
```

- [ ] **Step 3: Update the build script in `package.json`**

```json
    "build": "tsc -b && vite build && cp dist/index.html dist/404.html",
```

- [ ] **Step 4: Verify and commit**

Run: `pnpm build && diff dist/index.html dist/404.html`
Expected: build exits 0; diff prints nothing.

```bash
git add index.html public/favicon.svg package.json
git commit -m "feat: add favicon, OG tags and 404 fallback"
```

---

### Task 8: GitHub Actions deploy to Pages

**Goal:** Every push to `master` tests, builds and deploys the site to GitHub Pages; the live site serves the new portfolio.

**Files:**
- Create: `.github/workflows/deploy.yml`

**Acceptance Criteria:**
- [ ] Repo Pages source is set to "GitHub Actions" (`build_type: workflow`)
- [ ] Workflow run on `master` completes green (test → build → deploy)
- [ ] `curl -s https://brenfreeze.github.io/` returns HTML containing "Bren Aviador" and the Vite asset bundle (not the old Tailwind CDN page)

**Verify:** `gh run watch` → success; `curl -s https://brenfreeze.github.io/ | grep -c 'assets/index'` → ≥ 1

**Steps:**

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Switch the repo's Pages source to GitHub Actions**

```bash
gh api repos/brenfreeze/brenfreeze.github.io/pages -X PUT -f build_type=workflow
```

Expected: exits 0 (silent or JSON echo). If it 404s (Pages record missing), create it:
`gh api repos/brenfreeze/brenfreeze.github.io/pages -X POST -f build_type=workflow`

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages via Actions"
git push origin master
```

- [ ] **Step 4: Watch the run and verify the live site**

```bash
gh run watch --exit-status
curl -s https://brenfreeze.github.io/ | grep -o 'Bren Aviador — Software Engineer'
curl -s https://brenfreeze.github.io/ | grep -c 'assets/index'
```

Expected: run succeeds; title string prints; asset grep ≥ 1 (proves the Vite build is live, not the old page).

Note: Pages CDN can cache for a few minutes — if the old page is served, retry with `curl -s "https://brenfreeze.github.io/?nocache=$(date +%s)"`.

---

## Self-review

- **Spec coverage:** tokens/fonts (T2), margin-notes layout + all seven page sections (T6), typed data incl. EMAPTA/Earlier (T3), ASCII utility + tests (T4), portrait component + swap-one-file + hover + fallback (T5), meta/favicon/404 (T7), CI test-before-build deploy + Pages setting (T8). Out-of-scope items untouched. ✓
- **Placeholders:** none — every step carries full file content or exact commands. ✓
- **Type consistency:** `asciiFromPixels/gridSize/charForLuminance/luminance` names match between T4 and T5; data interfaces match component usage (`Experience.dates/role/company/description`, `Project.tag/url?`, `Award.year/text`, `profile.about/tech`). ✓
