# Devlog

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
