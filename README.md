# FlashFX — Landing Page

Marketing site for [FlashFX](https://flashfx.app), a browser-based motion
graphics and video editor built as an alternative to After Effects and Premiere
Pro. Free tier, no install.

This repo is the public landing site only. The editor itself lives at
[editor.flashfx.app](https://editor.flashfx.app) and is a separate application —
there is no backend, no API route, and no data layer here.

**Live:** https://flashfx.app

---

## Stack

| | |
|---|---|
| Framework | Next.js 13.5.1 (App Router) |
| Language | TypeScript, strict |
| UI | React 18, Tailwind CSS, shadcn/ui (Radix) |
| Animation | framer-motion, three.js (shader backgrounds) |
| Hosting | Netlify (`@netlify/plugin-nextjs`) |
| Sitemap | `next-sitemap`, generated on every build |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build; `postbuild` regenerates the sitemap |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |

> `next.config.js` sets `eslint.ignoreDuringBuilds: true`, so a green build does
> **not** mean lint or types pass. Run `npm run lint` and `npm run typecheck`
> explicitly before shipping.

There are no tests and no test runner configured.

## Routes

| Route | |
|---|---|
| `/` | Homepage |
| `/about` | Company and founder page |
| `/after-effects-alternative` | Comparison landing page |
| `/free-motion-graphics-software` | Comparison landing page |
| `/lightweight-video-editor` | Comparison landing page |
| `/video-editing-software-for-beginners` | Comparison landing page |

## Structure

```
app/<slug>/page.tsx        Server component: Metadata + JSON-LD + section list
components/sections/       Page sections, grouped by route
components/ui/             shadcn/ui primitives + bespoke fx-* components
lib/                       cn() helper, loading context
public/                    Static assets, generated sitemap and robots.txt
```

Every page follows the same shape: a server component that exports a `Metadata`
object, declares its JSON-LD, and renders an ordered list of section components.
No markup lives in `page.tsx` itself. `app/after-effects-alternative/page.tsx` is
the fullest example.

## Conventions worth knowing before you edit

These are the things that break quietly.

**JSON-LD must use a plain `<script>` tag, never `next/script`.** `next/script`
defers the tag into the RSC payload and injects it after hydration, so it never
reaches the server-rendered HTML where crawlers look. Every schema block on this
site was invisible for exactly this reason until it was fixed.

**The entity graph is load-bearing.** `/` and `/about` both emit an
`Organization` ↔ `Person` graph whose `@id` values must stay byte-identical to
the ones [gabrielebolognese.blog](https://gabrielebolognese.blog) emits, or the
two graphs do not join. The `sameAs` URLs are string-exact: do not normalise
`www`, do not add or strip trailing slashes, do not reorder them.

**The footer carries `rel="me"`.** The "Built by Gabriele Bolognese" link is the
reciprocal identity signal. Dropping `me` from the `rel` while leaving
`noopener noreferrer` looks like a harmless edit and silently removes it.

**No rating markup.** `aggregateRating`, `Review`, and star ratings are not used
anywhere and should not be added. First-party rating markup with no verifiable
review source risks a manual action.

**`h1` has a global gradient** with `-webkit-text-fill-color: transparent`
(`app/globals.css`). Any `text-*` colour class on an `h1` is invisible — style
it inline or use a `<span>`, as the existing heroes do.

**Design tokens.** Colours live as CSS custom properties in `app/globals.css` and
are surfaced as `fx-*` Tailwind utilities (`bg-fx-bg-surface`,
`text-fx-text-secondary`, `border-fx-border`). Prefer those over raw hex.

**Images are unoptimised.** `next.config.js` sets `images: { unoptimized: true }`,
so `next/image` does layout only — no WebP conversion, no resizing. Image weight
is managed by hand.

## Deployment

Netlify builds with `npx next build` and publishes `.next` (see `netlify.toml`).
`next-sitemap` runs as a `postbuild` step and regenerates `public/sitemap.xml`,
`public/sitemap-0.xml`, and `public/robots.txt`. New routes are picked up
automatically — no manual sitemap editing.

`SITE_URL` overrides the default `https://flashfx.app` in
`next-sitemap.config.js`.

## Further docs

- **[CLAUDE.md](./CLAUDE.md)** — architecture notes and repo conventions
- **[FIX.md](./FIX.md)** — the launch-readiness plan: milestones, what is done,
  what is outstanding, and the open questions blocking each
