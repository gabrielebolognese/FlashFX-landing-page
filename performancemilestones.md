# performancemilestones.md — Making flashfx.app fast

Remediation plan for load time, latency and animation smoothness on
flashfx.app, derived from a static audit of the repository on 2026-08-06. Work
top to bottom: the milestones are ordered so each one makes the next easier, and
P1 in particular unblocks P2.

**The problem, stated plainly:** the homepage ships **316 kB of JavaScript**,
**6.6 MB of unoptimised PNGs**, **13 YouTube iframes** of which 10 load eagerly,
and **three simultaneous WebGL contexts** — behind a full-screen overlay that
refuses to lift until `window.load` fires, which by definition waits for all of
the above. On a slow machine that is a 30-second wall, and the reported
behaviour matches the architecture exactly.

**What is measured and what is not.** Everything below in `code` is measured
from the repository: bundle sizes come from `npm run build` output, file sizes
from disk, counts from the source. **No field or lab timing has been run** — no
Lighthouse, no WebPageTest, no real device. So there are no "before" millisecond
figures here, and none are invented. P8 exists to establish that baseline, and
it should arguably run first even though it is listed last.

---

## Progress

| Milestone | Title | Status |
|---|---|---|
| P1 | Stop the loader blocking first paint | DONE |
| P2 | Lazy-load every YouTube embed | DONE |
| P3 | Fix the 6.6 MB image payload | DONE |
| P4 | One WebGL context, paused off-screen | NOT_STARTED |
| P5 | Code-split the heavy visual components | NOT_STARTED |
| P6 | Animation fluidity and reduced motion | NOT_STARTED |
| P7 | Trim the font payload | NOT_STARTED |
| P8 | Measurement, budgets and regression guards | NOT_STARTED |

Statuses: `NOT_STARTED` → `IN_PROGRESS` → `DONE`. Update both this table and the
milestone's own `Status:` line when one completes.

---

## Scope note: the FIX.md freeze is lifted

`FIX.md` froze the YouTube embed strategy and the `PageLoader` gate, and M8
records them as deferred. **That freeze was lifted on 2026-08-06** when the owner
asked for a performance fix — those two are the largest single causes of the
problem and cannot be excluded from a plan that claims to solve it. P1 and P2
supersede that deferral. Nothing else in `FIX.md` changes.

---

## The findings, with evidence

| # | Finding | Evidence |
|---|---|---|
| 1 | Homepage First Load JS is **316 kB**; every other page is 80–150 kB | `npm run build` route table |
| 2 | `three.js` is statically imported by two components that both render on the homepage | `shader-animation.tsx`, `web-gl-shader.tsx` — `import * as THREE from "three"` |
| 3 | **Three WebGL renderers** run at once on the homepage | Hero → `ShaderAnimation`; `ImageCarousel` and `FeaturesIntro` → `WebGLShader` |
| 4 | Each runs an uncapped `requestAnimationFrame` loop with no off-screen pause | `shader-animation.tsx`, `web-gl-shader.tsx` |
| 5 | **6.6 MB** of images are referenced by homepage sections | `du` over referenced assets |
| 6 | Two single files dominate: `fix copy.png` **1.9 MB**, `VISUALS.png` **1.7 MB** | `ls -S public/` |
| 7 | Image optimisation is **disabled globally** | `next.config.js` → `images: { unoptimized: true }` |
| 8 | **No image anywhere sets `priority`**, so the LCP image is never preloaded | grep across `components/sections/` |
| 9 | `FeatureHighlights.tsx` uses a raw `<img>` — no lazy loading, no sizing | grep `<img` |
| 10 | **13 YouTube iframes** on the homepage, **10 eager** | 5 × `VideoPlaceholder` + 5 shorts in `WhatIsFlashFX` |
| 11 | `LazyYouTube` already exists and already solves this — used in only 3 of 13 places | `SolutionSection`, `LoadTime`, `SplitHero` |
| 12 | `PageLoader` waits on `window.load`, which waits on all of the above | `PageLoader.tsx` `tryFinish()` |
| 13 | `Hero` returns `null` until the overlay finishes, so the LCP element does not exist during load | `Hero.tsx` |
| 14 | Every non-homepage route has **no videos**, so `videosReady` never flips and the overlay always runs the full 6 s fallback | `VIDEO_TARGET = 5` in `lib/loading-context.tsx` |
| 15 | `CreatorStories` animates **72 SVG paths** continuously | `background-paths.tsx` — 36 paths × 2 |
| 16 | **137 client components**, 93 of them importing `framer-motion` | grep `'use client'` |
| 17 | **4 Google Font families** loaded on every route | `app/layout.tsx` |

---

## P1 — Stop the loader blocking first paint

**Status:** DONE — 2026-08-06
**Impact:** highest. This is the one users experience as "the site is slow."

> **Done.** `PageLoader` is now a **server component with no JavaScript at all**
> — the fade is a CSS animation (`.fx-splash` in `globals.css`, 520 ms), so it
> starts at first paint, needs no hydration, and has no mechanism by which it
> could wait on a third party. It is `pointer-events: none` from the first
> frame, so it never blocks a click. `prefers-reduced-motion: reduce` collapses
> it to 1 ms.
>
> `Hero` renders unconditionally; the headline is in the server HTML and
> verified present. `lib/loading-context.tsx` and `components/BodyWrapper.tsx`
> were **deleted** — with them went `VIDEO_TARGET`, `videosReady`,
> `markVideoReady`, and a client-component boundary that wrapped the entire
> application tree. `app/layout.tsx` now renders `PageLoader`, `Navbar`,
> `children` and `Footer` directly.
>
> Not verified: the "under 2 s on Slow 4G" criterion. That needs a throttled
> browser run, which belongs to P8.

### Why

`PageLoader` renders a fixed, opaque, full-screen overlay at `z-index: 9999`
and only dismisses when **both** `window.load` has fired **and** `videosReady`
is true, with a 6-second hard fallback.

`window.load` does not fire until every image and every iframe has finished.
With 6.6 MB of PNGs and 13 YouTube embeds, that is very late — so in practice
the 6-second fallback is what dismisses the overlay, on every visit, on every
page. It is a flat 6-second tax that gets *worse*, not better, on fast
connections, because nothing can finish sooner than the timer.

Worse, `Hero` returns `null` until `isLoaded` is true. The largest contentful
element on the site does not exist in the DOM during the entire load. Whatever
Google measures as LCP, it is not the hero.

And on `/about`, `/features`, `/pricing` and every other route there are no
videos at all, so `videosReady` can never become true. Those pages wait the full
6 seconds by construction.

### Files

- `components/PageLoader.tsx`
- `lib/loading-context.tsx`
- `components/sections/Hero.tsx`
- `components/BodyWrapper.tsx`

### Changes

1. **Render content immediately.** `Hero` must not return `null`. The hero,
   its text and its CTA should be in the first paint. The overlay may still fade
   over the top of a page that is already there.
2. **Cut the `window.load` dependency.** Gate on nothing heavier than
   `DOMContentLoaded`, or on a fixed short ceiling — 600–800 ms is enough for a
   brand moment.
3. **Delete the video dependency entirely.** `videosReady`, `VIDEO_TARGET` and
   `markVideoReady` should go. Tying an overlay to third-party iframe load
   events couples first paint to YouTube's availability, which is not something
   this site controls. This also decouples P2 — do P1 first.
4. **Keep the brand moment if wanted**, but as a non-blocking overlay that fades
   on a timer, with `pointer-events: none` as soon as the fade starts.

### Acceptance criteria

- [ ] The hero headline is present in the initial HTML and painted without waiting on any timer
- [ ] No route displays a blocking overlay for longer than 800 ms
- [ ] `VIDEO_TARGET`, `videosReady` and `markVideoReady` no longer exist
- [ ] Throttled to "Slow 4G" with 6× CPU slowdown, content is visible in under 2 s

### Verify

```bash
npm run build && npm run start
# DevTools → Performance → Slow 4G + 6x CPU. Record a cold load of / and /pricing.
# Confirm: first contentful paint is hero text, not the overlay.
```

---

## P2 — Lazy-load every YouTube embed

**Status:** DONE — 2026-08-06
**Depends on:** P1 (the loader counted iframe `onLoad` events)

> **Done.** Both `VideoPlaceholder`'s `YouTubeEmbed` and `WhatIsFlashFX`'s
> `ShortEmbed` now create their iframe only once an IntersectionObserver with
> `rootMargin: 400px` reports the section approaching the viewport, so the embed
> is ready by the time it is on screen. Until then each renders a solid
> placeholder at the same dimensions, so nothing shifts.
>
> **Verified: zero `<iframe>` elements in the delivered HTML** of `/`, `/about`,
> `/pricing` and `/features` — checked both in the build output and against a
> running production server.
>
> The play/pause observer that drives autoplay-on-scroll is unchanged, but is
> now attached only after the iframe exists. `WhatIsFlashFX` was switched from
> `youtube.com` to `youtube-nocookie.com` to match `VideoPlaceholder`. The dead
> `onLoad={markVideoReady}` wiring is gone.
>
> Not verified: the "third-party transfer under 500 kB" criterion, which needs a
> network panel measurement. P8.

### Why

Ten of the homepage's thirteen iframes load eagerly. Each YouTube embed pulls
roughly 1–2 MB of its own JavaScript and CSS, opens its own rendering context,
and blocks `window.load`. Ten of them is several megabytes of third-party code
that the visitor did not ask for, most of it below the fold.

The fix is already written and already working. `LazyYouTube` exists and is used
correctly in `SolutionSection`, `LoadTime` and `SplitHero`. It is simply not
used in the two components that account for all ten eager embeds.

### Files

- `components/sections/VideoPlaceholder.tsx` (5 eager embeds)
- `components/sections/WhatIsFlashFX.tsx` (5 eager shorts)
- `components/ui/lazy-youtube.tsx` (read first — the pattern to copy)

### Changes

1. Replace the raw `<iframe>` in `VideoPlaceholder`'s `YouTubeEmbed` with
   `LazyYouTube`, or with the same IntersectionObserver approach.
2. Replace the raw `<iframe>` in `WhatIsFlashFX`'s `ShortEmbed` likewise.
3. Prefer a **facade**: a static poster image plus a play affordance, with the
   real iframe created only on click or on first intersection. A poster JPEG is
   a few tens of kilobytes against 1–2 MB for an embed.
4. Remove the now-dead `onLoad={markVideoReady}` wiring left over from P1.
5. Use `youtube-nocookie.com` consistently — `VideoPlaceholder` already does,
   `WhatIsFlashFX` does not.

### Acceptance criteria

- [ ] Zero `<iframe>` elements in the server-rendered HTML of `/`
- [ ] Iframes are created only on intersection or click
- [ ] Autoplay-on-scroll behaviour still works for the embeds that had it
- [ ] Third-party transfer on first load of `/` drops below 500 kB

### Verify

```bash
npm run build
grep -c "<iframe" .next/server/app/index.html   # expect 0
```

---

## P3 — Fix the 6.6 MB image payload

**Status:** DONE — 2026-08-06
**Impact:** largest byte-count win available

> **Done. 6.56 MB of images became 0.45 MB — 93% smaller.** `public/` went from
> 6.7 MB to **702 KB**, and the largest asset on the site is now 176 KB.
>
> Thirteen PNGs were converted to WebP at sensible display widths with Pillow at
> quality 82. The originals were wildly oversized — `VISUALS.png` was
> **4508×2160** and renders in a carousel at **490 px**, a 9× oversize:
>
> | Was | Now |
> |---|---|
> | `VISUALS.png` 1.7 MB, 4508×2160 | `visuals.webp` 24 KB, 1200×575 |
> | `fix copy.png` 1.9 MB, 2160×1909 | `fix-copy.webp` 39 KB, 1600×1414 |
> | `1.png` 699 KB, 2810×1440 | `1.webp` 34 KB, 1600×820 |
> | `Screenshot_2026-03-01_200913.png` 539 KB | `shot-200913.webp` 47 KB |
>
> The raw `<img>` in `FeatureHighlights.tsx` is now `next/image` with `fill` and
> `sizes`, so it lazy-loads and has intrinsic sizing. `sizes` was added to every
> `fill` image.
>
> **No image is marked `priority`, deliberately.** Above the fold is the hero —
> a shader canvas and text, no image. Marking a below-fold carousel image
> `priority` would compete with the LCP text for bandwidth and make things worse.
>
> **`images: { unoptimized: true }` was left in place.** With sources now at
> display resolution there is little left for the optimiser to win, and removing
> the flag changes runtime behaviour on Netlify in a way that cannot be verified
> from the repo. Worth testing on a deploy preview — responsive `srcset` is the
> remaining gain.
>
> The 19 superseded PNGs were deleted, including `android-chrome-192x192 copy.png`
> — the duplicate M7 deliberately left alone because `PageLoader` referenced it.
> P1 rewrote `PageLoader` to use the canonical file, so it is finally orphaned.
>
> `Screenshot_2026-03-01_183521.png` **is deliberately kept as a PNG.** It is the
> OG image in `lib/seo.ts` and the `screenshot` value in six JSON-LD blocks, at a
> declared 1872×955. Changing that URL would break every social card. Verified
> still present.

### Why

Homepage sections reference **6.6 MB** of PNGs, and `next.config.js` sets
`images: { unoptimized: true }`, which disables format conversion and resizing
entirely. `next/image` is doing layout only. Two files alone —
`fix copy.png` at 1.9 MB and `VISUALS.png` at 1.7 MB — are 55% of that.

These are screenshots. As WebP or AVIF at display resolution they should be
40–80 kB each, not 1.9 MB. This is a 10× reduction available for near-zero
risk.

No image on the site sets `priority`, so whichever image is the LCP element is
discovered late rather than preloaded. And `FeatureHighlights.tsx` uses a raw
`<img>`, which gets no lazy loading and no responsive sizing.

### Files

- `next.config.js`
- `public/` — the source assets
- `components/sections/FeatureHighlights.tsx` (raw `<img>`)
- Every homepage section rendering an image

### Changes

1. **Remove `images: { unoptimized: true }`.** Confirm first that
   `@netlify/plugin-nextjs` serves the Next image optimiser on your plan. If it
   does not, fall back to step 2 and keep the flag.
2. **If optimisation cannot run server-side**, pre-convert: generate `.webp` at
   1×/2× display width for every screenshot and reference those instead. Keep
   the PNGs out of `public/`.
3. **Set `priority` on the LCP image only** — the hero or first carousel frame.
   Exactly one. `priority` on many images is the same as on none.
4. **Give every `next/image` a correct `sizes`** so it does not download a
   desktop-width file on a phone.
5. **Convert the raw `<img>`** in `FeatureHighlights.tsx` to `next/image`.
6. **Re-examine `fix copy.png` and `VISUALS.png` specifically** — at 1.9 MB and
   1.7 MB they are the two worst assets on the site.

### Acceptance criteria

- [ ] No single image asset over 200 kB
- [ ] Total image transfer on a cold load of `/` under 800 kB
- [ ] Exactly one image marked `priority`, and it is the LCP element
- [ ] Every image renders identically to before at every breakpoint

### Verify

```bash
npm run build && npm run start
# DevTools → Network → Img. Sort by size. Sum the transfer column.
ls -S public/*.png | head -5   # nothing here should be over 200 kB afterwards
```

---

## P4 — One WebGL context, paused off-screen

**Status:** NOT_STARTED

### Why

The homepage creates **three** `THREE.WebGLRenderer` instances at once — `Hero`
via `ShaderAnimation`, and `ImageCarousel` and `FeaturesIntro` each via
`WebGLShader`. Each holds GPU memory, each compiles its own shaders, and each
drives an uncapped `requestAnimationFrame` loop.

None of them pause when scrolled out of view. All three run for the entire
session. On integrated graphics — which is precisely the hardware FlashFX
markets itself to, per `/flashfx-vs-capcut-vs-davinci` — that is the difference
between a smooth page and a hot laptop.

Browsers also cap simultaneous WebGL contexts (commonly 8–16) and silently drop
the oldest when exceeded, which is a correctness risk as well as a speed one.

### Files

- `components/ui/shader-animation.tsx`
- `components/ui/web-gl-shader.tsx`
- `components/sections/Hero.tsx`, `ImageCarousel.tsx`, `FeaturesIntro.tsx`

### Changes

1. **Pause the rAF loop when off-screen.** IntersectionObserver on the
   container; stop the loop on exit, resume on entry. Cheapest large win here.
2. **Cap device pixel ratio** at 1.5–2. A retina display at DPR 3 renders nine
   times the pixels for no visible gain on a background effect.
3. **Reduce to one context if possible.** `ImageCarousel` and `FeaturesIntro`
   use the same component — consider one shared background rather than two.
4. **Honour `prefers-reduced-motion`**: render a static gradient instead of
   starting a renderer at all.
5. **Dispose properly on unmount** — geometries, materials, textures and the
   renderer itself, or client-side navigation leaks GPU memory per visit.

### Acceptance criteria

- [ ] At most one WebGL context actively rendering at any moment
- [ ] rAF loops stop when their container leaves the viewport
- [ ] `prefers-reduced-motion: reduce` starts no renderer at all
- [ ] No GPU memory growth across ten client-side navigations

### Verify

```bash
# chrome://gpu and DevTools → Performance → check for continuous GPU activity
# while the shader sections are scrolled out of view. Expect none.
```

---

## P5 — Code-split the heavy visual components

**Status:** NOT_STARTED
**Depends on:** P4 is easier first, but they are independent

### Why

`three.js` is statically imported by `shader-animation.tsx` and
`web-gl-shader.tsx`. Both render on the homepage, so the whole library lands in
the homepage's initial bundle. The homepage is **316 kB First Load JS** against
80–150 kB everywhere else, and this is the bulk of the difference.

None of these components is needed for first paint. Every one is decorative.

### Files

- `app/page.tsx`
- `components/sections/Hero.tsx`, `ImageCarousel.tsx`, `FeaturesIntro.tsx`,
  `CreatorStories.tsx`, `AllLinks.tsx`

### Changes

1. Load via `next/dynamic` with `ssr: false` and a lightweight placeholder:
   `ShaderAnimation`, `WebGLShader`, `BackgroundPaths`,
   `RadialOrbitalTimeline`.
2. Give each a static fallback that matches its final dimensions, so nothing
   shifts when the real component arrives.
3. Audit the other 137 client components for any that do not need
   interactivity — a section that only renders markup can be a server component
   and ship no JavaScript at all.

### Acceptance criteria

- [ ] Homepage First Load JS under 150 kB
- [ ] `three` absent from the initial homepage chunk
- [ ] No layout shift when a dynamic component mounts
- [ ] Every other route stays at or below its current size

### Verify

```bash
npm run build   # read the route table; / should be under 150 kB First Load
```

---

## P6 — Animation fluidity and reduced motion

**Status:** NOT_STARTED

### Why

93 components import `framer-motion`, and `CreatorStories` animates **72 SVG
paths** continuously via `background-paths.tsx`. SVG path animation is CPU-bound
and does not get the compositor fast path that transforms do.

The existing reveal idiom — `initial` / `whileInView` / `viewport={{ once: true }}`
— is well chosen: it animates `opacity` and `y`, both compositor-friendly, and
`once: true` means each element animates a single time. That part is right and
should be preserved.

There is no `prefers-reduced-motion` handling anywhere on the site. For some
users that is an accessibility failure, not a preference.

### Files

- `components/ui/background-paths.tsx`
- `app/globals.css`
- Any section animating a non-transform property

### Changes

1. **Add a global `prefers-reduced-motion` rule** in `globals.css` that
   neutralises animation and transition duration, and have JS-driven animation
   check the media query too.
2. **Cut or pause `background-paths`.** 72 continuously animating paths is the
   single most expensive animation on the site. Reduce the count, or pause when
   off-screen.
3. **Audit for layout-triggering animation.** Anything animating `width`,
   `height`, `top`, `left` or `margin` should move to `transform` and `opacity`.
4. **Check stagger delays.** Long `delay: index * n` chains on large lists keep
   the main thread busy well past the point the user has scrolled away.

### Acceptance criteria

- [ ] `prefers-reduced-motion: reduce` disables non-essential motion sitewide
- [ ] No long task over 50 ms during a scroll of `/`
- [ ] Scroll holds 60 fps on mid-tier hardware with 4× CPU throttling
- [ ] No animation of layout-triggering properties

### Verify

```bash
# DevTools → Performance → record a full scroll of / with 4x CPU throttle.
# Look for long tasks and dropped frames in the flame chart.
```

---

## P7 — Trim the font payload

**Status:** NOT_STARTED
**Impact:** smallest of the eight. Do it last.

### Why

Four Google Font families load on every route: Cormorant Garamond, Outfit,
JetBrains Mono and Lexend. Each is a separate font file fetched before text can
render in its final form.

`display: 'swap'` is already set on all four, which is correct and avoids
invisible text. But four families for a marketing site is more than the design
needs — several headings override the font inline to Georgia anyway.

### Files

- `app/layout.tsx`
- `tailwind.config.ts`

### Changes

1. **Count real usage of each family**, particularly Lexend, and drop any that
   earn their weight only once or twice.
2. **Reconcile the Georgia overrides.** Several heroes set
   `fontFamily: 'Georgia, serif'` inline while Cormorant loads as the display
   font. One of those two is redundant.
3. **Subset to `latin`** — already done, confirm it stays.
4. **Preload only the family used by the LCP text**, not all four.

### Acceptance criteria

- [ ] Three font families or fewer
- [ ] No layout shift attributable to font swap
- [ ] Display font of the hero is preloaded; the rest are not

---

## P8 — Measurement, budgets and regression guards

**Status:** NOT_STARTED
**Do this first in practice, even though it is listed last.**

### Why

Everything above is reasoned from architecture and file sizes, which are real
but are not timings. Without a baseline there is no way to prove any milestone
worked, and no way to stop the next change undoing it.

The site has no performance measurement of any kind today.

### Changes

1. **Take a baseline now, before P1.** Lighthouse on `/` and one sub-page,
   mobile preset, throttled. Record LCP, CLS, INP, TBT and total transfer size.
   Put the numbers in this file so later milestones can be compared against
   them.
2. **Re-measure after each milestone** and record the delta here.
3. **Set a bundle budget.** Fail the build, or at least warn loudly, if
   homepage First Load JS exceeds 150 kB.
4. **Watch the field data.** Search Console → Core Web Vitals will show real
   users once traffic exists, which matters more than any lab number.
5. **Guard the image rule.** A CI check that fails when anything over 200 kB
   lands in `public/` would have caught the 1.9 MB and 1.7 MB files.

### Acceptance criteria

- [ ] Baseline Lighthouse numbers recorded in this file
- [ ] Post-milestone numbers recorded after each of P1–P7
- [ ] A bundle-size budget exists and is enforced
- [ ] An asset-size guard exists for `public/`

### Baseline

_Not yet taken. Fill this in before starting P1._

| Metric | `/` | `/pricing` |
|---|---|---|
| LCP | | |
| CLS | | |
| INP | | |
| Total Blocking Time | | |
| Transfer size | | |
| Lighthouse Performance | | |

---

## Expected outcome

If P1–P5 land, the homepage should go from roughly **7 MB and 316 kB of JS
behind a 6-second overlay** to under **1.5 MB with sub-150 kB of JS and no
blocking overlay at all**. P1 and P2 alone should account for most of the
perceived improvement, because between them they remove the fixed 6-second delay
and several megabytes of third-party iframe code.

That is a projection from the measured payload, not a measurement. P8 is what
turns it into a fact.
