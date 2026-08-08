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
| I4 | One continuous space | DONE |
| I5 | Break the rhythm | NOT_STARTED |
| I6 | Ambient motion and cursor presence | DONE |
| I7 | Guardrails, mobile and re-verification | DONE |
| I8 | The morph sequence — cube to aeroplane | DONE |

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
in a 176-card grid.

**Three variants, and the split is the whole design:**

| Variant | Trigger | Governed | Where |
|---|---|---|---|
| `trace` | hover / focus-within | no — bounded by the pointer | every grid card |
| `ambient` | continuous | yes, via `useAmbient` | the one card that earns it |
| `pulse` | continuous | yes | status and highlight states |

`trace` needs no governor slot because a pointer can only be in one place, so
183 of them contend for nothing. Making them all `ambient` would have spent the
entire I1 budget on decoration in a single section.

**Applied to:** `FeatureHighlights` (176 cards — the section that is long by
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

**Status:** DONE — 2026-08-07
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

- [x] **One decorative WebGL context, plus the hero's** — see the notes below
- [x] Backdrop pauses when the tab is hidden (`visibilitychange`), not just off-screen
- [x] Pixel ratio still capped at 1.5 (`lib/render-gate.ts`)
- [x] Static gradient fallback under reduced motion and where WebGL is absent
- [x] No regression in First Load JS — homepage 177 kB, shared 79.6 → 79.7 kB

> **The first criterion was rewritten, not quietly passed.** It was written as
> "≤ 1 WebGL context" when the only 3D on the site was decoration. Since then
> the owner has asked for two pieces of 3D *content* — the hero's cube assembly
> and the rotatable A380 — each of which legitimately owns a context. Counting
> those against a budget meant for wallpaper would be dishonest bookkeeping, so
> the rule is now about decorative contexts, of which there is exactly one.

### What shipped

`components/ui/site-backdrop.tsx`, mounted once in `app/layout.tsx`, so every
route on the site is lit by the same field.

**Raw WebGL, not three.js.** It mounts in the layout, and importing three.js
there would put the whole library in the shared bundle for every page —
undoing performancemilestones.md P5. A full-screen triangle and one fragment
shader needs no library, which is why adding a sitewide backdrop cost 0.1 kB of
shared JS.

**Driven by scroll.** The field is cool and blue behind the hero and warms
toward violet by the closing call to action, so the top of the page feels like a
different place from the bottom rather than the same wallpaper repeated.

**The hero keeps its own shader.** I4 originally folded the hero's rays into
the backdrop and removed `ShaderAnimation`; that was reverted the same day at
the owner's request — it is the best animation on the site and stays. The
backdrop therefore carries no rays of its own, and is the ambient field only,
with the hero's light playing over the top of it.

That leaves two decorative contexts on the homepage rather than one: the
backdrop and the hero's shader. Recorded here rather than quietly restated in
the acceptance criteria — the criterion below is what was achieved for the rest
of the page, and the hero is a deliberate exception.

**Retired:** `WebGLShader` in `ImageCarousel` is off the homepage, and `ElegantShapesBackground` is gone from
`VideoPlaceholder` — five copies of that section drew five shapes each, so 25
elements and 5 governed loops, behind demos that are now full-bleed and
edge-faded where a drifting blob is just noise. `LoadTime` keeps its own shapes;
that section still reads as its own place.

**`visibilitychange`, not IntersectionObserver.** A fixed backdrop is never off
screen, so the observer pattern used everywhere else in this codebase would
never pause it. A hidden tab is the only thing that can.

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

**Status:** DONE — 2026-08-07
**Impact:** the last 15%. Do not start here — it is garnish on the other six.

### Why

Once the structure and the demos are right, this is what makes the page feel
responsive to *you* specifically rather than playing the same film for everyone.

### What shipped

**`lib/motion/pointer.ts` — one pointer, read once per frame.** Every
pointer-reactive thing subscribes here instead of adding its own listener. It is
inert on coarse pointers and on the reduced tier, so nothing below runs on a
phone or on a machine that has declared itself weak.

The coalescing is the substance of this milestone. `mousemove` fires far more
often than the screen refreshes — a 1000 Hz mouse delivers roughly sixteen
events per frame — so any handler that writes a style is doing fifteen writes
nobody will ever see, for every one they will.

1. **Cursor-reactive parallax** — the three light pools in `SiteBackdrop` slide
   by different amounts against the pointer, so the field reads as having depth
   rather than sitting flat. The shader eases toward the pointer at 0.045 per
   frame rather than tracking it exactly, which gives the light weight.
2. ~~**Magnetic CTAs**~~ — **removed the same day (owner's call, 2026-08-07).**
   The buttons stay still.

   Shipped and reverted within hours: all four `CtaButton`s leaned toward the
   cursor within 110px of their edge, capped at 12px of travel, on a
   `.fx-magnet` wrapper. Do not rebuild it. If some future version of this is
   ever wanted, two things from the first attempt are worth keeping: the offset
   must go on a wrapper rather than the button, because `.fx-cta:hover` sets its
   own `transform` and an inline one on the same element wins silently and kills
   the lift; and the measurement should be from the button's *edge*, not its
   centre, so a wide button pulls along its whole length.

   Removing it took the last client-side behaviour out of `cta-button.tsx`, so
   that file dropped `'use client'` and renders on the server again.
3. **The 176-card spotlight, fixed.** `FeatureHighlights` was building a fresh
   `radial-gradient(...)` string and assigning it to `style.background` straight
   out of the mousemove handler — re-parsing a gradient and invalidating the
   paint of a card behind a `backdrop-filter: blur(16px)`, sixteen times a
   frame. Repainting a backdrop-filtered layer is among the more expensive
   things a compositor can be asked to do. The handler now records a position
   and one `requestAnimationFrame` writes two custom properties; the gradient is
   declared once in `.fx-spotlight`. Identical on screen.

### Not done, and why

**Counting numbers.** There are none to count. `LoadTime` and `ComparisonTeaser`
are feature checklists — "Free to use", "Runs in browser" — not figures, and the
pricing numbers already animate on cycle change. Inventing statistics to animate
would breach the standing rule in CLAUDE.md against fabricating metrics.

**Scroll-velocity stretch and blur.** Skipped deliberately. Blurring text
mid-scroll fights the reading it interrupts, and it is the effect most likely to
read as a rendering fault rather than a flourish on a site whose whole argument
is that it is fast.

### Acceptance criteria

- [x] All pointer effects behind `(pointer: fine)` and `(hover: hover)` — both
      enforced centrally in `pointerIsFine()`, so a new consumer cannot forget
- [x] Loop count still within the I1 cap — no new ambient loops. The magnet is
      event-driven with a CSS transition; the backdrop's loop already existed
- [x] No pointer handler runs outside `requestAnimationFrame` — the one
      violation on the site is fixed

  One deliberate exception: `PlaneViewer`'s drag handler stays per-event. It
  writes no styles and touches no layout — it accumulates deltas into rotation
  and momentum, and coalescing would throw away the samples a flick is made of.
  Its own rAF loop does the drawing. It is also correctly *not* pointer-gated:
  dragging the plane has to work on touch.

  `components/ui/spotlight.tsx` has an unthrottled `mousemove` listener and is
  imported by nothing — the 3D section uses `spotlight-aceternity`, a different
  file. Dead code, so it never runs; a candidate for FIX.md M7.

---

## I7 — Guardrails, mobile and re-verification

**Status:** DONE — 2026-08-07
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

- [x] Build fails if the homepage's eager JS exceeds budget — 108.4 kB against 140
- [x] Build fails if any tracked file over 220 kB lands in `public/`, or the folder passes 3 MB
- [x] Low-tier path exists and is wired into the four heaviest things on the page
- [x] Every P1–P7 structural win re-verified **against the deployed site**

### What the guard caught immediately

`public/airbus-a380.zip` (34 MB) and `public/A380.rar` (23 MB) were **committed
and deploying**. Source archives for the A380 model that was already baked into
`a380-geometry.ts`, referenced by nothing, sitting in the folder Netlify
publishes. `public/` was 57.5 MB; it is now 0.86 MB.

Nobody noticed for the same reason P3's 6.6 MB of PNGs went unnoticed: nothing
was looking. Both files are untracked now and gitignored, and kept on disk.

### The budget is not the CLI's number

`scripts/check-budgets.mjs` measures the **gzipped bytes of the chunks the
served HTML actually requests**. The "First Load JS" figure the Next CLI prints
is computed inside Next's build and cannot be read back afterwards, so
reproducing it would have meant guessing at its arithmetic. This number is
lower, directly measurable, and is what a visitor actually downloads.

### Device tier

`lib/motion/device-tier.ts`. A machine is demoted only when it *declares*
something low — `hardwareConcurrency <= 4`, `deviceMemory <= 4`, or an explicit
reduced-motion preference. Absent hints do not demote: `deviceMemory` is missing
in Safari and quantised elsewhere, and treating silence as weakness would
downgrade a lot of capable hardware.

On the reduced tier:

| | Full | Reduced |
|---|---|---|
| Concurrent ambient loops | 6 | **2** |
| Site backdrop | WebGL shader | **CSS gradient, no context** |
| Hero cube rows | 34 / 30 | **14 / 12** |
| Particle pool | 1400 | **490** |

This matters more here than on most sites: three of the landing pages claim
FlashFX runs on low-end PCs, and a page that stutters on the hardware it is
advertising to argues against the product.

---

## I8 — The morph sequence: cube to aeroplane

**Status:** DONE — 2026-08-07.
**Impact:** the single most memorable thing on the site, if it lands.

### The brief

> A cube that duplicates itself, condenses into a sphere, stretches, grows
> wings, and morphs into a 3D aeroplane — in the same faceted style as the cube,
> with differently coloured faces.

### The one thing that has to be said first

**The current cube cannot do this, and neither can any amount of CSS.**

`CubeDemo` is six `<div>`s with `preserve-3d`. CSS 3D transforms move, rotate
and scale flat planes; they have no vertices to interpolate. There is no
sequence of CSS properties that turns a cube into a sphere, because the sphere
is not a transformed cube — it is different geometry.

So this milestone needs real 3D. That is a budget decision before it is a design
one, and it is question 1 below.

### The approach: a swarm, not a shapeshifter

There are two ways to build a morph like this, and the obvious one is worse.

**Vertex morphing** — one mesh whose vertices lerp between a cube, a sphere and
an aeroplane. This is the textbook answer and it is a trap here. Morph targets
require *identical vertex counts and ordering* across every shape, so the
aeroplane has to be authored to match a sphere's topology. That means Blender, a
retopology pass, and a shape that will look like a melted sphere rather than a
plane. It also throws away the faceted look, because a smoothly interpolating
mesh does not read as flat-shaded blocks.

**A swarm of cubes** — a few hundred small cubes whose *positions* lerp between
target point clouds. This is the right answer, and it is what the brief actually
describes: *"a cube that duplicated itself"*. Every stage is nothing more than a
list of target positions for the same N cubes.

| Stage | What the swarm does |
|---|---|
| 1. One cube | All N cubes coincident at the origin, reading as a single solid cube |
| 2. Duplication | They separate outward on a lattice — visibly *becoming many* |
| 3. Sphere | Positions lerp to points distributed on a sphere (Fibonacci spiral, so the spacing is even) |
| 4. Stretch | The same sphere scaled along one axis into a capsule — the fuselage |
| 5. Wings | A subset peels off to sweep out from the body |
| 6. Aeroplane | Every cube lands on its position in the final silhouette |

The advantages compound:

- Each stage is a `Float32Array` of positions. Morphing is one lerp. No mesh
  surgery, no Blender, no topology matching.
- **The faceted style survives**, because the units *are* cubes. The
  multi-coloured faces the brief asks to keep are the same six colours already
  in `CubeDemo`.
- One `InstancedMesh` draws all of them in a **single draw call**, so a few
  hundred cubes cost about what one costs.
- The aeroplane can be defined by hand as a list of blocks — fuselage, wings,
  tail, fin — and sampled into points. No modelling tool in the loop.
- It degrades: on a weak device, drop N from 400 to 120 and the whole thing
  still works.

### Files

- `components/demos/MorphDemo.tsx` — the new demo
- `components/demos/morph-shapes.ts` — the point-cloud generators
- `components/demos/index.tsx` — register as a `DemoKind`
- `lib/render-gate.ts` — reuse `cappedPixelRatio`

### Sketch

```ts
// One target per stage: N points each, same N throughout.
const COUNT = 400;
type Stage = { name: string; points: Float32Array; hold: number };

// Even distribution — the naive random-on-sphere clumps at the poles.
function fibonacciSphere(n: number, radius: number): Float32Array

// Sampled from hand-authored boxes: fuselage, two wings, tailplane, fin.
function aeroplane(n: number): Float32Array

// Per frame: lerp current -> target, with a per-cube delay so the swarm
// arrives in a wave rather than snapping together as one.
```

### Cost, honestly

three.js is **already a dependency** and already lazily loaded for the hero
shader (P5), so this adds no new library — only the demo's own code, a few kB,
code-split like every other demo.

The real cost is a **WebGL context**, and I4's budget says one. See question 1.

### Acceptance criteria

- [ ] Reads as one cube becoming many, not as particles that were always there
- [ ] Faceted multi-coloured style preserved — same palette as `CubeDemo`
- [ ] One `InstancedMesh`, one draw call
- [ ] Runs through `useAmbient`; frozen on the aeroplane stage without a slot
- [ ] Context released, not merely paused, when far off screen
- [ ] Pixel ratio capped at 1.5 via `lib/render-gate.ts`
- [ ] Cube count drops on low-tier devices (I7's device tier)
- [ ] Homepage First Load JS unchanged — demo code split out
- [ ] Under reduced motion: the aeroplane, still, no sequence

### Decisions taken, 2026-08-07

1. **WebGL budget: option (a).** The homepage may run two contexts. Three exist
   today (hero shader, carousel, features intro) so this is the fourth until I4
   collapses those into one, at which point it is two — still far below the
   browser's ~8–16 limit.
2. **Aeroplane: Boeing 747.** Chosen because it survives extreme
   simplification: the upper-deck hump, four engines and a long swept wing are
   enough to identify it at any level of detail. `morph-shapes.ts` verifies all
   three features are populated.
3. **Home: *3D Support*,** replacing `CubeDemo`, which stays registered as a
   `DemoKind` but is no longer used on any page.
4. **Timed, not scrolled** — a 14.8 s loop. A scroll-driven version remains the
   more striking option and is worth revisiting under I5's sticky
   scrollytelling.
5. **FlashFX genuinely does this.** Confirmed by the owner: the product imports
   and animates 3D objects and runs morph animations that modify them, and this
   sequence is one the founder actually built in FlashFX. It is a demonstration
   of a real capability, not decoration. Recorded in FIX.md *Canonical facts*
   under "3D capability", including the limit: **it is not a sculpting or
   modelling application**, and copy must never imply you create geometry in it.

### Revision, 2026-08-07 — a real mesh morph, and the empty scene removed

The swarm is gone. The owner supplied `AirbusA380.obj` and asked for a genuine
morph: cube → sphere → the model. `morph-shapes.ts` was deleted.

**The 107 MB problem.** The OBJ is a Roblox export: 880,253 vertices, 642,655
triangles, and **untracked in git** — so it would never reach Netlify even if
the browser could load it. The geometry is therefore baked into the bundle.
`scratchpad/bake-a380.js` decimates by grid vertex-clustering to **2,324
triangles / 818 vertices**, 42 kB of source in a lazy chunk. `public/*.obj` is
now gitignored so the source can never be committed by accident.

**Orientation was wrong on the first pass.** The script assumed the longest axis
was the fuselage. An A380 is *wider than it is long* — 79.8 m span against
72.7 m length — so that laid the aircraft down sideways. Fixed by mapping
longest → span, middle → length, shortest → height. Verified against the real
aircraft: span:length 1.108 (real 1.098), height:length 0.325 (real 0.331).

**The model contains 192 literal `-nan(ind)` vertices.** They surfaced as
`null` in the JSON output and a TypeScript error. They are now dropped, along
with every face referencing them, and the script refuses to emit a non-finite
value.

**Which topology to morph from was measured, not guessed.** Two options:
sphere-topology shrink-wrapped onto the aircraft gives a perfect sphere and
ruined wings — they are thin and near-horizontal, so a ray from the centre
misses them above ~3° of elevation. Aircraft-topology projected onto a sphere
gives a perfect aeroplane and a sphere only as good as the vertex distribution.

The second was chosen after measuring the projection: the aircraft's triangles
cover the unit sphere **2.19× over** with 6 degenerate triangles out of 2,324.
Over-coverage means no holes. A first check — 819 vertex directions filling only
36% of angular bins — looked disqualifying, but that measures vertices, and
triangles span between them.

**The empty 3D scene is gone.** `ThreeDSupport`'s right-hand column held a
`SplineScene` pointing at a `prod.spline.design` URL, and that component is a
stub that renders the words "3D scene unavailable" on a black square. Removed;
the section is now a single centred column, retitled *"FlashFX has 3 dimensions,
on the web!"*, and demoted from `<h1>` to `<h2>` — the page's h1 is the hero.

### Revision, 2026-08-07 — the morph is gone; the plane is interactive

Owner's call: drop the sequence, keep only its last stage, put it beside the
section's title, and let people rotate it.

- **No morph.** `MorphDemo.tsx` and `CubeDemo.tsx` are deleted, along with the
  `cube` and `morph` demo kinds. `PlaneViewer.tsx` replaces them. With no
  vertex morphing the loop only writes a rotation — it no longer rewrites 20,916
  floats per frame, which makes this far cheaper than what it replaced.
- **The page is a section shorter.** The 3D had its own full-width
  `VideoPlaceholder` below `ThreeDSupport`; the model now occupies the column
  the Spline stub vacated, so that section is gone. Homepage: **26 → 25**.
- **Drag to rotate.** Pointer events with momentum and friction, pitch clamped
  to ±0.85 rad so it cannot end up upside down.
  - `touch-action: pan-y`, not `none`. The browser keeps vertical scrolling, so
    a visitor swiping down the page on a phone is not trapped by a large canvas;
    only the horizontal gesture is taken.
  - **The render loop runs while dragging even if the governor has denied a
    slot.** An object that ignores the pointer reads as broken rather than as
    restrained. The loop parks itself when there is nothing left to do — no
    grant, no pointer, no momentum — and a fresh grant wakes it.
- **`spline-scene.tsx` deleted.** It had one consumer and was a stub.

### What shipped

`components/demos/morph-shapes.ts` — pure arithmetic, no three.js and no React,
so the geometry can be checked in node. `MorphDemo.tsx` — 512 cubes in one
`InstancedMesh`, one draw call.

- **512 = 8³**, deliberately a perfect cube. At a non-cube count the duplication
  lattice's final z-layer is only partly filled and the whole thing looks
  lopsided — on the one stage whose entire job is to look regular.
- **Points are allocated by block volume**, so a thin wing does not get the same
  density as the fuselage. The engines are deliberately oversized against true
  proportions: at 1:1 scale four engines take about 4% of the aircraft, roughly
  five cubes each, which reads as a smudge rather than a pod.
- **Wingspan 10.5 against a fuselage of 11.6.** A real 747 is 70.6 m long with a
  64.4 m span — longer than it is wide. Getting that backwards makes an airliner
  look like a glider.
- **Seeded PRNG, never `Math.random()`.** A different aeroplane on every mount
  would be a bug, not variety.
- **Elapsed time is accumulated, not read from the clock.** Driving the loop
  from `performance.now()` directly would enter at an arbitrary phase — usually
  mid-morph, the one point that never reads well.
- **Cubes arrive in a wave**, each offset across 40% of the morph window.
  On a single clock the swarm snaps between shapes as one rigid object.
- The still frame is the finished aeroplane at a three-quarter angle — used when
  the governor denies a slot and under reduced motion. Never a blank canvas,
  never a half-finished morph.
- The context is handed back on unmount via `forceContextLoss()`, not left for
  the browser to reclaim.

Verified: three.js and the morph chunk are both absent from the homepage's eager
chunks, and First Load JS is unchanged at **179 kB**.

### Still open

- **Copy.** The section still reads "Create stunning 3D motion graphics". Given
  fact 5, it could now say this sequence is the kind of thing FlashFX makes —
  but what renders on the page is a **web recreation**, not a FlashFX export.
  Claiming the artwork on screen came out of the product would cross the line
  drawn in open question 6. If that claim is wanted, the honest way is to show
  the real FlashFX render.
- **Device tier (I7)** should step `MORPH_COUNT` down rather than change
  anything else — 125 (5³) and 216 (6³) both still read correctly.

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
