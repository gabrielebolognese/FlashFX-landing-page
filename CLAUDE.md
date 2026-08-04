# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for **FlashFX** (a browser-based motion graphics editor hosted separately at `editor.flashfx.app`). This repo is the public landing site at `flashfx.app` only — there is no backend, no API routes, and no data layer. Every CTA links out to `https://editor.flashfx.app`.

## Commands

```bash
npm install        # node_modules is not checked in — required before anything else
npm run dev        # dev server on :3000
npm run build      # next build; `postbuild` auto-runs next-sitemap
npm run start      # serve the production build
npm run lint       # next lint (core-web-vitals)
npm run typecheck  # tsc --noEmit
```

There are no tests and no test runner configured.

`next.config.js` sets `eslint.ignoreDuringBuilds: true`, so a green `npm run build` proves nothing about lint or types — run `npm run lint` and `npm run typecheck` explicitly before considering a change done.

Deployment is Netlify (`netlify.toml`, `@netlify/plugin-nextjs`, publish `.next`). `next-sitemap.config.js` regenerates `public/sitemap.xml`, `public/sitemap-0.xml`, and `public/robots.txt` on every build; `SITE_URL` overrides the default `https://flashfx.app`.

## Stack

Next.js 13.5.1 App Router · React 18 · TypeScript (strict) · Tailwind · framer-motion · shadcn/ui (Radix) · three.js for shader backgrounds. Path alias `@/*` → repo root. `.env` exists but is empty; nothing reads env vars at runtime.

`next.config.js` also sets `images: { unoptimized: true }` (so `next/image` is layout-only, no optimization) and `transpilePackages: ['@paper-design/shaders']`.

## Architecture

### Page composition

`app/<slug>/page.tsx` is always a **server component** that does three things and nothing else:

1. Exports a `Metadata` object (title, description, keywords, openGraph, twitter, `alternates.canonical`).
2. Declares JSON-LD schema literals (`SoftwareApplication`, `FAQPage`, `BreadcrumbList`) and injects them via `next/script` with `type="application/ld+json"`.
3. Renders an ordered list of section components from `components/sections/<slug>/`.

All layout, animation, and copy live in the section components — pages hold no markup of their own. `app/after-effects-alternative/page.tsx` is the fullest example of the pattern.

Existing routes: `/`, `/after-effects-alternative`, `/free-motion-graphics-software`, `/lightweight-video-editor`, `/video-editing-software-for-beginners`. New SEO landing pages should follow the same shape and add a matching `components/sections/<slug>/` directory with a `<Prefix>Hero`, comparison/proof sections, `<Prefix>FAQSection`, and `<Prefix>FinalCTA`.

**FAQ copy is duplicated by design**: the `faqSchema` literal in `page.tsx` and the `*FaqData` array in the FAQ section component contain the same question/answer text verbatim. Editing one without the other silently desyncs the structured data from the visible page. Always update both.

### Section components

Everything under `components/sections/` is `'use client'` and follows the same idiom: a `<section>` with an optional `id` anchor, framer-motion `initial` / `whileInView` / `viewport={{ once: true }}` reveals, and Tailwind `fx-*` tokens. Long content lists (animation presets, editable properties, FAQ entries) are extracted into sibling `.ts` data files rather than inlined into JSX.

### Loading gate

`lib/loading-context.tsx` → `components/PageLoader.tsx` → `components/sections/Hero.tsx` form one coupled system, wired in `app/layout.tsx` via `BodyWrapper`:

- A full-screen overlay animates a fake progress bar to 90%, then finishes only once **both** `window.load` has fired **and** `videosReady` is true (6s safety timeout regardless).
- `videosReady` flips when `markVideoReady()` has been called `VIDEO_TARGET` (currently **5**) times. Callers are the YouTube `<iframe onLoad>` in `components/sections/VideoPlaceholder.tsx` and the shorts embeds in `WhatIsFlashFX.tsx`.
- `Hero` renders nothing until `isLoaded` is true, so its shader background and text only start after the overlay fades.

Adding or removing YouTube embeds on the homepage changes how many `markVideoReady()` calls ever arrive. If that count drops below 5 the loader hangs until the 6s fallback fires on every visit — keep `VIDEO_TARGET` in sync with the actual embed count.

`ContentGate` (exported from `BodyWrapper.tsx`) is currently a pass-through; it exists as a hook point for gating content behind the loader.

### Design tokens

Raw hex values live as CSS custom properties in `app/globals.css` (`--color-bg-base`, `--color-accent-yellow`, …) and are surfaced to Tailwind as `fx-*` utilities in `tailwind.config.ts` (`bg-fx-bg-surface`, `text-fx-text-secondary`, `border-fx-border`, …). Prefer the `fx-*` classes over hex literals.

Two global rules in `globals.css` bite easily:

- **`h1` has a hardcoded gradient with `-webkit-text-fill-color: transparent`.** Any `text-*` color class on an `h1` is invisible. Components that need a solid-color heading (e.g. `Hero`) work around this by styling a `motion.h1` with explicit inline styles.
- `* { @apply border-fx-border }` sets the default border color globally; `h1, h2, h3` are forced to the Cormorant display font. `h2.section-heading` gets a gradient underline via `::after`.

Four fonts are loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS variables: `--font-cormorant` (display/headings), `--font-outfit` (`font-sans`, body), `--font-jetbrains` (`font-mono`), `--font-lexend`. Existing components mostly apply these through inline `style={{ fontFamily: 'var(--font-…)' }}` rather than the Tailwind font classes — match whichever the surrounding file uses.

### Component library — two overlapping systems

`components/ui/` mixes generated shadcn/ui primitives with hand-written FlashFX components, and **names collide**:

- `components/ui/button.tsx` / `card.tsx` — shadcn/Radix, CVA variants, `cn()` from `lib/utils`.
- `components/ui/fx-button.tsx` / `fx-card.tsx` — bespoke, also export `Button` and `Card`, with a completely different variant API (`primary | secondary | outline`).

Check the import path before assuming which `Button` a file means. `.bolt/ignore` marks `components/ui/*` and `hooks/use-toast.ts` as generated — prefer adding new bespoke components as `fx-*` files or under `components/sections/` rather than editing shadcn primitives.

Shader/visual-effect components (`shader-animation.tsx`, `web-gl-shader.tsx`, `shader-lines.tsx`, `elegant-shapes.tsx`, `spotlight*.tsx`) are heavy client components. Note `shader-lines.tsx` injects three.js from a CDN `<script>` at runtime while the others `import * as THREE from 'three'` — don't assume one approach.

## Known loose ends

Useful context before "fixing" something that looks broken:

- The `Navbar` Features dropdown scrolls to `#dual-timeline` and `#share-projects`, but `DualTimeline.tsx` and `ShareProjects.tsx` are not rendered on any page — those two entries are dead links. `ProblemSection.tsx` and `TrollSection.tsx` are likewise unreferenced.
- `components/layout/Footer.tsx` links to many routes that don't exist yet (`/pricing`, `/blog`, `/features`, `/download`, `/changelog`, `/flashfx-vs-capcut`, `/flashfx-vs-davinci`, `/motion-graphics-software-for-youtube`, …). Only the five routes listed above are implemented.
- `@supabase/supabase-js` is a dependency but is imported nowhere.
- Several `public/` assets have spaces and `copy` suffixes in their filenames (e.g. `/android-chrome-192x192 copy.png`, referenced by `PageLoader`). Renaming them requires updating the referencing components.
- Large `.mp4` and screenshot files sit at the repo root, unreferenced by any component (the served copies are in `public/`).

## Conventions from `.bolt/prompt`

This project was scaffolded from the Bolt `nextjs-shadcn` template; its standing instructions still apply:

- Add `"use client"` at the top of any component using `useState`/`useEffect`.
- Do not introduce additional UI-theme or icon packages — use Tailwind, shadcn/ui, and `lucide-react` (including for logos).
- Avoid patterns that trigger `Warning: Extra attributes from the server: class,style` hydration mismatches.
