# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response format — applies to every reply

End **every** response with a `## Recap` section, no exceptions — answers to questions, not just code changes. Two parts, both short:

- **Done:** what changed or what was established, in one or two lines.
- **Next:** the concrete next actions as a numbered list, each one specific enough to act on without re-reading the conversation (name the file, the milestone, or the command). Where the next step is a FIX.md milestone, name it by ID and title.

If nothing is outstanding, write `Next: nothing outstanding` explicitly rather than dropping the section. If the next step is blocked on a decision, list the question instead of a task. This section is what gets read first when picking the work back up — keep it scannable and never pad it.

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

**The Netlify build command must stay `npm run build`.** Sitemap generation hangs off the `postbuild` script, and npm only fires `pre`/`post` lifecycle scripts for scripts invoked through `npm run`. `netlify.toml` previously ran `npx next build`, which calls the `next` binary directly and skips `postbuild` — so `next-sitemap` never ran in production and Netlify shipped whatever stale sitemap was committed to `public/`. Fixed 2026-08-05. Any change to that command reintroduces a silent, invisible failure: the build stays green and the sitemap just stops tracking reality.

## Working from FIX.md

`FIX.md` is the launch-readiness plan and the source of truth for outstanding work: a `## Progress` table of milestones M1–M8, a `## Canonical facts` block, and per-milestone Files / Changes / Acceptance criteria / Verify sections. M1–M5 are `DONE`; M6 (dead internal links), M7 (asset cleanup), and M8 (launch verification) are not.

`/next-milestone` (`.claude/commands/next-milestone.md`) loads the next unfinished milestone and briefs it without writing code; the user replies `code` to implement it. When implementing, stay inside the milestone's declared scope and update **both** its `**Status:**` line and its row in the `## Progress` table on completion.

**Never invent facts about the founder, company, team, funding, or metrics.** Everything factual comes from FIX.md's *Canonical facts*. If a fact is not there, stop and ask. FIX.md also tracks open questions that block specific milestones.

## Stack

Next.js 13.5.1 App Router · React 18 · TypeScript (strict) · Tailwind · framer-motion · shadcn/ui (Radix) · three.js for shader backgrounds. Path alias `@/*` → repo root. `.env` exists but is empty; nothing reads env vars at runtime.

`next.config.js` also sets `images: { unoptimized: true }` (so `next/image` is layout-only — no WebP conversion, no resizing; image weight is managed by hand) and `transpilePackages: ['@paper-design/shaders']`.

## Architecture

### Page composition

`app/<slug>/page.tsx` is always a **server component** that does three things and nothing else:

1. Exports a `Metadata` object (title, description, keywords, openGraph, twitter, `alternates.canonical`).
2. Declares JSON-LD schema literals (`SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `HowTo`, and the entity `@graph`) and emits them.
3. Renders an ordered list of section components from `components/sections/<slug>/`.

All layout, animation, and copy live in the section components — pages hold no markup of their own. `app/after-effects-alternative/page.tsx` is the fullest example of the pattern.

Existing routes: `/`, `/about`, `/after-effects-alternative`, `/free-motion-graphics-software`, `/lightweight-video-editor`, `/video-editing-software-for-beginners`. New SEO landing pages should follow the same shape and add a matching `components/sections/<slug>/` directory with a `<Prefix>Hero`, comparison/proof sections, `<Prefix>FAQSection`, and `<Prefix>FinalCTA`.

`app/page.tsx` declares **no metadata of its own** — the homepage inherits the block in `app/layout.tsx` verbatim (title, robots, canonical, social cards). Editing that block edits the homepage.

### SEO invariants — these break silently

**JSON-LD uses a plain `<script>` tag with `dangerouslySetInnerHTML`, never `next/script`.** `next/script` defers the tag into the RSC payload and injects it after hydration, so it never reaches the server-rendered HTML where crawlers look. Every schema block on this site was invisible for exactly this reason until it was fixed (FIX.md M2). There are currently zero `next/script` imports in `app/` — keep it that way.

**The entity graph is load-bearing.** `/` and `/about` both emit an `Organization` ↔ `Person` `@graph`. The `@id` values (`https://flashfx.app/#organization`, `https://gabrielebolognese.blog/#person`) must stay byte-identical across both pages *and* match what [gabrielebolognese.blog](https://gabrielebolognese.blog) emits, or the graphs resolve as unrelated nodes. `sameAs` matching is string-exact: do not normalise `www`, do not add or strip trailing slashes, do not reorder the arrays. Standalone nodes like `SoftwareApplication` tie in via `author`/`publisher` `@id` references. The canonical block is in FIX.md under *The entity graph (verbatim)*.

**The footer carries `rel="me"`.** The "Built by Gabriele Bolognese" link in `components/layout/Footer.tsx` is the reciprocal identity signal, rendered outside the `footerLinks` map because that map's renderer hardcodes `rel="noopener noreferrer"`. Dropping `me` from the `rel` looks like a harmless edit and silently removes it.

**No rating markup.** `aggregateRating`, `Review`, and star ratings are not used anywhere and must not be added. First-party rating markup with no verifiable review source risks a manual action.

**Social cards come from `lib/seo.ts`.** Next.js merges metadata shallowly — a page declaring its own `openGraph` or `twitter` object replaces the layout's wholesale rather than merging into it, so the image has to be repeated on every page that defines those keys. Import `OG_IMAGES` from `@/lib/seo` rather than re-declaring image objects, so the six copies cannot drift.

**FAQ copy is duplicated by design**: the `faqSchema` literal in `page.tsx` and the FAQ data in the section component contain the same question/answer text verbatim. Editing one without the other silently desyncs the structured data from the visible page. Always update both.

### Motion — `lib/motion`

`immersionmilestones.md` is the plan for making the site feel alive; I1 built the system that governs it. Import from `@/lib/motion`.

**`repeat: Infinity` (or CSS `animation-iteration-count: infinite`) written directly in a component is a bug.** It runs while the section is off screen, it ignores `prefers-reduced-motion` unless the author remembered, and nothing can measure or stop it. P4 and P6 both existed to go back and fix exactly that. Continuous animation goes through `useAmbient()`, which watches the element, claims a slot from a governor capped at 6 concurrent loops, and returns `active`.

- **The unit is one ambient system, not one element.** A backdrop with 24 animated paths takes *one* slot and shares it down the tree via `<AmbientProvider active={active}>` / `useAmbientActive()`. Registering per element would leave 40 shapes fighting over 6 slots and freezing at random.
- **`active: false` means hold a still frame, never render nothing.** A background that vanishes when the cap is spent looks broken.
- **Priority displaces.** Decoration is `priority: 0`; motion that *is* the point of a section should outrank it, and the governor rebalances automatically when a loop scrolls away.
- Use the `duration` / `loop` / `ease` tokens rather than inventing a timing. Reduced motion is resolved inside `useAmbient`, so components must not check it again.
- `setLoopCap(0)` in a console stops all ambient motion sitewide; `loopStats()` reports registered/visible/running. `lib/motion/governor.ts` is deliberately framework-free so the policy can be tested with plain node.

`typewriter.tsx` and `shape-landing-hero.tsx` still contain raw `repeat: Infinity`. Both are dead code reaching zero built chunks — don't treat them as precedent.

**Borders**: `components/ui/beam-border.tsx` (I2) puts a travelling light on an element's edge. Drop `<BeamBorder />` inside anything `relative` with a border radius. **Default to `trace`** (hover-driven, ungoverned, costs nothing idle) — there are 183 of those and only **1** `ambient` on the whole site, which is the point: `ambient` and `pulse` run continuously and take a governor slot, so they're for the two or three elements that genuinely earn the attention. `trace` requires `group` on the host, since the hover selector keys off it. `SectionSeam` is the divider sweep; it fires from an IntersectionObserver, never on mount.

### Section components

Everything under `components/sections/` is `'use client'` and follows the same idiom: a `<section>` with an optional `id` anchor, framer-motion `initial` / `whileInView` / `viewport={{ once: true }}` reveals, and Tailwind `fx-*` tokens. Long content lists are extracted into sibling `.ts` data files (`fmgFaqData.ts`, `lightweightFaqData.ts`, `beginnerFaqData.ts`, and the three files in `feature-highlights/`) — though the homepage `FAQSection.tsx` and `after-effects-alternative/AEFAQSection.tsx` still inline theirs.

### Splash overlay and media loading

**This was rebuilt on 2026-08-06** (see `performancemilestones.md` P1 and P2). The previous design — a loading context gating first paint on `window.load` plus five YouTube `onLoad` events — is gone, along with `lib/loading-context.tsx` and `components/BodyWrapper.tsx`. Anything describing `VIDEO_TARGET`, `videosReady`, `markVideoReady`, `ContentGate` or `usePageLoaded` is stale.

- `components/PageLoader.tsx` is a **server component with no JavaScript**. The fade is a CSS animation (`.fx-splash` in `globals.css`, 520 ms), so it begins at first paint, needs no hydration, and cannot hang waiting on anything. It is `pointer-events: none` from the first frame and collapses to 1 ms under `prefers-reduced-motion: reduce`. Timing lives in the CSS, not the component.
- `Hero` renders unconditionally. It previously returned `null` until the overlay finished, which kept the LCP element out of the DOM for the whole load. **Do not reintroduce a gate there.**
- YouTube embeds in `VideoPlaceholder.tsx` and `WhatIsFlashFX.tsx` create their iframe only when an IntersectionObserver (`rootMargin: 400px`) reports the section approaching. Server HTML contains **zero iframes** on every route — worth preserving, and easy to check with `grep -c "<iframe" .next/server/app/index.html`.
- `components/ui/lazy-youtube.tsx` implements the same idea and is used by `SolutionSection`, `LoadTime` and `SplitHero`. Prefer it for new embeds.

`app/layout.tsx` now renders `PageLoader`, `Navbar`, `children` and `Footer` directly, with no client-component wrapper around the tree.

### Design tokens

Raw hex values live as CSS custom properties in `app/globals.css` (`--color-bg-base`, `--color-accent-yellow`, …) and are surfaced to Tailwind as `fx-*` utilities in `tailwind.config.ts` (`bg-fx-bg-surface`, `text-fx-text-secondary`, `border-fx-border`, …). Prefer the `fx-*` classes over hex literals.

Two global rules in `globals.css` bite easily:

- **`h1` has a hardcoded gradient with `-webkit-text-fill-color: transparent`.** Any `text-*` color class on an `h1` is invisible. Components that need a solid-color heading (e.g. `Hero`) work around this by styling a `motion.h1` with explicit inline styles, or by using a `<span>`.
- `* { @apply border-fx-border }` sets the default border color globally; `h1, h2, h3` are forced to the Cormorant display font. `h2.section-heading` gets a gradient underline via `::after`.

**Three** fonts are loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS variables: `--font-cormorant` (display, `font-display`), `--font-outfit` (`font-sans`, body and UI), `--font-jetbrains` (`font-mono`). Existing components mostly apply these through inline `style={{ fontFamily: 'var(--font-…)' }}` rather than the Tailwind font classes — match whichever the surrounding file uses.

A fourth family, Lexend, was removed in `performancemilestones.md` P7 and folded into Outfit — it was a second geometric sans doing Outfit's job, and one of its usages was the homepage `<h1>`, the LCP element. **Do not reintroduce `--font-lexend` or the `font-lexend` Tailwind class**; both are gone. Outfit is a variable font, so 400/500/700 all come from one file — adding a weight to it is free, adding one to Cormorant is not.

Only Outfit is preloaded (`preload: false` on the other two), because above the fold on the homepage nothing else is used. Note that **you cannot verify font preloading from a build made on Windows** — Next's font-manifest plugin matches module requests with a forward slash, so on Windows the manifest comes out empty and the HTML has zero preload tags. Count `.next/static/media/*.p.woff2` instead (expect 1), or check the deployed HTML.

Hero `<h1>`s set `fontFamily: 'Georgia, var(--font-cormorant), serif'` inline in 35 components. Georgia is a system font and costs nothing, but is absent on Android and most Linux — the Cormorant link is what those platforms fall back to, so **keep it in the stack** rather than trimming back to `Georgia, serif`.

### Component library — two overlapping systems

`components/ui/` mixes generated shadcn/ui primitives with hand-written FlashFX components, and **names collide**:

- `components/ui/button.tsx` / `card.tsx` — shadcn/Radix, CVA variants, `cn()` from `lib/utils`.
- `components/ui/fx-button.tsx` / `fx-card.tsx` — bespoke, also export `Button` and `Card`, with a completely different variant API (`primary | secondary | outline`).

Check the import path before assuming which `Button` a file means. `.bolt/ignore` marks `components/ui/*` and `hooks/use-toast.ts` as generated — prefer adding new bespoke components as `fx-*` files or under `components/sections/` rather than editing shadcn primitives.

Shader/visual-effect components (`shader-animation.tsx`, `web-gl-shader.tsx`, `shader-lines.tsx`, `elegant-shapes.tsx`, `spotlight*.tsx`) are heavy client components. Note `shader-lines.tsx` injects three.js from a CDN `<script>` at runtime while the others `import * as THREE from 'three'` — don't assume one approach.

## Known loose ends

Useful context before "fixing" something that looks broken. Most of these are owned by FIX.md M6/M7 — check there before fixing one ad hoc.

- The `Navbar` Features dropdown scrolls to `#dual-timeline` and `#share-projects`, but `DualTimeline.tsx` and `ShareProjects.tsx` are not rendered on any page — those two entries are dead links. `ProblemSection.tsx` and `TrollSection.tsx` are likewise unreferenced. FIX.md open question 9 asks whether to mount the sections or drop the dropdown entries.
- `components/layout/Footer.tsx` links to ~18 routes that don't exist: `/features`, `/pricing`, `/download`, `/changelog`, `/roadmap`, `/blog`, `/faq`, `/status`, `/careers`, `/brand`, `/privacy`, `/terms`, `/security`, `/motion-graphics-software-for-youtube`, `/flashfx-vs-capcut`, `/flashfx-vs-davinci`. Only the six routes listed above are implemented (M6).
- `@supabase/supabase-js` is a dependency but is imported nowhere.
- Several `public/` assets have spaces and `copy` suffixes in their filenames (e.g. `/android-chrome-192x192 copy.png`, referenced by `PageLoader`). Renaming them requires updating the referencing components (M7).
- Large `.mp4` and screenshot files sit at the repo root, unreferenced by any component — the served copies are in `public/` (M7). Note `public/Screenshot_2026-03-01_183521.png` is the live OG image referenced by `lib/seo.ts`: the root-level duplicate is disposable, the `public/` copy is not.

## Conventions from `.bolt/prompt`

This project was scaffolded from the Bolt `nextjs-shadcn` template; its standing instructions still apply:

- Add `"use client"` at the top of any component using `useState`/`useEffect`.
- Do not introduce additional UI-theme or icon packages — use Tailwind, shadcn/ui, and `lucide-react` (including for logos).
- Avoid patterns that trigger `Warning: Extra attributes from the server: class,style` hydration mismatches.
