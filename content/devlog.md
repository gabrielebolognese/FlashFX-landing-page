# Devlog

## 2026-08-18

2 commits, 38 files changed, +938/-243, 31 new files. First work since 10 August — 11 to 17 August have no commits, and no entries below, because nothing was written on them. Two arcs, unrelated to each other: making 25 supplied screenshots findable in Google Images, and adding a personal tool to a repo that is not private in the way it looks.

### Image SEO for the gallery

- Twenty-five screenshots arrived as `Screenshot 2026-08-08 190030.png` and are now named for what they show.
  - Number: 6.33 MB of PNG became 0.93 MB of WebP at 1200px, 85% less, largest 66 kB against a 220 kB per-asset budget. The gallery is 38 images and 1.41 MB.
  - Hard part: naming them required opening all twenty-five first, which is slower than it sounds and is the only way the result is honest. Two are the same departure-board scene — one with the icon library open, one zoomed out to 234 tracks — and a filename derived from a guess would have made them `departure-board-1` and `departure-board-2`. The same applies to four near-identical galaxy shots and two ripple-ring patterns.

- `lib/gallery-images.json` is now the only place a screenshot is described.
  - Hard part: image SEO is three signals that have to agree — the `alt` a crawler reads, the `caption` in the sitemap, and the `description` in the structured data. Written in three files they drift, and a caption contradicting its own alt is worse than no caption. The file is JSON rather than TypeScript for one specific reason: `next-sitemap.config.js` is CommonJS and runs after the build, outside anything that can import a `.ts` module, so JSON is the only format all three consumers can share.
  - From it: an `ImageGallery` node with 38 `ImageObject` children whose `creator` points at the existing organisation node, so the gallery attaches to the entity graph rather than forming an island beside it; and 38 captioned entries in the image sitemap.
  - Deliberately absent: `license` and `acquireLicensePage`. Google's licensable-images treatment wants both, neither exists, and inventing a licence URL to earn a badge is a rights claim this site has not made anywhere else.

- The carousel became three rows, the middle one running against the other two.
  - Number: 114 `<img>` elements for 38 pictures; exactly 38 carry alt text.
  - Hard part: each row repeats three times to close its loop, so a naive implementation puts 38 descriptions on the page three times over — 114 identical alt strings, noise to a screen reader and to a crawler. Copies two and three are `alt=""` and `aria-hidden`. Separately, rows are dealt every-third rather than sliced: the source list is grouped by subject, so slicing would have put thirteen consecutive pattern shots in one row.
  - Hard part: drag survived the rewrite only because each row animates toward a single target with `repeat`, not through a keyframe array. framer restarts a repeat from wherever the value was when the animation began, so a flung row carries on from where it was let go instead of snapping back.

- Near miss: `public/v2 - Copy/` was untracked but **not ignored**.
  - Number: ~10 MB — the source PNGs plus two copies of a 4.5 MB screen recording.
  - Hard part: untracked and ignored look identical in `git status`, and `git add -A` would have committed all of it and failed the per-asset budget in `scripts/check-budgets.mjs`. Caught by checking `git check-ignore` before staging rather than after. Now ignored, the same treatment the A380 archives and the source browser icons already had.

### A personal tool in a public repo

- `/x-comment`: paste an X post, send it, get an editable draft reply back. A page plus a route handler, dev-only.
  - Number: 8 files, +407/-20 (`c04cb45`).
  - Hard part: the question was whether the API key could go straight into the app, on the grounds that it is local, the repo is private, and the key is capped. The repo is private; the **build output is not** — this repo deploys to flashfx.app from `main`, so a `NEXT_PUBLIC_` variable or a key inlined in a component ships inside a JavaScript chunk any visitor can open. Repo visibility does not cover it. The correction mattered more than the feature.
  - Hard part: the second-order version is subtler. Moving the call server-side into a route handler fixes the exposure but creates a public unauthenticated endpoint that spends the key — anyone who finds `/api/x-comment` can run it. Both halves therefore return 404 when `NODE_ENV` is production. That is belt and braces rather than the only defence, since Netlify has never held the key, but it states the intent instead of resting on a secret's absence.
  - A route handler is not "a whole backend", which was the objection worth answering directly: it is one file running inside the `npm run dev` that already exists, and the only place in a Next app a secret can live without reaching the client.

- Model settings worth recording: `claude-opus-5` at low effort with adaptive thinking left **on** rather than disabled. Low effort already captures most of the token saving, and disabling thinking on this model can leak thinking tags into the visible answer. `max_tokens` is 4000 rather than sized to a 280-character reply, because on this model it caps thinking and response text together.

### Verification, and a wrong first read

- Checked against the build: 38 unique image sources with exactly 38 alt strings, 38 `ImageObject` nodes, 38 `image:loc` entries with captions, no client chunk referencing `ANTHROPIC_API_KEY`, and nothing key-shaped anywhere in `.next`.
- The production gate looked broken at first. A grep for the page title found "X comment assistant" in the built HTML, which reads as the tool having rendered. It had not: that string was the `metadata.title` in the RSC flight payload, and the actual `<title>` was "Page not found". Grepping for the tool's own UI strings instead returned zero. **Grep for content that only exists on the path you are trying to rule out** — a title survives the 404 and proves nothing.
- **The tool has never made a real API call.** There is no key on this machine, so the request path, the error branches, and the clipboard permissions are all **structurally verified only**. Nothing was checked in a browser, which now also covers the three-row carousel.

## 2026-08-10

3 commits, 12 files changed, +341/−89, one new file (`components/sections/BeyondTheFooter.tsx`). Two arcs, and they share a through-line: both changes reached well past the file they started in. The pricing rework looked like editing one component and turned out to touch seven independent restatements of the same numbers, four of which feed structured data. The joke under the footer looked like six empty divs and turned out to change the colour of every section above it.

### Pricing: Free / Pro / Ultra

- The $29 Ultra tier became **Pro** and the $39/seat Teams tier became **Ultra** at $89. No per-seat plan remains.
  - Number: 9 files, +138/−69 (`bdea0d4`).
  - Hard part: the prices were restated in seven places, none of which derived from the pricing data — the cards, the comparison table, `/pricing` metadata (three separate `title`/`description` pairs), its `Offer` graph, four FAQ answers, the refund-policy standfirst, the 404 route list, and the collaboration row in `comparisonData.ts`. Four of those are read by crawlers. Editing only `PricingSection.tsx` would have left the old prices live in structured data while the visible page showed the new ones, which is worse than either being wrong on its own. `FIX.md` now records the three-way split rather than just the table.

- Revised the ladder hours later on explicit numbers: credits 1M / 50M / 200M, version history 30 / 60 / 90 days, the whole 3D set except advanced materials opened to the free tier, comments and guest access on all plans, AI in 3D added as an Ultra-only row.
  - Number: 37 rows × 3 columns, verified by parsing the three `FeatureGroup[]` arrays back out of the source and printing them side by side; every row populated in all three columns.
  - Hard part: this contradicted work from ninety minutes earlier. The first commit derived $854/yr, 70 GB, 1,750 credits and 1 year of history from a stated "Ultra is 3.5x Pro"; the second replaced two of those with hand-set numbers, so the ratio now holds for **storage only** (credits are 4x Pro→Ultra, history 1.5x). The comment in `PricingSection.tsx` says not to "restore" the ratio, because the derivation reads as more principled than the explicit numbers and someone will be tempted.

- Deleted a claim the site had leaned on: "the free tier is a complete manual editor with no AI features".
  - Hard part: the free tier now carries 1M AI credits and none of the AI tools — motion graphics, assistant, image search and generation, background remover, sound generator are all still Pro and up. That is exactly what was specified, and the prose was written to match the table rather than paper over it, but a credit allowance with nothing in the table to spend it on is incoherent on its face. Logged in `FIX.md` as unresolved rather than guessed at. Same with advanced materials (PBR / toon / wireframe): it was the one 3D row not named in the list to open up, so it stayed paid instead of being swept along with the other four.

### Six screens of nothing, and a video

- Six 100vh sections below the footer — two empty, "Stop scrolling", empty, "I warned you", empty — then a muted video that starts when its section is reached.
  - Number: 4 files, +171/−17 (`7be1611`); homepage only, confirmed present in `index.html` and absent from `pricing`, `faq` and `about`.
  - Hard part: the footer is rendered by `app/layout.tsx`, so "under the footer" leaves the layout as the only mount point — and the layout is every route. Seven viewport-heights of joke under the refund policy and six SEO landing pages is a defect, not a joke, so the component gates itself on `usePathname()`.

- The site backdrop now measures scroll progress against the end of the *page*, not the end of the document.
  - Hard part: this is the one that would have shipped silently. `SiteBackdrop` drives its colour ramp off `scrollY / (scrollHeight - innerHeight)`. Adding seven screens of padding stretches that denominator, so the real content would never reach the light end of the gradient and the footer would sit in the same navy as the hero — a joke below the fold quietly recolouring everything above it. Fixed by subtracting the height of any `[data-fx-beyond]` element, which is a named contract rather than a special case for this component.

- The video's observer deliberately does **not** use the site's shared embed hook.
  - Hard part: `useVideoEmbed` carries a 400px `rootMargin` so videos are ready before you arrive. That is wrong here — it would have the video playing to an empty screen while the visitor is still two sections above. This one has no `rootMargin`, a 0.55 threshold, and disconnects after firing so it cannot restart on the way back up. Muted regardless of the brief, since no current browser honours autoplay without it.

### Verification, and what it didn't cover

- Server HTML still contains zero `<iframe>` on every route; the video id is not in it at all until the observer fires. The `Offer` graph on `/pricing` carries Free $0, Pro $29, Ultra $89. No "Teams" or "$39" survives on any route.
- Nothing today was checked in a browser. The autoplay-on-arrival behaviour, the 100vh section rhythm, and the pricing table's appearance are **structurally verified only**.
- A verification script reported "0 JSON-LD blocks" on `/pricing` and was wrong: the regex assumed `<script type="application/ld+json">` while the tags carry an `id` attribute first. The schema was fine. Worth remembering before trusting a negative result from a hand-rolled HTML check — a regex that finds nothing looks identical to a page that contains nothing.

## 2026-08-09

10 commits, 21 files changed, +1573/-255. Two new components (`CameraRig.tsx`, `DepthCamera.tsx`) and four supplied logos. Three arcs: a positioning bug that had already survived two fixes, a fact-checking pass on competitor install sizes that ended by contradicting the site's own published number, and the 2.5D camera section, built and then rebuilt twice inside ninety minutes.

### The logos that would not centre

- Four tool logos sat off the ends of the cables connecting them to the FlashFX mark. Third attempt at this; the first two moved the wrong thing.
  - Hard part: framer-motion writes `transform` inline, so animating `y` or `scale` on the same element that carries Tailwind's `-translate-x-1/2 -translate-y-1/2` silently discards the centring and positions the element by its top-left corner. That is half a logo in each axis, not a few pixels, which is why nudging offsets in the previous two commits changed nothing. Fixed by splitting centring (outer div, plain inline transform) from animation (inner `motion.div`). This trap is already documented in CLAUDE.md and still cost three attempts in one file.

### Competitor install sizes

- Published an After Effects install figure next to the "0 MB to install" claim, then corrected it 39 minutes later.
  - Number: three places carry it — `LoadTime`, `SystemRequirementsSection`, `FeatureComparisonTable`.
  - Hard part: `helpx.adobe.com` is unreachable from this environment — timeouts and connection resets on the current page, both versioned pages, and the `/in/` and `/sg/` mirrors, across several sessions. The first commit aligned everything to 15 GB because that is what the site had already been publishing on `/lightweight-video-editor`. Weighing four secondary sources afterwards put two independent references on **8 GB** tied to a specific build (25.6, Nov 2025), against one on 15 GB with no version tie and one on 5 GB matching older releases. The site's long-standing number was the weaker reading. Corrected to 8 GB; still second-hand, and `FIX.md` records the source table so it can be re-weighed rather than re-derived.

- Went looking for the DaVinci Resolve equivalent and found there isn't one.
  - Hard part: Blackmagic publishes no disk-space requirement at all — their stated minimums cover CPU, GPU and RAM, and the tech-specs page is about control panels. Third-party figures run 2 GB to 7 GB with nothing primary behind any of them. The site's "3-4 GB desktop install" was invented somewhere upstream and appeared in **three** places. All now say "multi-gigabyte", the only thing every source agrees on.

### The 2.5D camera section

- A full-bleed section showing flat layers standing in depth with a camera moving through them. Shipped as a rig plus a live inset of the camera's own view, then reworked to a 65/35 split, then rebuilt again to open on a flat picture that comes apart.
  - Number: three commits in 88 minutes; final form renders one `THREE.Scene` through two cameras into two scissored viewports.
  - Hard part: the geometry could not be hand-tuned. Two constraints pull opposite ways — the backdrop must cover the shot camera's frame across the whole dolly (wants it large), and the rig view must frame the whole set at any orbit angle (wants it small). Four attempts at picking a radius failed because raising the orbit distance while lowering the field of view left `R*tan(fov/2)` roughly constant, so the framing never improved. Replaced with a bounding-sphere fit: `radius / sin(half fov)`, recomputed on resize since horizontal fov moves with aspect. A sphere is the same size from every direction, so the framing holds at every angle instead of at the one it was tuned at.
  - Hard part: making the camera bigger and pushing the layers further apart are in direct conflict — deeper scene, wider fit, smaller camera on screen. Resolved by sizing the body *from* the fitted radius rather than in absolute units, so it holds ~10.5% of frame height regardless of depth.

- Nothing in this section was checked in a browser. Framing, parallax ratio (12.7x foreground against backdrop) and near-plane clearance are **structurally verified only**, by projecting the scene's corners in Node against the constants read back out of the source file.

### Two demos showing the wrong moment

- The pen tool now moves, clicks, and only then places the anchor and draws the segment.
  - Hard part: it placed the point and moved the cursor from the same instant, so each anchor appeared under a pen still travelling towards it. It read as the drawing happening *to* the cursor rather than because of it. Separately, `curved` — the 0-to-1 blend from polyline to bezier — was **assigned, not animated**, so the one moment a pen-tool section exists to show was crossed in a single frame. Driving it with framer's `animate` also fixed the handles, which are drawn at `cx * curved` and so now grow out of the anchors rather than appearing at full length. Splitting the curve into one path per segment (needed for the draw-on) forced the stroke gradient to `userSpaceOnUse`, or each segment would have restarted it — four small rainbows instead of one sweep.

- The screenshot carousel expands on click, with prev/next arrows the height of the image.
  - Hard part: a drag ends with a click event on whichever card was under the pointer, so every fling would also have opened a picture. framer only fires `onDragStart` once its own threshold is crossed, which makes it exactly the signal for "that was a drag, not a tap". The arrows track the image height with `items-stretch` — the row takes its height from the only item with an intrinsic size — so nothing measures anything.

## 2026-08-08

37 commits, 133 files changed, +6052/-656. Twenty new components and nineteen new images. The heaviest content day: most of the homepage's current middle section was written here. Four arcs — new sections built to brief and reworked on the spot, a performance pass on the parts of the page that were already slow, a consistency sweep across facts and punctuation, and the first deep-link contract to the editor.

### New sections

- "Edit in plain English", the media pool, procedural animation, templates, a two-audience section with CSS-3D workstations, a Features run above the 3D section, and a five-part "Not convinced yet?" AI block.
  - Number: 8 new section components, 8 new demo components, roughly one section per 25 minutes across the day.
  - Hard part: several were rebuilt immediately after shipping because the first reading of the brief was wrong. The procedural section went through three forms in 21 minutes — one cube becoming eight things, then 2D squares and kaleidoscopes at 1200ms crossings, then every radial formation cut. Evaluating the formations numerically in Node found the actual defects: the mandala reached radius 1.08 against a frame of 1.00, and the tunnel crossed the frame edge at 40% opacity so it was sliced rather than fading.
  - Hard part: `app/page.tsx` is a server component, and `dynamic(() => import('./X').then(m => m.X))` written there fails at **prerender** with "Cannot access X.then on the server". The dynamic call has to live inside a `'use client'` module. Two files (`feature-demos.tsx`, `convince-demos.tsx`) exist only for that.

### Performance on the parts already slow

- The 176-card feature grid now skips everything off screen.
  - Number: 176 cards, of which roughly a dozen are ever on screen.
  - Hard part: `content-visibility: auto` alone breaks the page. A skipped card measures zero, so the document collapses and the scrollbar jumps; `contain-intrinsic-size: auto 190px` is the necessary other half, and `auto` makes the browser remember each card's real height after it has rendered once.
  - Mistake: this section was described as 179 cards in the previous day's commit and in code comments. The real count is 176 (47+90+39). The 179 came from a loose `title:` regex matching entries outside the three data files.

- Removed the last grid backgrounds and the prop that painted them, so the shader field runs through every section.
  - Hard part: the iceberg image below the grid has top and bottom fades hand-matched to `#141f40`; meeting a shader field they would read as a hard seam. It keeps its solid ground, with a lead-in gradient taking the page from the field into the flat colour.

### Facts and punctuation

- Settled the RAM floor at 4 GB across the site, and removed every em dash from visible copy.
  - Number: the RAM figure had been contradictory across seven files — `/lightweight-video-editor` alone said "Works on 4 GB" twice and "Requires only 2 GB" once.
  - Hard part: the em-dash script's tidy pass ran `\s+([,.])` on every line and ate the indentation off chained `.join(' ')` calls. Caught because the candidate count jumped 206 to 248 between runs; fixed with an early return so only dash-bearing lines are touched. A blind dash-to-comma replacement also produced comma splices ("you are always on the current version, there is nothing to download"), so the replacement is keyed on the word *after* the dash: connector to comma, clause-opener to full stop, `-ing` to comma, digits to hyphen, else colon.

### Deep links, and one reverted change

- `lib/editor.ts` gives the editor a single deep-link contract: `?template=<id>`, with a whitelist typed so an unknown id is a compile error.
  - Hard part: the editor silently ignores ids it does not recognise — no error, the visitor just lands on an empty dashboard. Nothing in this repo can validate an id at build time, so the whitelist is only as good as the discipline around it.

- Moved the workstation figure out of the laptop it was rendering inside, then reverted it at the owner's request.
  - Hard part: the figure and the laptop lid genuinely occupy the same depth range in the `preserve-3d` stack, so the browser interleaves them. It is not a spacing problem and moving the figure down or forward does not fix it — the shapes intersect. The revert restores the interpenetration, which the commit says explicitly rather than quietly putting things back.

## 2026-08-07

49 commits, 124 files changed, +8052/-1541. The largest day by commit count and by lines. Five arcs: a motion system built from nothing with every existing loop moved under it, seven YouTube embeds replaced with live recreations of the editor, a 3D morph sequence built over four commits and then deleted, a long unstructured pass reordering and retitling most of the homepage, and a build-budget guard that found 57 MB nobody was looking for.

### The motion system (I1, I2, I3)

- Every continuous animation on the site now runs through a governor capped at 6 concurrent loops, claimed per *system* rather than per element.
  - Number: 183 `trace` borders against 1 `ambient` on the whole site — the ratio is the point, since only `ambient` and `pulse` take a slot.
  - Hard part: the unit had to be one ambient system, not one element. A backdrop with 24 animated paths takes one slot and shares it down the tree via context; registering per element would leave 40 shapes fighting over 6 slots and freezing at random. `active: false` also had to mean "hold a still frame", never "render nothing" — a background that vanishes when the cap is spent looks broken.

- Seven video boxes became live in-page recreations of the editor.
  - Hard part: an embed is 1-2 MB of third-party JavaScript and its own rendering context; these are a few kB. But the rule that came out of it matters more than the saving: footage of the *editor's UI* may become a demo, footage of *real finished work* may not. The five shorts in `WhatIsFlashFX` are actual output made with FlashFX and stay as video. Showing a simulation where a visitor believes they are seeing genuine results is a different claim from illustrating an interface. Recorded as a standing rule the same day.

- Fixed the timelines rendering as a thin strip with three quarters of the panel empty.
  - Number: about 220px of content inside an 845px panel — 74% empty, which is exactly what was reported.
  - Hard part: the previous commit had added tracks and raised the aspect ratio, which only made the empty area larger, because neither was the cause. `DemoShell`'s content wrapper was `relative flex-1 min-h-0` — a block container — so the tracks div's `flex-1` had nothing to flex against and collapsed to the height of its 8px label text. One class, `flex flex-col`, on that wrapper. Demos positioned `absolute inset-0` are out of flow and were unaffected either way, which is why the bug looked inconsistent.

### A morph built and then deleted

- Built a cube to sphere to aeroplane morph across four commits, baking a 107 MB Roblox OBJ down to 2,324 triangles, then dropped the morph entirely and kept only its last stage.
  - Number: the morph rewrote 20,916 floats every frame; the rotatable A380 that replaced it writes a rotation and nothing else.
  - Hard part: the section it lived in also had a `SplineScene` stub rendering "3D scene unavailable" on a black square, so the page had shipped with a large empty box. Deleting the morph freed the column that stub occupied, which removed a whole section from the homepage — 26 sections to 25. The dead end was worth it only because it produced the geometry.

### The backdrop, and a reverted removal

- One field of light behind the whole site, replacing per-section backgrounds (I4).
  - Hard part: I4 folded the hero's rays into the backdrop and removed `ShaderAnimation` altogether. Reverted on the owner's call — it is the best animation on the site and stays. `Hero.tsx` was restored verbatim from the commit before I4, and the backdrop's rays were removed instead, since drawing them in both places doubles them behind the hero. The homepage now deliberately runs two decorative contexts, recorded as an exception rather than left implying the hero shader was retired.

### The guard that found 57 MB

- Build budgets that fail Netlify rather than printing a warning nobody reads.
  - Number: `public/` was 57.5 MB and is now 0.86 MB. Homepage eager JS measured at 108.4 kB against a 140 kB budget.
  - Hard part: the guard caught it on its first run — `public/airbus-a380.zip` (34 MB) and `public/A380.rar` (23 MB), source archives for a model already baked into `a380-geometry.ts`, referenced by nothing and deploying on every build. Nobody had noticed for the same reason 6.6 MB of PNGs went unnoticed the day before: nothing was looking. The JS budget deliberately does **not** reproduce the figure the Next CLI prints — that number is computed inside Next's build and cannot be read back, so matching it would mean guessing at its arithmetic. It measures the gzipped bytes of the chunks the served HTML actually requests.

### Restructuring, mostly unrecorded

- Roughly 20 commits reordering, retitling, deleting and rebuilding homepage sections to spoken briefs: the hero opening on cubes, both timelines full-bleed, the interpolation section becoming a rollercoaster, three sections deleted outright, headings moved to Inter and Cormorant retired.
  - This arc is thin on hard parts because most of it was taste, not difficulty. It is recorded mainly so a future reader knows the homepage's shape was settled in one day and not designed up front.

## 2026-08-06

22 commits, 137 files changed, +7481/-464. Fifteen new routes. Three arcs: closing out the FIX.md launch milestones (M6 dead links, M7 assets, M8 verification), a silent deployment bug that had been shipping a stale sitemap, and the first six steps of a performance plan written the same evening.

### The sitemap that had never regenerated

- `netlify.toml` ran `npx next build`, which invokes the `next` binary directly.
  - Number: the deployed sitemap held six URLs, missing every route added since it was committed.
  - Hard part: npm only fires `pre`/`post` lifecycle scripts for scripts run through `npm run`, so `postbuild` never executed and `next-sitemap` had never run on Netlify — production served whatever happened to be committed to `public/`. The failure is completely silent: the build stays green, the file exists, it just stops tracking reality. This is now the one thing CLAUDE.md says must not change about the build command.

### Fifteen routes, because the footer linked to nothing

- `/pricing`, `/features`, `/faq`, `/changelog`, `/brand`, `/careers`, `/download`, `/your-data`, three Termly policy pages, a three-way comparison page, a YouTube-specific landing page, and a branded 404.
  - Number: 137 files touched in one day, the majority of them new.
  - Hard part: the footer had been linking to ~18 routes that did not exist. Building them was the straightforward half; deciding which to build and which to delete was not. `/status` was removed rather than faked, `/security` became `/your-data`, and `/roadmap` was repointed rather than invented. A 404 a real visitor reaches from your own footer is worse than a missing link, so the branded 404 lists the routes that do exist.

- Expanded the capability matrix from 16 rows to 27, grouped, and corrected the cloud storage figures.
  - Hard part: 50 MB, 500 MB and 20 GB are not in conflict — they are different states (no account, free tier, paid). Copy quoting a storage number without saying which state it means reads as a contradiction, which is exactly what `editorFeatures.ts` had been doing.

### Performance, P1 through P6

- Stopped the loader blocking first paint, lazy-loaded every embed, converted oversized images, paused off-screen WebGL, moved three.js off the initial bundle, and cut animated path counts.
  - Number: images 6.56 MB to 0.45 MB (P3). Homepage First Load JS 316 kB to 176 kB, route JS 178 kB to 37.6 kB (P5). Animated paths 72 to 24 (P6).
  - Hard part: the old splash gated first paint on `window.load` plus five YouTube `onLoad` events, and `Hero` returned `null` until it finished — which kept the LCP element out of the DOM for the entire load. The replacement is a server component with no JavaScript at all, fading via CSS so it begins at first paint and cannot hang waiting on anything.
  - Hard part, recorded honestly in P5: the plan's under-150 kB target was **not met and was abandoned**. The remaining weight above the shared baseline is mostly framer-motion, imported by 93 components; removing it means rewriting every reveal animation on the site for roughly 26 kB. Two components on the original lazy-load list — `BackgroundPaths` and `RadialOrbitalTimeline` — were wrong to include, because both wrap real content rather than decoration.
