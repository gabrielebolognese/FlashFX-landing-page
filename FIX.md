# FIX.md — Launch Readiness Plan

Ordered remediation plan for flashfx.app, derived from the full site audit of
2026-08-03. Work top to bottom. Each milestone is self-contained: it lists the
files it touches, the exact change, and how to verify it.

**Primary objective:** make Google treat `flashfx.app` and
`gabrielebolognese.blog` as one connected entity graph, with Gabriele Bolognese
established as founder and CEO of FlashFX. Everything else is launch hygiene
that protects that objective.

**Explicitly out of scope** (your call, 2026-08-03): the YouTube embed strategy
and the `PageLoader` gate. The 13 homepage iframes and the loading overlay stay
as they are. Milestone M8 is the only place they are mentioned, and only as a
deferred note — do not touch them.

---

## Progress

| Milestone | Title | Status |
|---|---|---|
| M1 | Build the `/about` page | DONE |
| M2 | Entity graph JSON-LD on the homepage | DONE |
| M3 | Fix the footer | DONE |
| M4 | Remove unverifiable trust signals | IN_PROGRESS |
| M5 | Close the metadata gaps | NOT_STARTED |
| M6 | Kill every dead internal link | NOT_STARTED |
| M7 | Asset cleanup | NOT_STARTED |
| M8 | Launch verification | NOT_STARTED |

Statuses: `NOT_STARTED` → `IN_PROGRESS` → `DONE`. Update both this table and the
milestone's own `Status:` line when a milestone completes.

---

## Canonical facts

Single source of truth for every milestone below. Do not invent, embellish, or
round anything here. If a milestone needs a fact that is not on this list, stop
and ask.

- **Founder:** Gabriele Bolognese — born 6 December 2008, Italian, based in
  Rovigo, Veneto, Italy. Role: **founder and CEO**.
- **FlashFX founded:** `2024-01-01`
- **Co-founder:** Aziz, joined January 2026. *(Surname unknown — see M1 blockers.)*
- **Marketing manager:** Camille Luciano
- **Users: 8,000.** **Discord members: 3,400.** These exact figures, nothing
  larger. The legacy "15,000+" figure is wrong. *(Audit note: no user or member
  count appears anywhere on the site today, so there is nothing to correct —
  only a rule to obey if numbers get added.)*
- **FlashFX X account:** `https://x.com/FlashFXeditor`
- **Product:** browser-based motion graphics and video editing; an alternative
  to After Effects and Premiere Pro; free tier; no install.
- **Personal site:** `https://gabrielebolognese.blog`
- **Verified logo URL:** `https://flashfx.app/android-chrome-192x192.png`
  — confirmed live 2026-08-03, 200 OK, PNG, 192×192, 13.1 KB. Clears Google's
  ≥112×112 minimum for `Organization.logo`.

### The entity graph (verbatim — do not reformat)

This block is emitted on **both** `/` and `/about`. The `@id` values must match
what gabrielebolognese.blog already emits, or the two graphs will not join. The
`sameAs` URLs are string-exact: **do not normalise `www`, do not strip or add
trailing slashes, do not reorder.**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://flashfx.app/#organization",
      "name": "FlashFX",
      "url": "https://flashfx.app",
      "logo": "https://flashfx.app/android-chrome-192x192.png",
      "foundingDate": "2024-01-01",
      "description": "FlashFX is a browser-based motion graphics and video editing platform, an alternative to After Effects and Premiere Pro.",
      "founder": { "@id": "https://gabrielebolognese.blog/#person" },
      "sameAs": ["https://x.com/FlashFXeditor"]
    },
    {
      "@type": "Person",
      "@id": "https://gabrielebolognese.blog/#person",
      "name": "Gabriele Bolognese",
      "url": "https://gabrielebolognese.blog",
      "jobTitle": "Founder & CEO",
      "worksFor": { "@id": "https://flashfx.app/#organization" },
      "sameAs": [
        "https://www.linkedin.com/in/gabriele-bolognese/",
        "https://github.com/gabrielebolognese",
        "https://www.youtube.com/@gabriele.bolognese",
        "https://www.instagram.com/logs.of.gabry/",
        "https://www.producthunt.com/@gabrielebolognese",
        "https://peerlist.io/gabrielebologne",
        "https://www.connectively.us/p/gabriele-bolognese"
      ]
    }
  ]
}
```

---

# PHASE A — Entity & identity

The actual SEO objective. M1–M3 are the whole reason this plan exists.

## M1 — Build the `/about` page

**Status:** DONE — 2026-08-03
**Priority:** highest. This is the single highest-leverage change on the domain.

> **Completed.** `/about` returns 200, names Gabriele Bolognese as founder and CEO
> in visible prose, carries the `rel="me"` link, and emits the entity graph as a
> real `<script type="application/ld+json">` tag in the server HTML. 447 words.
> The origin-story paragraph was **not** written — no source facts were supplied,
> so a marked insertion point was left in `FoundingTeam.tsx` instead of inventing
> one. See "Open questions" #1.

### Why

`https://flashfx.app/about` returns **HTTP 404** (verified live). The footer
links to it anyway. Meanwhile the domain names no human being anywhere — a
sitewide grep for `founder|founded|CEO|built by|Gabriele|Bolognese` returns zero
real hits. gabrielebolognese.blog claims "I founded FlashFX" and this domain
says nothing back. A one-directional claim from the smaller site carries almost
no entity weight. This page is the reciprocal half.

### Files

- **Create:** `app/about/page.tsx`
- **Create:** `components/sections/about/` — section components for the page
- **Read first:** `app/after-effects-alternative/page.tsx` (the canonical
  page-shape reference: `Metadata` export → JSON-LD via `next/script` → ordered
  section components)
- **Read first:** `components/sections/after-effects-alternative/PageHero.tsx`
  and `MigrationGuide.tsx` (prose section idiom, framer-motion reveal pattern)
- **Read first:** `CLAUDE.md` (page conventions, `fx-*` tokens, the `h1` gradient
  trap)

### Changes

1. Server component at `app/about/page.tsx`, matching the existing page shape
   exactly.
2. Full `Metadata` export: title, description, keywords, `openGraph`,
   `twitter`, `robots: { index: true, follow: true }`, and
   `alternates.canonical: 'https://flashfx.app/about'`.
3. Emit the entity `@graph` from *Canonical facts* above, via `next/script`
   with `id="entity-graph"` and `type="application/ld+json"`.
4. Also emit a `BreadcrumbList` (Home → About), matching the pattern the other
   four sub-pages already use.
5. Prose content, genuinely useful, no padding. Cover:
   - **What FlashFX is** — browser-based motion graphics and video editing, an
     alternative to After Effects and Premiere Pro, free tier, no install.
   - **Who builds it** — Gabriele Bolognese named in visible prose as **founder
     and CEO**; Aziz as co-founder (joined January 2026); Camille Luciano as
     marketing manager.
   - **How it started** — founded 1 January 2024. *See blockers.*
   - **Where it is now** — 8,000 users, 3,400 Discord members. Exact figures.
6. Link to `https://gabrielebolognese.blog` with **`rel="me"`** on the anchor.
   Use `rel="me noopener noreferrer"` with `target="_blank"` — `rel="me"` is the
   part that matters for identity consolidation and must not be dropped.
7. Follow the house style: `'use client'` on section components,
   framer-motion `whileInView` reveals, `fx-*` Tailwind tokens. Remember `h1`
   carries a global gradient with `-webkit-text-fill-color: transparent` — any
   `text-*` colour class on it is invisible.

### 🚧 Blockers — answer before this milestone can be finished

1. **The origin story.** Known: founded 2024-01-01, and Gabriele was 15 at the
   time. Unknown: what prompted it, what came before, why After Effects
   specifically. Two or three sentences of real history is enough.
   **Fallback if you would rather not supply it:** write the page from verified
   facts only and omit the narrative section entirely. The page still works —
   it is just less compelling to a human reader.
2. **Aziz's surname** — publish it, or leave as "Aziz"?
3. **Job titles for Aziz and Camille** — confirm "co-founder" and "marketing
   manager" are the titles they want in public prose.

### Acceptance criteria

- [ ] `/about` returns 200 and renders real content
- [ ] "Gabriele Bolognese" appears in visible prose as founder and CEO
- [ ] The `gabrielebolognese.blog` anchor carries `rel="me"` in rendered HTML
- [ ] JSON-LD parses, and `@id` values are byte-identical to the block above
- [ ] All seven `sameAs` URLs are byte-identical — `www` and trailing slashes intact
- [ ] Page reads as useful to a human, not a stub
- [ ] No invented facts

### Verify

```bash
npm run build && npm run start
# then: curl -s localhost:3000/about | grep -o 'rel="me[^"]*"'
# and paste the JSON-LD into https://validator.schema.org/
```

---

## M2 — Entity graph JSON-LD on the homepage

**Status:** DONE — 2026-08-03

> **Completed.** All 15 `next/script` JSON-LD blocks across the five existing
> pages converted to plain `<script>` tags; the site went from **0 to 18**
> `type="application/ld+json"` tags in server-rendered HTML. The homepage now
> carries the entity `@graph`, byte-identical to the copy on `/about` (verified
> by string comparison of the parsed objects), and its `SoftwareApplication`
> references the organization via `author` and `publisher`.
>
> Not done, deliberately out of scope: the `SoftwareApplication` nodes on the
> four sub-pages are still unlinked to the org `@id`. Adding the reference there
> would create a dangling `@id` on pages that do not define the Organization
> node. Worth revisiting only if the graph needs reinforcing.

### Why

The homepage is the strongest URL on the domain and currently carries no
`Organization` and no `Person` schema at all. No `@id` is used anywhere on the
site, so every existing schema block is a standalone island that cannot join a
graph.

### 🔴 Discovered during M1 — none of the existing structured data reaches the HTML

Every page uses `<Script>` from `next/script` to emit its JSON-LD. `next/script`
defers the tag into the RSC flight payload and injects it after hydration, so it
**never appears in the server-rendered HTML**. Verified 2026-08-03 against the
built output: `/`, `/after-effects-alternative`, and
`/free-motion-graphics-software` each ship **zero**
`<script type="application/ld+json">` tags.

Every schema block on this site — `SoftwareApplication`, `FAQPage`, every
`BreadcrumbList`, the `HowTo` — is currently invisible to any crawler that does
not execute and hydrate JavaScript. The Phase 1 audit confirmed these schemas
exist in source but did not check that they survive to the rendered page; they
do not.

The fix is a one-line swap per block: a plain `<script>` JSX tag instead of
`next/script`. In a server component it renders inline, which is what crawlers
need. This is what Next.js documentation recommends for JSON-LD. Already applied
to `/about` in M1.

### Files

- `app/page.tsx`
- `app/after-effects-alternative/page.tsx`
- `app/free-motion-graphics-software/page.tsx`
- `app/lightweight-video-editor/page.tsx`
- `app/video-editing-software-for-beginners/page.tsx`

### Changes

0. **Convert every `<Script>` JSON-LD block on all five pages to a plain
   `<script>` tag**, and drop the now-unused `next/script` imports. Without this,
   the entity graph added in step 1 would be just as invisible as everything
   else. Do this first, then verify with
   `grep -c 'type="application/ld+json"'` against the built HTML.
1. Add the entity `@graph` from *Canonical facts*, as a plain `<script>` block
   with `id="entity-graph"`, alongside the existing `software-schema` and
   `faq-schema` blocks. Same `@id` values as `/about` — that is the join.
2. Link the existing `SoftwareApplication` into the graph by adding:
   ```ts
   author: { '@id': 'https://flashfx.app/#organization' },
   publisher: { '@id': 'https://flashfx.app/#organization' },
   ```
   This is factually true (FlashFX authored FlashFX) and turns the isolated
   `SoftwareApplication` into a graph node.

> The `aggregateRating` currently inside that same `SoftwareApplication` object
> is removed in **M4**, not here. Keep the milestones separate so each is
> revertable on its own.

### Acceptance criteria

- [ ] All five pages emit their JSON-LD as real `<script>` tags in server HTML
- [ ] Homepage emits the `@graph` with `@id` values matching `/about` exactly
- [ ] `SoftwareApplication` references the organization `@id`
- [ ] Existing `FAQPage` markup still valid and unchanged
- [ ] Validates clean in the Rich Results Test

### Verify

```bash
npm run build && npm run start
# every page must report a non-zero count:
for p in "" after-effects-alternative free-motion-graphics-software \
         lightweight-video-editor video-editing-software-for-beginners about; do
  echo -n "/$p  "
  curl -s "http://localhost:3000/$p" | grep -c 'type="application/ld+json"'
done
# curl -s localhost:3000 | grep -c 'flashfx.app/#organization'   # expect >= 2
```

> Note: `pkill -f "next start"` does not reliably kill the server on Windows —
> a stale process will serve the old build and make a working fix look broken.
> Either stop node via PowerShell or serve on a fresh port (`npm run start -- -p 3005`).

---

## M3 — Fix the footer

**Status:** DONE — 2026-08-03

> **Completed.** "Built by Gabriele Bolognese" now sits in the footer bottom bar
> opposite the copyright, on all six pages, with
> `rel="me noopener noreferrer"`. Verified exactly one render inside the
> `<footer>` DOM per page — the second textual match in each file is the RSC
> flight payload, not a duplicate element. The `/about` footer link resolves 200.
>
> Rendered as standalone markup rather than through the `footerLinks` map: that
> map's renderer hardcodes `rel="noopener noreferrer"` with no way to express
> `rel="me"`. The data structure was left untouched.
>
> The 15 dead footer routes are untouched here — that is M6.

### Why

`components/layout/Footer.tsx:42` links to `/about`, which 404s. The footer is
also the natural, sitewide home for the founder attribution — it appears on
every page, which is exactly what you want a `rel="me"` link to do.

### Files

- `components/layout/Footer.tsx`

### Changes

1. `/about` now resolves (M1) — no href change needed, but confirm it renders
   via `next/link` and lands on the real page.
2. Add a visible attribution line near the copyright:
   **"Built by Gabriele Bolognese"**, linking to `https://gabrielebolognese.blog`
   with `rel="me"`.
   - The footer's link renderer branches on an `external` flag and hardcodes
     `rel="noopener noreferrer"`. It cannot currently emit `rel="me"`. Either
     extend the link shape with an optional `rel` field, or render the
     attribution as standalone markup outside the `footerLinks` map. Standalone
     is simpler and keeps the data structure untouched.
3. Style it to match: `text-fx-text-secondary`, `--font-outfit`, existing
   hover transition.

> Dead footer links are **M6**. This milestone only adds the attribution.

### Acceptance criteria

- [ ] `/about` reachable from the footer on every page
- [ ] "Built by Gabriele Bolognese" visible on every page
- [ ] That anchor's rendered HTML contains `rel="me"` — verify in the built
      output, not just the source
- [ ] Visually consistent with the existing footer

### Verify

```bash
curl -s localhost:3000 | grep -o 'rel="me[^"]*"[^>]*'
curl -s localhost:3000/lightweight-video-editor | grep -c 'gabrielebolognese.blog'
```

---

# PHASE B — Structured data hygiene

Protects the graph built in Phase A. Bad markup on the domain undermines the
entity signal you just established.

## M4 — Remove unverifiable trust signals

**Status:** IN_PROGRESS — schema work done 2026-08-04, content decisions pending

> **Done:**
> - All **five** `aggregateRating` blocks deleted. Verified: zero occurrences of
>   `aggregateRating` / `ratingValue` / `ratingCount` in source *and* in the
>   built HTML of all six pages. Every remaining schema still parses.
>   A comment marking why sits at each removal site so it does not creep back.
> - `softwareVersion: '2.0'` and `releaseNotes` removed from
>   `after-effects-alternative` and `free-motion-graphics-software`. Both were
>   unverifiable and neither is a required schema property. One line each to
>   restore with real values.
>
> **Pending a decision — not touched:**
> - **15 testimonials across 3 components** (scope is larger than the Phase 1
>   audit reported, which named only `SocialProof`):
>   - `components/sections/SocialProof.tsx` — 3, homepage
>   - `components/sections/lightweight-video-editor/HardwareTestimonials.tsx` — 6
>   - `components/sections/video-editing-for-beginners/BeginnerTestimonials.tsx` — 6
>
>   Deliberately left alone. There is no version control on this repo, so
>   deleting three visible sections is unrecoverable, and if the quotes are real
>   it destroys legitimate social proof. None are `Review` markup, so none carry
>   a penalty risk — the cost of waiting is low.
> - **"average results across 50 first-time users tested on each platform"** —
>   `LearningCurveComparison.tsx:140`. Unchanged pending confirmation the test
>   happened.
>
> **Also surfaced, belongs elsewhere:** `CreatorStories.tsx` ships a
> **"Video Coming Soon"** placeholder on the homepage, and two `VideoPlaceholder`
> instances on the homepage render **"Video coming soon"** because they have no
> `youtubeId`. Placeholder copy in production is a launch blocker — folded into
> M6's remit.

### Why

Your own constraint: *"Do not add fake reviews, ratings, or aggregateRating
markup. Google penalises self-serving rating markup and it is the fastest way to
lose rich results."* It is already on the site — five times.

### Files

- `app/page.tsx` (~line 34)
- `app/after-effects-alternative/page.tsx` (~line 63)
- `app/free-motion-graphics-software/page.tsx` (~line 63)
- `app/lightweight-video-editor/page.tsx` (~line 62)
- `app/video-editing-software-for-beginners/page.tsx` (~line 61)
- `components/sections/SocialProof.tsx` — *decision required*
- `components/sections/video-editing-for-beginners/LearningCurveComparison.tsx:140`
- `app/after-effects-alternative/page.tsx:71-72`

### Changes

1. **Delete all five `aggregateRating` blocks.** Identical in each file:
   ```ts
   aggregateRating: {
     '@type': 'AggregateRating',
     ratingValue: '4.8',
     ratingCount: '1247',
   },
   ```
   A first-party rating with no review source, on the entity's own site, is
   textbook self-serving markup and a live manual-action risk on the exact
   domain you are trying to build trust for.
2. **`softwareVersion: '2.0'` and `releaseNotes`** in
   `app/after-effects-alternative/page.tsx` — remove, or replace with the real
   version. **Ask before choosing.**
3. **Testimonials** — `SocialProof.tsx` attributes quotes to "Sarah Chen",
   "Marcus Johnson", "Elena Rodriguez". These read as placeholder personas.
   They are plain HTML, not `Review` markup, so there is no penalty risk — but
   fabricated testimonials sit badly on a site whose purpose is to establish a
   verifiable human identity. **Decision required:** real people (keep), or
   placeholders (cut the section)?
4. **"average results across 50 first-time users tested on each platform"**
   (`LearningCurveComparison.tsx:140`) — keep if the test happened, otherwise
   soften to a subjective assessment. **Ask.**

### Acceptance criteria

- [ ] Zero occurrences of `aggregateRating` sitewide
- [ ] Zero occurrences of `ratingValue` / `ratingCount` sitewide
- [ ] Remaining `SoftwareApplication` markup still valid
- [ ] Every unverifiable claim either substantiated or removed

### Verify

```bash
grep -rn "aggregateRating\|ratingValue\|ratingCount" app components   # expect nothing
```

---

## M5 — Close the metadata gaps

**Status:** NOT_STARTED

### Why

The homepage title is literally `FlashFX` — 7 characters, no keywords. Every
social share renders a blank card because `twitter.card` is
`summary_large_image` with no image defined anywhere on the site. And one schema
block points at an image that does not exist.

### Files

- `app/layout.tsx`
- `app/page.tsx`
- `app/after-effects-alternative/page.tsx:70`

### Changes

1. **Homepage title.** Currently `title: 'FlashFX'` in `app/layout.tsx`, and
   `app/page.tsx` exports no `metadata` at all. Give the homepage its own
   `metadata` export with a real title in the style of the sub-pages, e.g.
   *"FlashFX — Free Browser-Based Motion Graphics & Video Editor"*.
   **Confirm the exact wording before writing it.** Consider a `title.template`
   on the layout so future pages inherit a suffix.
2. **OG / Twitter image.** No image exists sitewide. Best available asset:
   `public/Screenshot_2026-03-01_183521.png` — 1872×955, 172 KB, aspect ratio
   1.96 against the ideal 1.905, so it renders correctly at 1200×630 without
   awkward cropping. It is already used as the schema `screenshot` on
   `/free-motion-graphics-software`, so reusing it is consistent.
   Add to both `openGraph.images` and `twitter.images` with explicit `width`,
   `height`, and `alt`. A purpose-made 1200×630 asset would be better — say the
   word and this becomes a follow-up instead.
3. **Explicit `robots`** on the homepage: `{ index: true, follow: true }`,
   matching the four sub-pages.
4. **Broken schema image.** `app/after-effects-alternative/page.tsx:70` reads
   `screenshot: 'https://flashfx.app/static/screenshot.png'`. There is no
   `public/static/` directory — this 404s. Point it at a real asset
   (`https://flashfx.app/Screenshot_2026-03-01_183521.png`) or drop the property.

### Acceptance criteria

- [ ] Homepage has a descriptive, keyword-bearing title
- [ ] `og:image` and `twitter:image` present and resolve 200
- [ ] Homepage declares `robots` explicitly
- [ ] No schema property points at a non-existent file
- [ ] All five pages still declare a canonical

### Verify

```bash
curl -s localhost:3000 | grep -E 'og:image|twitter:image|<title>'
curl -sI https://flashfx.app/Screenshot_2026-03-01_183521.png | head -1   # expect 200
```

---

# PHASE C — Site integrity

## M6 — Kill every dead internal link

**Status:** NOT_STARTED

### Why

The footer links to **15 routes that do not exist**. Only five routes exist
sitewide. Internal 404s at this density are a real crawl-budget drain and a
quality signal against the domain — directly counterproductive to Phase A.

### Files

- `components/layout/Footer.tsx`
- `components/Navbar.tsx` (lines 9–16)
- **Create:** `app/not-found.tsx`

### Changes

1. **Footer dead routes.** After M1, `/about` works. These 15 still 404:
   ```
   /careers   /brand    /privacy   /terms     /security
   /pricing   /download /changelog /roadmap
   /features#templates  /features#export
   /blog      /faq      /status
   /flashfx-vs-capcut   /flashfx-vs-davinci
   /motion-graphics-software-for-youtube
   ```
   Recommended handling, per link:
   - `/roadmap` → repoint to the existing `https://roadmap.flashfx.app`
   - `/faq` → repoint to the homepage anchor `/#faq` (that section exists)
   - `/pricing` → repoint to `/#pricing` (that section exists)
   - `/privacy`, `/terms` → **needed before launch.** Real pages, or remove the
     links. A product taking signups needs both. **Ask.**
   - everything else → remove until the page exists
2. **Navbar dead anchors.** The Features dropdown scrolls to `#dual-timeline`
   and `#share-projects`, but `DualTimeline.tsx` and `ShareProjects.tsx` are
   rendered on no page — both menu items silently do nothing. Either add the
   sections to `app/page.tsx` or drop the two entries. **Ask which.**
3. **Add `app/not-found.tsx`** — branded 404 with navigation back into the site,
   instead of the bare Next.js default.

### Acceptance criteria

- [ ] Every internal `href` resolves to a real route or a real anchor
- [ ] Navbar dropdown items all scroll to a section that exists
- [ ] A branded 404 page exists
- [ ] Privacy and terms resolved one way or the other

### Verify

```bash
npm run build && npm run start
# crawl every internal href and assert none return 404
```

---

## M7 — Asset cleanup

**Status:** NOT_STARTED

### Why

`public/` is ~14 MB, of which ~5 MB is deployed but never requested by any
component. Five `.mp4` files (~13 MB) sit in the repo root, served by nothing.

### Files

- `public/` and repo root

### Changes

1. **Delete unreferenced `public/` assets** — confirmed zero code references:
   - `fix.png` (3.39 MB)
   - `VISUALS2.png` (1.64 MB)
   - `a815522d626e471d2c3d01460a83051413884b0f.jpg` (50 KB)
2. **Move or delete root-level media** — not in `public/`, so never served:
   `spotify_player_animation.mp4` (8.5 MB), `newspaper_animation.mp4` (3.7 MB),
   `the_future_of_design.mp4`, `scattered_text.mp4`, and the five
   `Screenshot_2026-03-01_180920_-_Copy*.png` duplicates in the root.
   **Confirm these are not needed before deleting — they are not recoverable,
   as this is not a git repository.**
3. **Consider** deduplicating `android-chrome-192x192 copy.png`, which is
   byte-identical to `android-chrome-192x192.png`. Only `PageLoader.tsx`
   references the copy. Low value, non-zero risk — skip unless trivial.

### ⚠️ No version control

There is no `.git` directory. Deletions are permanent. Strongly consider
`git init` before this milestone — see M8.

### Acceptance criteria

- [ ] No unreferenced assets in `public/`
- [ ] Root-level media resolved
- [ ] Site builds and every image still renders

### Verify

```bash
npm run build && npm run start   # then walk every page, confirm no broken images
```

---

# PHASE D — Launch verification

## M8 — Launch verification

**Status:** NOT_STARTED

### Why

Nothing above counts as done until the built site actually serves it and the
structured data validates.

### Changes

1. **`git init`.** This project has no version control. Before launch, and
   ideally before M7's deletions, initialise a repo and make a baseline commit.
   Currently a mistake is unrecoverable.
2. **Full build:**
   ```bash
   npm install
   npm run lint
   npm run typecheck
   npm run build
   ```
   All three must pass. Note `next.config.js` sets
   `eslint.ignoreDuringBuilds: true`, so a green build proves nothing about lint
   or types — run them explicitly.

   **Known pre-existing failures (as of M1, 2026-08-03):** `npm run lint` exits 1
   with **13 `react/no-unescaped-entities` errors**, all pre-existing, none in
   code added by this plan. They are in `FMGComparisonTable.tsx`,
   `FMGFinalCTA.tsx`, `WhatMakesSoftwareFree.tsx`, `HardwareTestimonials.tsx`,
   `BeginnerTestimonials.tsx`, and `LearningCurveComparison.tsx` — raw `"` and
   `'` in JSX text. Each is a one-character fix (`&quot;` / `&apos;`). Clear them
   here so the lint gate is meaningful. `npm run typecheck` already passes clean.
   Note some of these files are also touched by M4's testimonial decision — if a
   section gets cut there, its lint errors go with it.
3. **Confirm the sitemap regenerated.** `postbuild` runs `next-sitemap`
   automatically. After the build, `public/sitemap-0.xml` must contain
   `https://flashfx.app/about`. It currently lists five URLs with a `lastmod` of
   2026-03-22.
4. **Serve and walk it:** `npm run start`, then load every route including
   `/about` and a deliberate 404.
5. **Validate structured data** — every page through
   `https://validator.schema.org/` and Google's Rich Results Test. Confirm the
   `Organization` ↔ `Person` `@id` cross-references resolve, and that zero
   `aggregateRating` remains.
6. **Verify `rel="me"`** appears in the *rendered* HTML of `/about` and the
   sitewide footer — server-rendered, not injected client-side, or crawlers may
   miss it.
7. **Post-deploy:** re-fetch `https://flashfx.app/about` and confirm 200. Submit
   the updated sitemap in Search Console and request indexing on `/about`.
   Entity consolidation is slow — expect weeks, not days.

### Deferred, not fixed — recorded so it is not forgotten

Per your instruction these are intentionally left alone:

- **`PageLoader` gates LCP.** A fixed full-screen overlay at `z-index: 9999`
  blocks first paint until both `window.load` fires and 5 video `onLoad` events
  land, with a 6-second hard fallback. `Hero` renders `null` until then. This
  likely fails LCP sitewide.
- **10 eager YouTube iframes** on the homepage (5 in `WhatIsFlashFX`, 5 in
  `VideoPlaceholder`). `LazyYouTube` already exists and already solves this —
  it is used correctly in `SolutionSection`, `LoadTime`, and `SplitHero`, just
  not in the other two. Note the coupling: `VIDEO_TARGET = 5` in
  `lib/loading-context.tsx` counts `onLoad` events from exactly those eager
  iframes, so making them lazy means reworking the loader gate.
- **Unoptimised images.** `next.config.js` sets `images: { unoptimized: true }`,
  so `2.png` (2.88 MB) and `fix copy.png` (1.89 MB) ship at full weight.

### Acceptance criteria

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass
- [ ] `public/sitemap-0.xml` contains `/about`
- [ ] Every route serves 200; 404s render the branded page
- [ ] All structured data validates with no errors
- [ ] `Organization` ↔ `Person` `@id` cross-references resolve
- [ ] Zero `aggregateRating` sitewide
- [ ] `rel="me"` present in server-rendered HTML
- [ ] Repo under version control

---

## Open questions blocking full completion

Consolidated from the milestones above. M1's first question is the only one that
blocks starting work.

1. **Origin story for `/about`** — two or three sentences of real history, or
   confirm the fallback (verified facts only, no narrative). **[M1]**
2. **Aziz's surname** — publish or omit? **[M1]**
3. **Titles for Aziz and Camille** — confirm "co-founder" and "marketing
   manager". **[M1]**
4. **Testimonials** — real people or placeholders? **[M4]**
5. **`softwareVersion: '2.0'`** — real, or remove? **[M4]**
6. **"50 first-time users tested"** — did that test happen? **[M4]**
7. **Homepage title** — exact wording. **[M5]**
8. **Privacy policy and terms of service** — write them, or remove the links
   before launch? **[M6]**
9. **`DualTimeline` and `ShareProjects`** — add the sections to the homepage, or
   drop them from the Navbar dropdown? **[M6]**
10. **Root-level `.mp4` files** — safe to delete? Not recoverable. **[M7]**
