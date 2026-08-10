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
| M4 | Remove unverifiable trust signals | DONE |
| M5 | Close the metadata gaps | DONE |
| M6 | Kill every dead internal link | DONE |
| M7 | Asset cleanup | DONE |
| M8 | Launch verification | IN_PROGRESS |

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
- **No account is required to start.** Confirmed 2026-08-06. The editor opens
  and is usable without signing up. Already claimed in `MigrationGuide.tsx`,
  `BeginnerWalkthrough.tsx`, `FeaturesFinalCTA.tsx` and `YTWorkflow.tsx` — this
  entry makes it verified rather than assumed.
- **Plans: Free, Pro ($29/mo, $278/yr), Ultra ($89/mo, $854/yr).** Restructured
  2026-08-10 on the owner's instruction. The old $29 Ultra became **Pro** and the
  old $39/seat Teams became **Ultra** at $89, so the paid ladder is two tiers and
  there is no per-seat plan any more.

  **The ladder, set by the owner on 2026-08-10:**

  | | Free | Pro | Ultra |
  | --- | --- | --- | --- |
  | Cloud storage | 500 MB | 20 GB | 70 GB |
  | AI credits | 1M/mo | 50M/mo | 200M/mo |
  | Version history | 30 days | 60 days | 90 days |
  | 3D primitives, import, textures, HDRI, timeline 3D | **yes** | yes | yes |
  | Advanced materials (PBR / toon / wireframe) | no | yes | yes |
  | AI toolset (motion graphics, assistant, image, audio) | no | yes | yes |
  | AI in 3D | no | no | **yes** |
  | Long-form agents (parallel scenes) | no | no | **yes** |
  | Comments, guest access | **yes** | yes | yes |
  | Team workspace, collaboration, roles | no | no | yes |

  Only **$854/yr** and **70 GB** are derived: the same ~20% annual discount Pro
  already carried, and 3.5x Pro's storage. Everything else is explicit.

  ⚠ **"Ultra is 3.5x Pro" now holds for storage only.** Credits go 4x from Pro to
  Ultra and history 1.5x, because those were set by hand afterwards. Do not
  "restore" the ratio — the explicit numbers win.

  ⚠ **The free tier has AI credits but none of the AI tools.** That is what was
  asked for and what the table says, but 1M credits a month with nothing in the
  table to spend them on is a question waiting to be asked. Either the toolset
  opens to free or the free credit line needs explaining. **Raised with the owner
  2026-08-10, unresolved.**

  **The prices live in three places and none derives from the others:**
  `PricingSection.tsx` (the cards and table), `app/pricing/page.tsx` (metadata
  *and* an `Offer` graph), and `faqData.ts` (prose, which `app/faq/page.tsx`
  turns into `FAQPage` schema). A price changed in one is a price that is wrong
  in Google's index and right on the page.

- **Cloud storage: 50 MB without an account, 500 MB on the free tier, 20 GB on
  Pro, 70 GB on Ultra.** Confirmed 2026-08-06, Ultra figure 2026-08-10. The
  50 MB and 500 MB figures are not in conflict — they are different states.
  `PricingSection.tsx` is the source of truth for what a *plan* includes; any
  copy quoting a storage number must say which state it means, or it reads as a
  contradiction (as `editorFeatures.ts` did until 2026-08-06).
- **3D capability — what FlashFX does and does not do.** Confirmed 2026-08-07.
  It **can**: import 3D objects, animate cubes and other primitives, perform
  basic 3D editing, and run *morph animations that modify objects* — the
  cube → sphere → aeroplane sequence recreated in `MorphDemo` is an animation
  the founder actually built in FlashFX. That is enough for motion graphics,
  which is the claim to make. It is **not a sculpting or modelling
  application**, and copy must never imply that it is. Do not describe FlashFX
  as somewhere you *create* 3D geometry; you bring geometry in and animate it.
- **Particle systems.** Confirmed 2026-08-07. FlashFX generates particles, with
  fire, smoke, magic and confetti among the presets, and supports custom
  emitters built by the user. Stated by the owner; the `ParticleGeneration`
  section's copy rests on this entry.
- **AI, and what "AI" means here.** Confirmed 2026-08-07. FlashFX is built to be
  **operated by an AI**: Claude drives the editor itself — the same canvas,
  keyframes and properties a person would use — rather than generating a video
  elsewhere and returning a file. The distinction is the claim, and it is the
  one the `EditInPlainEnglish` section rests on. What comes out is a project you
  can then edit by hand.

  **The AI *toolset* is not on the free tier, but AI *credits* are** (owner,
  2026-08-10). Free carries 1M credits a month; AI motion graphics, the
  assistant, image search and generation, the background remover and the sound
  generator are Pro and Ultra. The old absolute claim, "the free tier is a
  complete manual editor with no AI features", was true until that change and is
  now gone from `faqData.ts` — do not reintroduce it.

  **Ultra only: long-form agents across multiple parallel scenes, and AI in 3D.**
  Any new AI copy must not imply otherwise. The existing feature entries — *AI
  Image Generation* (DALL·E), *AI Chat Assistant*, *AI Motion Pipeline* with its
  four stages — are the published detail; do not invent capabilities past them.

- **Procedural animation.** Confirmed 2026-08-07. FlashFX does procedural
  animation — animation driven by rules and parameters rather than by
  hand-placed keyframes. The `ProceduralAnimation` section rests on this entry
  and says only that: shapes are rules, and the animation is the transition
  between them. It does not claim a node graph, a scripting language, or any
  particular authoring interface, because none of those has been confirmed. Ask
  before adding one.

- **Performance, and how far each figure may be pushed.** Stated by the owner
  2026-08-07, for the `LoadTime` section.

  First-party, safe to state plainly: **0 MB to install** (it is a browser tab);
  **about 2 seconds** to open the editor; runs without a discrete GPU;
  **chunking** lets a project run to hours of timeline without the length
  becoming a memory problem; **several projects open at once in separate tabs**,
  which a single desktop application cannot do.

  **The 50-second After Effects figure is one measurement on the owner's own
  machine, not a benchmark.** It is used in the section labelled as exactly
  that, and it must keep that label. `/flashfx-vs-capcut-vs-davinci` promises
  "no unmeasured performance claims" in its own metadata, and an unqualified
  "50s" would contradict the site's stated position on its own comparison page.

  **Exactly one After Effects specification is quoted: ~15 GB to install.**
  Owner's call, 2026-08-09. Every other After Effects line in that section is a
  structural statement that needs no number — it installs to disk, it wants a
  dedicated card, it opens one project at a time.

  **The figure is 8 GB. Corrected 2026-08-09 — it was 15 GB, and that was
  wrong.**

  helpx.adobe.com cannot be reached from this environment: timeouts and
  connection resets on the current page, the 2024 and 2025 versioned pages, and
  the `/in/` and `/sg/` mirrors, across several sessions. `community.adobe.com`
  does load but quotes no requirement. So the figure was sourced from
  publications that quote Adobe's table, and they were weighed rather than
  picked:

  | Source | Figure | Notes |
  | --- | --- | --- |
  | invgate.com/itdb | **8 GB** | Ties it to 25.6, Nov 2025 |
  | proxpc.com | **8 GB** | Same figure for Windows and macOS |
  | fixthephoto.com | 15 GB | Adobe's phrasing, no version tie |
  | ituonline.com | 5 GB | Matches older releases |

  Two independent sources on 8 GB, both anchored to a specific current build, is
  the strongest reading. The 15 GB the site had published since before `LoadTime`
  existed traces to one page. **This is still second-hand — check helpx.adobe.com
  the first time it loads.**

  Adobe's wording adds *"additional free space required during installation"*, so
  8 GB is a floor. The homepage copy says After Effects "asks for" 8 GB for that
  reason.

  It appears in **three** places, all saying the same thing: `LoadTime`
  (homepage), `SystemRequirementsSection` (`/lightweight-video-editor`) and the
  Installation row of `FeatureComparisonTable` (`/after-effects-alternative`).
  That last one read "2-4 GB desktop install" until 2026-08-09 and was the
  site's own worst contradiction on this point. All three change together.

  **DaVinci Resolve: no install size is claimed. Resolved 2026-08-09 by looking
  for the source and not finding one.**

  Blackmagic publishes no disk-space requirement for Resolve anywhere. Their
  stated minimums cover CPU, GPU and RAM only; `blackmagicdesign.com/products/
  davinciresolve/techspecs` is about control panels and audio hardware, not the
  software; the configuration-guide PDF 404s. Third-party figures run from
  2 GB to over 7 GB with nothing primary behind any of them.

  So the site's "3-4 GB desktop install" was invented somewhere upstream. It
  appeared in **three** places — `FeatureComparisonTable`, `FMGComparisonTable`
  and `BenchmarkComparisons` (as "4 GB download") — and all three now say
  *multi-gigabyte*, which is the one thing every source agrees on.

  Do not put a number back without a Blackmagic page that states one.

  ℹ Resolve figures that **do** have a source and must stay: `compareFaqData.ts`
  quotes its Windows minimum of 16 GB system memory, 32 GB with Fusion, and a
  GPU with at least 4 GB of VRAM. Those are RAM and GPU specs, not install size,
  and Blackmagic does publish them.

- **RAM floor: 4 GB. Settled 2026-08-07 — this is now the only figure.**

  It had been contradictory across seven files: `/lightweight-video-editor`
  alone said "Works on 4 GB RAM" twice and "Requires only 2 GB RAM" once, plus
  "2 GB minimum / 4 GB recommended" in its requirements table and "2 GB minimum"
  in its comparison row. `/after-effects-alternative` and
  `/free-motion-graphics` each said 2 GB; the homepage FAQ said 4 GB. Every one
  of them now reads **4 GB**, verified across the built HTML of all routes.

  Do not reintroduce 2 GB anywhere, including as a "minimum" alongside 4 GB as
  a "recommended" — that pairing is what allowed the contradiction to look
  deliberate for as long as it did.

  Untouched, and must stay untouched: every competitor and test-machine figure
  (After Effects 16 GB, DaVinci 8/16 GB, Premiere 16 GB, CapCut 4 GB, the 8 GB
  benchmark laptop).

  ℹ **Resolved 2026-08-09.** `LoadTime` now quotes the same 8 GB install size
  the rest of the site publishes. See the performance entry above for what that
  figure does and does not rest on.

- **Plugins: users can build them, but every community plugin is reviewed
  before release, and submissions are not open to everyone yet.** Stated by the
  owner 2026-08-09.

  This settles a contradiction the "possibilities are endless" section opened:
  it promised "plugins built by the people using it" on the homepage while
  `FeatureComparisonTable` described FlashFX's plugin story as "Curated
  built-ins" and gave the row to After Effects. Both now say the same thing, and
  **the row still goes to After Effects** — anyone can publish an AE plugin
  today, which is a real difference and not one to argue with.

  Do not describe the plugin system as open, or as accepting submissions from
  anyone, until the owner says the review gate has been lifted.

- **2.5D camera.** Stated by the owner 2026-08-09, for the `DepthCamera`
  section. What may be said: FlashFX has a professional 2.5D camera; it takes
  flat layers, stands them at different depths and moves a real camera through
  them; and doing this on the web is a hard problem and a significant thing to
  have working in a browser tab.

  What may **not** be said, because none of it has been stated or verified: any
  world first, any "only editor that", any benchmark, any comparison to a named
  competitor's camera, and any feature list. The bullets under the other feature
  blocks came from `editorFeatures.ts` or from the owner; there is no such source
  for this one, so the section deliberately ships with prose and no list.

  ❓ **Open: the feature list for this section**, and whether the camera should
  get a `?template=` deep link like particles and the four scenes.

- **Template deep links: `galaxy`, `city-skyline`, `rocket-launch`, `forest`.**
  Supplied by the owner 2026-08-09 and added to `TEMPLATES` in `lib/editor.ts`,
  so all four cards in `TemplateStart` open their own template rather than the
  dashboard.

  The ids do **not** follow from the screenshot filenames: `city-skyline` pairs
  with `cityskyline.webp` and `rocket-launch` with `rocketlaunch.webp`. Never
  derive an id from a filename.

  ❓ **Still open: the templates gallery URL.** "Explore all templates" points at
  the editor because no gallery exists yet. The owner is building one and will
  supply the URL. It is one line in `TemplateStart.tsx`.

- **Templates: ten tutorial templates.** Stated by the owner 2026-08-07, for the
  `TemplateStart` section. The count is the only figure claimed.

  **The four cards are real as of 2026-08-07.** The owner supplied screenshots of
  each template open in the editor, stored in `public/templates/`. The names, the
  blurbs and the "Scenes" category are all read off the editor UI in those
  images rather than invented: City Skyline, Forest, Galaxy, Rocket Launch.

  They arrived as PNGs of 203-223 kB, two of them over the 220 kB per-asset
  budget, so they ship as WebP at 1200px instead: 165 kB for all four against
  860 kB. **Re-export at 1200px wide** if they are ever replaced, or the build
  will fail on the asset check.

  **There is no templates gallery to link to.** No `/templates` route exists and
  there is no templates subdomain — blog, documentation, editor and roadmap are
  the only ones the site references. "Explore all templates" points at the
  editor until there is somewhere better; a button of that name pointing at a
  URL that does not exist is the M6 failure again.

- **The AI block ("Not convinced yet?").** Stated by the owner 2026-08-07, for
  the five sections between the feature run and pricing.

  1. **Multi-agent editing.** Several AI agents work different spans of one
     timeline at the same time — one across 0-20s, another 20-35s, and so on.
     **Six agents maximum.** That ceiling is a fact, not a round number.
  2. **Non-destructive, and the central claim of the whole block.** FlashFX's AI
     **does not generate video.** It *operates the editor*: it edits long videos,
     works on your own footage, and builds real animation, and every element it
     touches stays editable at full scale afterwards. It may call other AI tools
     when it needs them. The distinction from competitors is exact and must not
     be blurred — **they generate a video, this edits one, and then you export
     it.** Do not let this drift into "AI video generation" in any rewrite.
  3. **AI as a guide.** Ask it how to do something ("how do I edit the
     interpolation") and it explains, for people who would rather do the work
     themselves. YouTube tutorials are the other route.
  4. **Inspired by CapCut, Premiere Pro and especially Figma.** The owner's
     framing: the best of each, aimed at something quick and easy that is still
     deep.
  5. **Plugins, templates and presets** — official FlashFX ones and user-made
     ones.

  ⚠ **Item 5 contradicts what the site already says.** `FeatureComparisonTable`
  in `/after-effects-alternative` lists FlashFX's Plugin Ecosystem as **"Curated
  built-ins"** and awards that row to After Effects. Either that table is stale
  or user-made plugins are roadmap rather than shipped. **The new section is
  written to the owner's statement; the table has not been changed.** One of the
  two needs correcting, and the answer decides which.

  (`faqData.ts` also says "no installer, no plugin" — that is about browser
  extensions, a different sense of the word, and not in conflict.)

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

**Status:** DONE — 2026-08-04

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
> - **All 15 fabricated testimonials removed.** Confirmed fabricated by the
>   owner on 2026-08-04. Three component files deleted outright, along with
>   their imports and usages, and one adjacent `SectionDivider` per page so no
>   double rules were left behind:
>   - `components/sections/SocialProof.tsx` — 3, homepage
>   - `components/sections/lightweight-video-editor/HardwareTestimonials.tsx` — 6
>   - `components/sections/video-editing-for-beginners/BeginnerTestimonials.tsx` — 6
>
>   Verified: zero occurrences of any of the 15 names in source or built HTML;
>   5 sections / 4 dividers / 0 adjacent pairs on both affected pages. Removal
>   also cleared 4 of the 13 pre-existing lint errors (13 → 9).
>   Recoverable from the baseline commit if ever needed.
>
> **Still pending a decision:**
> - **"average results across 50 first-time users tested on each platform"** —
>   `LearningCurveComparison.tsx:140`. Unchanged pending confirmation the test
>   happened. This is the last unverifiable claim left on the site.
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

**Status:** DONE — 2026-08-04

> **Completed.** All six pages now carry a title, canonical, `robots`,
> `og:image`, and `twitter:image`. Before this, the site had **no social image
> at all** while declaring `summary_large_image` everywhere, so every share
> rendered a blank card.
>
> - **Homepage title:** `FlashFX — Free Browser-Based Motion Graphics & Video
>   Editor` (59 chars, inside the ~60 char SERP limit). Set on `app/layout.tsx`
>   rather than a new `app/page.tsx` metadata export — the homepage declares no
>   metadata of its own and inherits the layout wholesale, so one edit covers it
>   and the layout stops being a weak `FlashFX` fallback for any future page.
> - **Social image:** `Screenshot_2026-03-01_183521.png`, 1872×955 (ratio 1.96 vs
>   the 1.905 ideal), verified live at 200 / 176 KB / `image/png`. Chosen over
>   `Screenshot_2026-01-23_164632.png`, which has placeholder canvas text
>   ("Yo bro Do you see this") and is unusable for a brand card.
> - **`lib/seo.ts`** added. Next.js merges metadata shallowly, so a page
>   declaring its own `openGraph` replaces the layout's wholesale — the image
>   has to be repeated on all six pages. The shared constant stops those copies
>   drifting; swapping in a purpose-made 1200×630 asset is now a one-file change.
> - **Explicit `robots: { index: true, follow: true }`** on the homepage,
>   matching the sub-pages.
> - **Broken schema image fixed.** `after-effects-alternative` pointed
>   `screenshot` at `https://flashfx.app/static/screenshot.png`, which 404s —
>   there is no `public/static/` directory. Repointed at the real asset, so both
>   pages that set `screenshot` now use the same live file.
>
> **Observation, not actioned — pre-existing title lengths.** Four sub-page
> titles exceed the ~60 character SERP limit and will truncate:
> `lightweight-video-editor` 71, `after-effects-alternative` 69,
> `video-editing-software-for-beginners` 67, `free-motion-graphics-software` 61.
> Left alone deliberately: these are live, indexed titles and rewriting them is
> a ranking decision, not a bug fix.

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

**Status:** DONE

### Progress as of 2026-08-06

The audit text below is preserved as written on 2026-08-03. Two of its figures
were wrong even then, and the route count has since moved:

- "15 routes that do not exist" undercounts its own list, which enumerates **17
  dead hrefs across 16 distinct routes** (`/features#templates` and
  `/features#export` share one route).
- "Only five routes exist sitewide" was already stale — `/about` had shipped.
  **18 routes exist now.**
- **The Files list is incomplete.** Six dead links lived in body content, not
  the footer: `PricingComparison.tsx`, `FMGFreeTierBreakdown.tsx`,
  `FMGFAQSection.tsx` (x2), `AEFAQSection.tsx`, `MigrationGuide.tsx`. All
  resolved when `/pricing` and `/features` shipped. In-body links matter more
  than footer boilerplate — a reader mid-funnel actually clicks them.

**Done:** `app/not-found.tsx` built. Twelve routes added — `/pricing`,
`/features`, `/motion-graphics-software-for-youtube`, `/brand`, `/careers`,
`/download`, `/faq`, `/privacy`, `/terms`, `/refund-policy`,
`/acceptable-use-policy`. `/roadmap` repointed to `roadmap.flashfx.app`.
Privacy and terms resolved via Termly, so criterion 4 is met.

**Every internal href now resolves. M6 acceptance criteria: 4 of 4.**

`/security` resolved 2026-08-06 by replacing it rather than building it. The
footer entry is now "Your Data in FlashFX" → `/your-data`, which reproduces the
privacy notice in full, natively rendered from
`components/sections/your-data/yourDataContent.ts` rather than through Termly's
embed script — so it is in the server HTML, readable without JavaScript, and
indexable. A speculative security page was never written, which was the right
outcome: the facts to write one honestly are in the editor codebase, not here.

**Canonicalisation resolved 2026-08-06: `/your-data` wins.** `/privacy` now
carries `alternates.canonical` pointing at `/your-data` and is excluded from the
sitemap, because listing a non-canonical URL contradicts its own canonical tag.
`/privacy` stays live, linked from the footer as "Privacy Policy", and remains
the authoritative copy — it updates automatically when the Termly document
changes, which `/your-data` does not.

**Category A corrected to YES, 2026-08-06, on the owner's instruction.** The
Termly document contradicted itself: section 1 states that email addresses and
passwords are collected, while the US categories table marked category A —
Identifiers, which explicitly covers email address and account name — as **NO**,
along with every other category. `/your-data` now shows YES for Identifiers and
NO for the remaining eleven.

🚧 **Still to do at the source.** The Termly document itself has not been
changed, so `/privacy` continues to serve **NO** for category A. Two versions of
a data-collection declaration disagreeing is worse than either being wrong
alone, and the authoritative copy is the wrong one. Fix it in Termly.

⚠️ **Transcription drift.** Editing the policy in Termly updates `/privacy` and
*not* `/your-data`. `yourDataContent.ts` must be updated by hand and its
`lastUpdated` bumped. The file header says so.

⚠️ **Postal address.** The notice gives "xxv aprile, Pontecchio, RO 45030" —
lowercase Roman numerals read like a placeholder or a transcription slip. Worth
confirming against the registered address.

Resolved 2026-08-06:
- `/blog` → `blog.flashfx.app`, external, same as `/roadmap`. Open question 4
  below is moot: do not build a blog on this domain, one already exists.
- `/status` → **link removed entirely.** No status page exists and none is
  planned. If one is ever stood up it belongs on a hosted service at
  `status.flashfx.app`, linked externally — a hand-written status page goes
  stale silently during the first outage, which is the only time it matters.
- `/changelog` → page built, with an empty `releases` array and an honest empty
  state pointing at the roadmap, blog and X. Owner populates it.
- `/flashfx-vs-capcut` and `/flashfx-vs-davinci` → replaced by a single page at
  `/flashfx-vs-capcut-vs-davinci`, and the two footer entries consolidated into
  one. See the note below on what was and was not published.

### The benchmark document — what was published and what was not

The owner supplied "FlashFX vs CapCut vs DaVinci Resolve", a benchmark
*framework* v0.1. It tags every claim `[ARCH]` (structural, verifiable),
`[SPEC]` (published vendor specification) or `[PRED]` (predicted band derived
from architecture, **not measured**).

**Only `[ARCH]` and `[SPEC]` reached the page.** Every `[PRED]` row — all RTR
figures, fps bands, seek latencies and time-to-result estimates in that
document's sections 4.1 and 5.1 — was deliberately excluded, because its own
section 0 states that publishing predicted numbers as measured ones "is the one
mistake that ends a benchmarking publication's credibility permanently", and
section 7 says do not publish any FlashFX number that has not been measured.

There is a second reason: comparative advertising naming a competitor must be
objective and verifiable under EU rules, and FlashFX operates from Italy.
Architecture and published specs clear that bar; predictions do not. This is the
same exposure already noted for `PerformanceBenchmark.tsx` on the After Effects
page, which still publishes uncited Adobe render-time and RAM figures.

The page instead carries a section explaining why no speed numbers appear. When
measurements exist — three runs, median, one machine, cold GPU — they go there
with the method stated alongside, including the losses.

**Held back pending confirmation:** the document credits FlashFX with
expressions, repeaters and cloners, audio-reactive keyframing, adjustment layers
and puppet warp. None appear in `editorFeatures.ts`, so they were left out of
the capability matrix rather than published on a page that names competitors.
Either that feature data is stale or those are planned — worth resolving.

**Navbar — done 2026-08-06.** All six dropdown entries now scroll to a section
that exists, verified against the built homepage HTML.

- `#dual-timeline` — `DualTimeline.tsx` was a complete 90-line section that had
  simply never been mounted. It now sits between All Web Editing and Easy
  Animations, matching the dropdown order.
- `#share-projects` — `ShareProjects.tsx` turned out to be an **empty shell**: a
  `<section>` with an id and no children, rendering 100vh of blank navy.
  Mounting it would have put a full-screen gap on the homepage. The homepage
  already carried the Share Projects content in a `VideoPlaceholder` that simply
  had no id, so an optional `id` prop was added to `VideoPlaceholder` and that
  instance tagged.

  **This touched `VideoPlaceholder.tsx`, which the M8 deferred list freezes.**
  Explicitly authorised by the owner on 2026-08-06 after being shown the
  trade-off. The freeze exists to protect the YouTube embed strategy and the
  PageLoader gate; an additive optional prop touches neither, and the homepage
  embed count is unchanged at 5, so `VIDEO_TARGET` is unaffected. The freeze
  otherwise stands.

  `ShareProjects.tsx` is now provably dead code — an empty component referenced
  by nothing. Candidate for deletion in M7.

**Acceptance criteria: 3 of 4 met.** Only "every internal href resolves" is
outstanding, blocked on the six links above.

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

**Status:** DONE

### Completed 2026-08-06

`public/` went from 15 MB to 6.7 MB. Repo root now holds no media at all.
Thirteen files removed, all of them tracked and pushed before deletion, so every
one is recoverable from history at `0fcb3f1`:

```
git checkout 0fcb3f1 -- "<path>"
```

**`public/` orphans removed (~7.9 MB)** — `fix.png`, `2.png`, `VISUALS2.png`,
`a815522d626e471d2c3d01460a83051413884b0f.jpg`.

**The audit below missed `2.png`, at 2.9 MB the second-largest orphan on the
site.** A substring search for `2.png` matches inside
`android-chrome-192x192.png`, so it read as referenced. Re-checking against the
`/<name>` form assets are actually written as is what surfaced it — worth
repeating that way if this is ever audited again.

**Root duplicates removed (~970 KB)** — the four
`Screenshot_2026-03-01_180920_-_Copy*.png` files and `Screenshot_2026-03-01_183521.png`.
All five were byte-identical (md5 `3bc1877d…` and `686b1ddf…`) to copies in
`public/` that *are* referenced. Only the root duplicates went; the served
copies remain, including the live OG image.

**Root media removed (~12.7 MB)** — `spotify_player_animation.mp4`,
`newspaper_animation.mp4`, `the_future_of_design.mp4`, `scattered_text.mp4`.
None were in `public/`, so none were ever served.

**Skipped: the `android-chrome-192x192 copy.png` dedup.** It is byte-identical
to `android-chrome-192x192.png` (md5 `1036a255…`), but the only reference is in
`PageLoader.tsx`, which the M8 deferred list freezes. 16 KB is not worth
touching a frozen file for. Fold it into whatever finally addresses the loader.

**Not in scope, still outstanding:** `ShareProjects.tsx` (an empty component
referenced by nothing), `ProblemSection.tsx`, and `TrollSection.tsx` are dead
code rather than assets. M7 is asset cleanup, so they were left alone.

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

### ✅ Version control is in place (as of 2026-08-04)

The repo is now tracked and pushed to
`https://github.com/gabrielebolognese/FlashFX-landing-page`. Deletions in this
milestone are recoverable from history, so the earlier "confirm before deleting"
caution is relaxed — though still confirm the root `.mp4` files are unwanted,
since nothing references them and their provenance is unknown.

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

**Status:** IN_PROGRESS

### Verified locally 2026-08-06

Everything checkable without the live site passes. Five of six acceptance
criteria are met; the sixth needs Google's tooling against a deployed URL.

**Build gate — now actually meaningful.** `npm run lint` reports **no ESLint
warnings or errors** and exits 0, for the first time in the project's history.
The nine `react/no-unescaped-entities` errors were cleared in
`FMGComparisonTable.tsx`, `FMGFinalCTA.tsx`, `WhatMakesSoftwareFree.tsx` and
`LearningCurveComparison.tsx` (raw quotes and apostrophes in JSX text, replaced
with `&ldquo;` / `&rdquo;` / `&rsquo;`). The `react-hooks/exhaustive-deps`
warning in `TrollSection.tsx` was a real latent bug, not noise: the effect
unobserved `videoSectionRef.current` at cleanup time rather than the node it
observed on entry, so a changed ref would have leaked the observation. Fixed by
capturing the node in a local. `npm run typecheck` and `npm run build` pass.

Note the count differs from the audit's "13 errors in 6 files" — `HardwareTestimonials.tsx`
and `BeginnerTestimonials.tsx` were deleted by M4, taking their errors with them.

**Routes.** All 17 serve 200 under `npm run start`. A deliberate bad URL returns
a real **404 status** with the branded page body, not a 200 soft-404.

**Sitemap.** 17 URLs, `/about` among them. Regenerates correctly now that
`netlify.toml` calls `npm run build` rather than `npx next build` — see the note
in CLAUDE.md before touching that command.

**Structured data, parsed from the built HTML.** 18 pages, **34 JSON-LD blocks,
zero parse failures**. Both graph nodes are defined on `/` and `/about`, and
every `@id` reference across the site resolves to one of them:

- `https://flashfx.app/#organization` — referenced from 5 pages
- `https://gabrielebolognese.blog/#person` — referenced from 2 pages

The entity graph on `/` and `/about` is **byte-identical**, and the Person
`sameAs` array is in the exact order this document specifies.

**`rel="me"`** is present in the server-rendered HTML of **all 18 pages**, via
the sitewide footer — not injected client-side.

**Rating markup: none.** No `aggregateRating`, no `Review`, no `ratingValue`
anywhere in the built output.

### 🚧 Remaining — needs the live site, cannot be done from the repo

1. **External structured-data validation** (criterion 4). Run the deployed URLs
   through `https://validator.schema.org/` and Google's Rich Results Test. Local
   parsing proves the JSON is well-formed and the graph is internally
   consistent; it cannot prove Google accepts it.
2. **Post-deploy checks.** Confirm `https://flashfx.app/about` returns 200,
   confirm `https://flashfx.app/sitemap-0.xml` serves 17 URLs, resubmit the
   sitemap in Search Console, and request indexing. Entity consolidation is slow
   — expect weeks.

### Why

Nothing above counts as done until the built site actually serves it and the
structured data validates.

### Changes

1. ~~**`git init`.**~~ **Done 2026-08-04.** Repo initialised, baseline commit
   `3166b46` taken before any destructive work, and pushed to
   `https://github.com/gabrielebolognese/FlashFX-landing-page` (public, `main`).
   A `README.md` was added covering stack, commands, routes, deployment, and the
   conventions that break quietly — the JSON-LD delivery rule, the byte-exact
   `@id`/`sameAs` requirement, the footer `rel="me"`, and the no-rating-markup
   rule.
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
