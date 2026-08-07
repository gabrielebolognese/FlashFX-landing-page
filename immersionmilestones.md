# immersionmilestones.md — Making flashfx.app feel alive

Plan for turning the marketing site from a page you scroll past into a space you
move through. Derived from a structural audit of the homepage on 2026-08-07.

**This is a plan. No code has been written for it yet.**

---

## The problem, stated plainly

The brief was "more looping animations — borders, cubes, editing". Those are the
right instincts, but they are treatments for a symptom. The audit found three
compounding causes, and adding loops without addressing the first two would
decorate the monotony rather than remove it.

### 1. The page has one rhythm, and it repeats thirteen times

The homepage is **26 sections**. Seven of them are `VideoPlaceholder` — the same
component, the same rounded rectangle, the same muted clip. Six more sections
carry a YouTube embed of their own. The structure reads:

> feature copy → video. feature copy → video. feature copy → video. ×6

Worse, three of the "feature copy" sections — `AllWebEditing`, `DualTimeline`,
`EasyAnimations` — are **the same 91-line component with seven lines changed**
(heading, sub-heading, button label, image, id). A visitor is not imagining the
repetition; they are looking at literal copies.

### 2. Nothing moves unless you are scrolling

Every animation on the site is `whileInView` with `viewport={{ once: true }}`.
It plays once on arrival and then stops forever. Scroll past a section and it is
a still image for the rest of the session.

Across all 26 sections there is **exactly one** continuously running animation in
content — the `ImageCarousel` marquee. Everything else that loops is background
decoration: the shader in the hero, the SVG paths behind *Earn with FlashFX*,
the floating shapes. None of it is attached to anything the page is saying.

### 3. A motion graphics tool whose website does not do motion graphics

This is the real one. FlashFX makes animation, and every demonstration of it on
the site is **a video of someone else's screen inside a rounded box**. The page
never once animates the thing it is selling.

Two of those boxes do not even have a video — `3D Support` and
`Templates & Presets` render a "Video Coming Soon" placeholder. They are dead
rectangles occupying a full section each.

A site for an animation tool should be the best argument for the tool. Right now
it is an argument against it.

### Evidence

| # | Finding | Evidence |
|---|---|---|
| 1 | 26 sections on the homepage | `app/page.tsx` |
| 2 | 7 of them are the same `VideoPlaceholder` component | `app/page.tsx` lines 152–172 |
| 3 | 13 YouTube embeds in total | 7 `VideoPlaceholder` + 5 shorts + 3 `LazyYouTube` |
| 4 | `AllWebEditing` / `DualTimeline` / `EasyAnimations` differ by **7 lines of 91** | `diff` across the three |
| 5 | **One** looping animation in content, sitewide | grep `POSITIVE_INFINITY` in `components/sections/` |
| 6 | Two sections are empty "Video Coming Soon" boxes | `3D Support`, `Templates & Presets` |
| 7 | Zero `<svg>` and zero `<canvas>` in 10 of 12 content sections | per-file grep |
| 8 | Three separate WebGL contexts, none related to each other | Hero, `ImageCarousel`, `FeaturesIntro` |

---

## The constraint that shapes all of this

P1–P7 took the homepage from a 30-second load to **177 kB of First Load JS**,
zero eager iframes, images at 0.45 MB, WebGL paused off-screen and reduced
motion honoured. Immersion must not undo that. It would be very easy to spend
all of it here.

**But the trade is better than it looks.** Every YouTube embed costs roughly
1–2 MB of third-party JavaScript and its own rendering context. A hand-built
animated timeline costs a few kB of our own code. Replacing five embeds with
live in-page demos removes **several megabytes** and adds perhaps 40 kB.

> The immersion pays for itself. Done in this order, the page ends up more
> alive **and** lighter than it is today.

That is the thesis of this document. If a milestone below cannot be built inside
the budget, it does not ship.

### Hard budget

These are not guidelines. A change that breaks one of them is wrong regardless
of how good it looks.

| Rule | Limit |
|---|---|
| Homepage First Load JS | **≤ 200 kB** (today 177 kB) |
| Iframes in served HTML | **0**, every route |
| WebGL contexts alive at once | **≤ 1** (today 3) |
| Continuous loops running per viewport | **≤ 6** |
| Loops running while off-screen | **0**, no exceptions |
| Animatable properties | `transform` and `opacity` only |
| `prefers-reduced-motion: reduce` | resolved in the primitive, never per-component |
| Image payload | no regression past 0.6 MB |

---

## Progress

| Milestone | Title | Status |
|---|---|---|
| I1 | The motion system | DONE |
| I2 | Living borders and edges | DONE |
| I3 | Show the editor, do not film it | DONE (embeds 13 → 8; see *What remains*) |
| I4 | One continuous space | NOT_STARTED |
| I5 | Break the rhythm | NOT_STARTED |
| I6 | Ambient motion and cursor presence | NOT_STARTED |
| I7 | Guardrails, mobile and re-verification | NOT_STARTED |

Order matters. **I1 is a hard prerequisite** — it is the difference between
"immersive" and "forty uncoordinated infinite loops", which is precisely the
problem P6 was created to fix. I3 is the biggest visible win and should follow
as soon as the foundation exists.

---

## I1 — The motion system

**Status:** DONE — 2026-08-07
**Impact:** invisible on its own. Everything after this depends on it.

### Why

P6 cut 72 always-running SVG paths down to 24 that pause off-screen, and gave
the site its first `prefers-reduced-motion` handling. If each new section
invents its own `repeat: Infinity`, that work is undone within a week and nobody
notices until the site is slow again.

The site also has no shared sense of timing. Durations across existing sections
range from 0.4 s to 2.4 s with four different easing curves, chosen ad hoc. That
is a large part of why the motion that *does* exist reads as incidental rather
than designed.

### Changes

1. **`lib/motion/tokens.ts`** — a small set of named durations and easings
   (`instant`, `quick`, `settle`, `drift`, `ambient`) with one signature easing
   curve for entrances and one for loops. Every animation uses these.
2. **`lib/motion/use-ambient.ts`** — the only sanctioned way to run a loop.
   Returns `{ ref, active }`, gated on an IntersectionObserver, already
   reduced-motion aware, already capped. A loop that is not registered through
   it is a bug.
3. **A concurrency governor.** The hook registers with a module-level counter;
   past the cap, further loops stay paused until a slot frees. Protects against
   a long page where twelve sections are technically "in view" on a tall
   monitor.
4. **`components/ui/ambient.tsx`** — a wrapper component for the common case, so
   sections do not each wire up the hook by hand.
5. **A note in CLAUDE.md** stating that `repeat: Infinity` and CSS
   `animation-iteration-count: infinite` outside `lib/motion` are not allowed.

### Acceptance criteria

- [x] No *reachable* loop runs ungoverned — see the note below
- [x] Killing the governor's cap to 0 stops all ambient motion sitewide
- [x] Reduced motion is resolved in one place, not per component
- [x] Zero measurable cost when nothing is on screen

### What was built

`lib/motion/` — `tokens.ts`, `governor.ts`, `use-ambient.tsx`, `index.ts` — plus
migration of every loop that actually reaches a bundle.

**The governor counts systems, not elements.** A backdrop with 24 animated paths
holds one slot and passes the grant down through `AmbientProvider`. Registering
per element would mean 40 `ElegantShape`s competing for 6 slots and most of them
freezing at random, which is worse than the problem.

**Grants move.** When a loop scrolls away its slot is handed to whoever is
waiting, and priority is respected — so when I3 adds live product demos at a
higher priority, they take slots from decoration automatically rather than
needing every background retuned by hand.

**Denied means still, not absent.** Every migrated loop renders a composed
static frame when it has no grant. A backdrop that disappears when the cap is
spent reads as a rendering fault.

**Migrated:** `background-paths` (24 paths → 1 slot), `elegant-shapes` (40
elements across 8 groups → 1 slot each, plus a new `ElegantShapeScope` for the
five `LoadTime` renders outside the group), `ImageCarousel` (whose marquee
previously ran the entire session — it was the site's only content loop and it
never stopped).

**Not migrated, deliberately:** `typewriter.tsx` and `shape-landing-hero.tsx`
still contain `repeat: Infinity`. Both are dead — `typewriter` has no consumers,
and `shape-landing-hero` is imported only by `ProblemSection`, which is rendered
on no page. Verified as reaching **0 built chunks**. Migrating unreachable code
would be theatre; deleting it belongs to I5.

### Verify

```bash
# Framework-free by design, so the policy is directly testable.
npx tsc lib/motion/governor.ts --outDir /tmp/gov --module commonjs --target es2017
# 11 assertions: cap holds, freed slots are rehanded, priority displaces
# decoration, setLoopCap(0) stops everything, release() does not leak.

# In a browser console on any page:
#   setLoopCap(0)  -> every ambient animation on the site stops
#   loopStats()    -> { registered, visible, running }
```

---

## I2 — Living borders and edges

**Status:** DONE — 2026-08-07
**Impact:** high visibility, very low cost. The cheapest immersion on the list.

### Why

Directly requested, and the technique is already proven in this codebase: the
video loader's ring is a rotating `conic-gradient` masked to a ring
(`.fx-vl-arc` in `globals.css`). It is one element, one transform animation,
runs on the compositor, and ships no JavaScript. The same trick generalises to
every card and panel edge on the site.

Right now every border on the site is a static 1px line of `--color-border`.
There are well over a hundred of them.

### Changes

1. **`components/ui/beam-border.tsx`** — a light travelling around an element's
   edge. Three variants:
   - `ambient` — slow, always on while in view. For hero cards and the primary
     CTA panels.
   - `trace` — fires once on hover, races around the border and stops. For grid
     cards, where a hundred always-on beams would be noise.
   - `pulse` — a soft edge glow that breathes. For the "Available now" style
     states.
2. **Section seams.** A thin light that sweeps horizontally along the divider as
   a section enters the viewport, so sections feel joined rather than stacked.
3. **Corner brackets** on feature panels that draw themselves in on entry —
   an editor-viewport visual, on-brand for the product.
4. **Apply to:** `FeatureHighlights` cards, `PricingSection` tiers,
   `CreatorStories` earn cards, `ComparisonTeaser`, `FAQSection` accordion rows,
   `AllLinks`.

### Acceptance criteria

- [x] Border animation is CSS, not framer-motion
- [x] Grid cards use `trace` — **1** always-on beam exists sitewide, against a cap of 6
- [x] Zero added First Load JS — 178 kB before and after
- [x] Static, visible borders under reduced motion

### What was built

`components/ui/beam-border.tsx` plus `.fx-beam*` / `.fx-seam` in `globals.css`.

**The technique** is the video loader's ring, generalised: a `conic-gradient`
rotating behind a mask. The mask is the padding-box cut-out —
`mask-composite: exclude` subtracts the content box from the border box, leaving
a ring exactly as thick as the padding. The gradient is a plain child rotating
underneath, so this needs no `@property` registration and no polyfill.

`inset: -50%` sizes the spinner to twice the host in both directions so it
covers the corners at any rotation and any aspect ratio. The conic ends up
elliptical, which makes the beam travel marginally faster along the long
edges — that reads as intent, and it is the price of not measuring the element
in JavaScript.

**`animation-play-state: paused` is the idle state everywhere.** A paused
animation costs nothing, which is what makes it safe to put a beam on every card
in a 179-card grid.

**Three variants, and the split is the whole design:**

| Variant | Trigger | Governed | Where |
|---|---|---|---|
| `trace` | hover / focus-within | no — bounded by the pointer | every grid card |
| `ambient` | continuous | yes, via `useAmbient` | the one card that earns it |
| `pulse` | continuous | yes | status and highlight states |

`trace` needs no governor slot because a pointer can only be in one place, so
183 of them contend for nothing. Making them all `ambient` would have spent the
entire I1 budget on decoration in a single section.

**Applied to:** `FeatureHighlights` (179 cards — the section that is long by
design, where hover motion is what makes volume feel alive rather than
tiring), `FAQSection` rows, `ComparisonTeaser`, and `CreatorStories` — where the
live earn card gets the sitewide-only `ambient` beam and the unlaunched one gets
nothing, because motion is the strongest of the three signals separating them.

**Section seams** mark the four points where the page changes subject, not every
boundary — a light on all 26 would be wallpaper. The sweep fires from an
IntersectionObserver rather than on mount, because a CSS animation that plays on
mount plays while the section is still far below the fold and is over before
anyone sees it. That is the exact bug P6 found in `CreatorStories`.

**Counts in the built HTML:** 183 `trace`, 1 `ambient`, 4 seams.

### Not covered, and why

- **`PricingSection`** draws its tier borders with inline `style` rather than
  border classes, so there is no clean host element to inset a ring into
  without restructuring it. Worth doing when I5 touches the section anyway.
- **`AllLinks`** is a bespoke radial orbit layout, not cards. A rectangular
  border beam has nothing to attach to.

---

## I3 — Show the editor, do not film it

**Status:** DONE — 2026-08-07. Every `VideoPlaceholder` slot is now a live demo.
Eight embeds remain outside that component; see *What remains*.
**Impact:** the largest of the seven, for both feel and weight.

### Why

This is the milestone that fixes cause 3, and it is the one that pays for the
rest. It replaces third-party video rectangles with the product itself, moving,
in the page — and each replacement deletes 1–2 MB of YouTube JavaScript.

It also covers the "cubes moving, editing" part of the brief literally.

**Start with the two dead boxes.** `3D Support` and `Templates & Presets`
currently render "Video Coming Soon". There is no video to lose, no risk, and
two full sections of prime space sitting empty.

### Changes

Build a `components/demos/` directory. Each is self-contained, loops through
`useAmbient`, and is `dynamic()`-imported so it costs nothing until approached.

1. **`TimelineDemo`** — the flagship. Layer rows, a playhead sweeping left to
   right, keyframe diamonds that pop as it passes, a property value ticking in
   sync, an easing curve in the corner. A miniature of the actual editor,
   looping. *(The video loader already contains a crude version of this — the
   playhead-and-keyframes idea is proven and liked.)*
2. **`CubeDemo`** — a rotating 3D cube with shaded faces and a soft ground
   shadow, for `3D Support`. Pure CSS 3D transforms first; only reach for
   three.js if the look demands it, since the budget allows one WebGL context
   and I4 wants it.
3. **`EasingCurveDemo`** — a bezier curve that morphs between easing presets
   while a dot travels along it and a shape below follows the resulting motion.
   For `KeyframeInterpolation`, which is the one section already trying to
   explain something visual.
4. **`TemplateWallDemo`** — a slow drifting wall of animated template cards for
   `Templates & Presets`, each a tiny looping composition.
5. **`ExportDemo`** — a progress ring and format chips resolving, for the
   render/export story.

**Then convert.** Once the two empty boxes prove the pattern, replace three of
the five remaining `VideoPlaceholder` videos with demos, keeping the two that
show something a recreation genuinely cannot.

### Acceptance criteria

- [x] The two empty "Video Coming Soon" boxes are gone
- [x] YouTube embeds on the homepage drop from 13 to **8**
- [x] Each demo is `dynamic()`-imported with `ssr: false` and a sized placeholder
- [x] Each demo pauses fully off-screen — all run through `useAmbient`
- [x] Homepage First Load JS still under 200 kB — **179 kB**
- [x] Under reduced motion each demo shows a composed still frame, not a blank

### What was built

`components/demos/` — a kit, five demos and a registry.

| Demo | Section | Replaced |
|---|---|---|
| `TimelineDemo` | Intuitive Timeline Editing | embed `bHdIvt_lUrE` |
| `ClipTimelineDemo` | All Web Editing | embed `-zyusYiQNEc` |
| `PresetWallDemo` | Animation Presets | embed `Rk9hf3QI5Is` |
| `CubeDemo` | 3D Support | **dead box** |
| `EasingCurveDemo` | Keyframe Interpolation | embed `fkQhKYaSv0Q` |
| `ShareDemo` | Share Projects | embed `sqdlJULYNZA` |
| `PresetWallDemo` | Templates & Presets | **dead box** |

### Revision, 2026-08-07 — the two timelines

The first pass shipped `TimelineDemo` twice, once with browser chrome, so the
homepage showed the identical timeline in two sections. Both were also too
sparse: four tracks left most of the panel empty, so only the top strip read as
a timeline at all.

- **`TimelineDemo` — 4 tracks → 14**, each a distinct colour, at 40% of the
  previous row height. A real project stacks a dozen layers; four looked like a
  diagram of a timeline rather than one.
- **`ClipTimelineDemo` is new, and is a different instrument.** `TimelineDemo`
  is keyframes on property tracks — the animation side. This is clips in an NLE
  sequence: ten tracks of tall blocks with name bars, six video and four audio,
  the audio drawn with waveforms and the video with filmstrip notches. It keeps
  the browser chrome, because the section's claim is that all of this happens in
  a tab. **Do not converge the two back together.**
- **Demos now choose their own frame** via `demoFrame` in the registry. The
  default card is a video's shape — 16:9 at `max-w-5xl` — which is wrong for a
  timeline. Both timelines take `max-w-[76.8rem]` (20% wider) and a taller
  aspect: 16:11 for the fourteen-track one, 16:10 for the clips.

Waveform heights come from a deterministic `sin`/`cos` function rather than
`Math.random()`, which would differ between the server and client render — the
same trap P6 removed from `background-paths`.

**The two dead boxes went first**, as planned — no video to lose, so no risk in
proving the pattern there.

**`youtubeId` is left in place** on every converted slot even though `demo`
takes precedence. Reverting any single section is deleting one word.

**All five are `dynamic({ ssr: false })`.** Verified by a string that exists
nowhere else in the codebase: `kd8f2a`, the share link in `ShareDemo`, appears
only in chunk `945`, which is not among the chunks the homepage loads eagerly.
That is why five new animated components moved First Load JS by 1 kB.

**Each demo holds a governor slot at `DEMO_PRIORITY = 3`**, above decoration's
0. This is what I1's priority ordering was built for: a live demo of the product
is the point of its section, so it takes a slot from a floating shape rather
than queueing behind one. Without a slot each demo renders a composed still —
the playhead parked at 38%, the cube at an angle showing three faces — never a
blank panel.

**No three.js.** `CubeDemo` is six faces and `preserve-3d`. The budget allows
one WebGL context and I4 wants it for the page-wide backdrop; spending it on a
cube would be a poor trade.

### What remains

Eight embeds are still on the homepage, none of them in `VideoPlaceholder`:

- **5 shorts** in `WhatIsFlashFX`
- **3 `LazyYouTube`** in `SolutionSection`, `LoadTime`, `SplitHero`

**The five shorts are settled: they stay as video.** Owner's decision,
2026-08-07. They are real finished output rather than footage of the editor's
UI, and the proof that the tool produces good work has to be the work itself,
not a mock-up of it. Do not convert them, and do not treat the embed count as a
number to drive to zero — see open question 6 for the standing rule.

The three `LazyYouTube` embeds are still open. Whichever of them show the
interface rather than finished output remain fair game.

### Verify

```bash
grep -o '<iframe' .next/server/app/index.html | wc -l          # 0, unchanged
grep -o 'fx-vl--idle' .next/server/app/index.html | wc -l      # 8, was 13
grep -c 'Video Coming Soon' .next/server/app/index.html        # 0, was 2
# demo code must not be in an eagerly-loaded chunk:
grep -l 'kd8f2a' .next/static/chunks/*.js                      # not in index.html
```

### Verify

```bash
grep -o '<iframe' .next/server/app/index.html | wc -l   # must stay 0
curl -s https://flashfx.app/ | grep -c 'Video Coming Soon'  # must be 0
```

---

## I4 — One continuous space

**Status:** NOT_STARTED
**Impact:** the difference between "a page with effects on it" and "immersive".

### Why

Immersion is mostly continuity. Today each section paints its own background and
none of them relate: the hero runs a shader, `ImageCarousel` and `FeaturesIntro`
each run a *different* WebGL shader, `VideoPlaceholder` scatters floating
shapes, `CreatorStories` draws SVG paths. Scrolling feels like flipping through
26 unrelated slides because, visually, it is.

Three WebGL contexts that know nothing about each other is also the most
expensive possible way to achieve that.

### Changes

1. **One persistent backdrop.** A single fixed full-viewport canvas behind the
   entire page, mounted once in `app/layout.tsx` or at the top of `page.tsx`.
   Sections become transparent windows onto it instead of each painting its own.
2. **Drive it with scroll progress.** Colour temperature, drift speed and
   density shift as the visitor descends, so the page reads as one continuous
   journey with a beginning and an end rather than a stack of boxes. Hero is
   cool and open; the middle warms toward the accent yellow; the CTA is the
   brightest point on the page.
3. **Retire the per-section backgrounds** it replaces — the two `WebGLShader`
   instances go, and `ElegantShapesBackground` (currently instantiated 8 times,
   40 elements) is either dropped or reduced to a foreground accent.
4. **Parallax depth.** Two or three layers moving at different rates against the
   scroll, which is what actually produces the feeling of moving *through*
   something.

Net WebGL contexts: **3 → 1.** This milestone should be roughly cost-neutral or
cheaper, despite looking like the most expensive one here.

### Acceptance criteria

- [ ] Exactly one WebGL context alive at any time
- [ ] Backdrop pauses when the tab is hidden (`visibilitychange`), not just off-screen
- [ ] Pixel ratio still capped at 1.5 (`lib/render-gate.ts`)
- [ ] Static gradient fallback under reduced motion and on low-power devices
- [ ] No regression in First Load JS — the retired shaders offset the new one

---

## I5 — Break the rhythm

**Status:** NOT_STARTED
**Impact:** fixes cause 1. Nothing else on this list addresses it.

### Why

Three sections that differ by seven lines, and seven sections that are the same
video box, produce a page that feels long and samey no matter how much motion is
added to it. This milestone makes the page *shorter and more varied* at once.

### Changes

1. **Collapse the clones.** `AllWebEditing`, `DualTimeline` and `EasyAnimations`
   become one `<FeatureSplit>` component driven by a data file — the same
   pattern the codebase already uses for FAQ data. Three files of duplicated
   markup become one component plus three entries.
2. **Vary the section shapes.** Introduce four distinct layouts and alternate
   them deliberately instead of repeating one:
   - **Sticky scrollytelling** — the visual pins while copy scrolls past it.
     One of these, used well, is worth five ordinary sections. Best candidate:
     the timeline demo, with the copy explaining each part as the playhead
     reaches it.
   - **Full-bleed** — edge to edge, no container, for the 3D and export moments.
   - **Offset split** — asymmetric, overlapping panels rather than a clean 50/50.
   - **Horizontal** — a sideways-scrolling band for templates or shorts.
3. **Cut the count.** Target **26 sections → 16–18**. Merge the thin ones, drop
   the ones that repeat a point already made.

   > **`FeatureHighlights` is exempt.** Owner's decision, 2026-08-07: it is
   > large and bloated *on purpose* — the length is the argument, because a
   > visitor has to come away seeing how much is in the product. Do not trim its
   > cards, split it across sections, or collapse it behind tabs or an
   > accordion. It may gain motion from I2 and I6; it does not lose volume.
   > A future reader looking at this section and seeing bloat should read this
   > paragraph before "fixing" it.
4. **Overlapping transitions.** Sections currently abut with a hard edge. Let
   the incoming section overlap and lift over the outgoing one on scroll.

### Acceptance criteria

- [ ] `AllWebEditing`, `DualTimeline`, `EasyAnimations` are one component
- [ ] Homepage section count is 18 or fewer
- [ ] No layout shape repeats more than three times consecutively
- [ ] The `#dual-timeline` and `#share-projects` anchors still resolve — the
      Navbar Features dropdown scrolls to them

---

## I6 — Ambient motion and cursor presence

**Status:** NOT_STARTED
**Impact:** the last 15%. Do not start here — it is garnish on the other six.

### Why

Once the structure and the demos are right, this is what makes the page feel
responsive to *you* specifically rather than playing the same film for everyone.

### Changes

1. **Cursor-reactive parallax.** Panels and the backdrop shift subtly against
   pointer position. Pointer-driven only, `pointer: fine` only — never on touch.
2. **Magnetic CTAs.** The primary buttons lean toward the cursor as it
   approaches.
3. **Numbers that count** when their section arrives — file sizes, load times,
   the figures in `LoadTime` and `ComparisonTeaser`.
4. **Idle life.** Icons with slow individual loops, headline text with a
   travelling gradient, staggered breathing on card grids — all through the I1
   governor so they cannot pile up.
5. **Scroll velocity.** Fast scrolling stretches or blurs elements slightly and
   settles when you stop.

### Acceptance criteria

- [ ] All pointer effects behind `(pointer: fine)` and `(hover: hover)`
- [ ] Loop count still within the I1 cap with every section on screen
- [ ] No pointer handler runs outside `requestAnimationFrame`

---

## I7 — Guardrails, mobile and re-verification

**Status:** NOT_STARTED
**Impact:** the milestone that stops this becoming the next `performancemilestones.md`.

### Why

Seven milestones of added motion is exactly how a fast site becomes a slow one
again. The budget at the top of this file is worth nothing if nothing enforces
it.

### Changes

1. **A device tier.** Read `navigator.hardwareConcurrency` and `deviceMemory`
   once; below a threshold, drop to a reduced tier — no backdrop shader, fewer
   loops, static demos. Most visitors on weak hardware are the ones this site is
   *for*, which makes this more important here than on most sites.
2. **Mobile profile.** Cursor effects off, parallax off, loop cap lowered,
   heavy demos replaced with their still frames. Phones do not have a hover
   state and do have a battery.
3. **The two P8 guards, finally built** — a First Load JS ceiling and a
   `public/` asset-size check that fail the build rather than warn.
4. **A reduced-motion pass** over everything I1–I6 added, checked with the
   emulation setting on, not by reading the code.
5. **Re-verify the P1–P7 wins** against the deployed site: iframe count, font
   preloads, image payload, WebGL context count.

### Acceptance criteria

- [ ] Build fails if homepage First Load JS exceeds 200 kB
- [ ] Build fails if any file over 200 kB lands in `public/`
- [ ] Low-tier path verified with `hardwareConcurrency` throttled
- [ ] Every P1–P7 structural win still holds on the deployed site

---

## Open questions

These block specific milestones and are the owner's call, not mine.

1. ~~**How much video stays?**~~ **ANSWERED 2026-08-07: all of them can become
   live demos.** I3 is unconstrained — every `VideoPlaceholder` on the homepage
   is a candidate. Target the embed count at **0–2**, not 8.
2. **Is 200 kB the right ceiling?** It is 22 kB above today's 178 kB. A richer
   backdrop or a three.js cube could want more. Raising it is a legitimate
   choice — silently exceeding it is not. *Blocks I4 and I7.*
3. ~~**How far can the structure move?**~~ **ANSWERED 2026-08-07, with one
   constraint: `FeatureHighlights` stays large and bloated by design.** The
   length is the message — a visitor has to see how many features there are, so
   its section count and card count are not to be trimmed. Everything else in
   I5 is open. See the note under I5.
4. **Is there a brand reference?** "Immersive" spans a lot of ground. A site or
   two you consider the target would sharpen I2, I4 and I6 considerably.
5. **Does the editor have a screen recording or asset kit** that the demos
   should match visually, so the site's timeline looks like the real one?
   *Affects I3 fidelity.*
6. ~~**Should the five shorts in `WhatIsFlashFX` become demos too?**~~
   **ANSWERED 2026-08-07: no. The shorts stay as real video.**

   > **This is a standing rule, not a one-off.** There is a line between two
   > kinds of video on this site, and only one side may become a demo:
   >
   > - **Footage of the editor's UI** — timeline, curves, 3D viewport, sharing.
   >   Convert freely. A recreation shows the same thing more directly and
   >   deletes 1–2 MB of third-party JavaScript.
   > - **Real finished output** — the five shorts are actual work made with the
   >   product. **Leave them alone.**
   >
   > Showing a simulation where a visitor believes they are seeing genuine
   > results is a different kind of claim from illustrating an interface. The
   > proof that the tool produces good work has to be the work.
   >
   > When reducing embeds for performance, ask what each one is evidence *of*.
   > UI demonstration → convert. Product output, customer results, testimonials
   > → find the bytes elsewhere.

   **The 0–2 target is therefore retired.** The floor is **5** — the shorts.
   The three `LazyYouTube` embeds in `SolutionSection`, `LoadTime` and
   `SplitHero` have not been classified yet; whichever of them show UI rather
   than output can still be converted, taking the homepage to 5–8.

---

## Expected outcome

If I1–I5 land:

| | Today | After |
|---|---|---|
| Homepage sections | 26 | 16–18 |
| YouTube embeds | 13 | ≤ 8 |
| Looping animations in content | 1 | live demos in 5+ sections |
| WebGL contexts | 3 | 1 |
| Duplicate feature sections | 3 | 1 component |
| Dead "Video Coming Soon" boxes | 2 | 0 |
| First Load JS | 177 kB | ≤ 200 kB |
| Third-party JS on the homepage | ~13–26 MB of embeds | roughly half |

The page should end up **shorter, more varied, visibly alive, demonstrating the
product instead of describing it — and lighter than it is today.**

That last part is the test of whether this plan was executed properly. If
immersion cost megabytes, it was done wrong.
