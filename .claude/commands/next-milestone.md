---
description: Load the next unfinished milestone from FIX.md and brief it, ready to implement on "code"
allowed-tools: Read, Grep, Glob
---

Load the next milestone from `FIX.md` and prepare to implement it. **Brief only — do not write any code this turn.**

## Steps

1. **Read `FIX.md`** at the project root. If it is missing, say so and stop.

2. **Find the next milestone.** Scan the `## Progress` table top to bottom and
   take the first row whose Status is `IN_PROGRESS`, otherwise the first
   `NOT_STARTED`. Cross-check against that milestone's own `**Status:**` line —
   if the table and the milestone body disagree, trust the milestone body and
   flag the mismatch.

   If every milestone is `DONE`, say so, summarise what was completed, and stop.

3. **Load its context.** Read `FIX.md`'s *Canonical facts* section in full —
   every milestone depends on it. Then read every file listed under that
   milestone's **Files** heading, including the ones marked "Read first". Read
   the real current contents; never work from memory or from what FIX.md claims
   is in them. Also read `CLAUDE.md` if you have not already this session.

4. **Verify the starting state.** Confirm the problem the milestone describes
   still exists — line numbers drift and earlier milestones may have already
   touched a file. If the milestone is already satisfied, say so rather than
   redoing it.

5. **Brief me.** Concise, no padding:
   - Milestone ID and title, and where it sits in the run (e.g. "M3 of M8")
   - Why it matters, in one or two sentences
   - Exactly what will change, file by file
   - Acceptance criteria, verbatim from FIX.md
   - Anything the file's line references got wrong, with the corrected location

6. **Surface blockers.** If the milestone has a 🚧 Blockers section, or any item
   marked *decision required* / *Ask*, ask those questions now — plainly, as a
   short list. Do not guess an answer and do not proceed past them.

7. **Stop.** Do not edit, create, or delete anything. End by telling me the
   milestone is loaded and you are waiting for `code`.

## When I reply "code"

Implement **only** that milestone. Specifically:

- Stay inside its declared scope. If you spot something broken that belongs to a
  different milestone, note it and move on — do not fix it now.
- Never invent facts about the founder, the company, funding, awards, or
  metrics. Everything factual comes from FIX.md's *Canonical facts*. If you need
  something that is not there, stop and ask.
- Copy JSON-LD `@id` and `sameAs` values byte-for-byte. Do not normalise `www`,
  do not add or strip trailing slashes, do not reorder arrays. `sameAs` matching
  is string-exact and a tidied URL is a different string.
- Never add `aggregateRating`, `Review`, or rating markup of any kind.
- Match the surrounding code: the page shape in
  `app/after-effects-alternative/page.tsx`, `'use client'` on interactive
  section components, framer-motion `whileInView` reveals, `fx-*` Tailwind
  tokens over raw hex.
- Do not touch the YouTube embeds, `VideoPlaceholder`, `WhatIsFlashFX`, or
  `PageLoader` / `lib/loading-context.tsx`. Out of scope by explicit decision;
  see M8's deferred list.

Then, before reporting done:

1. Run the milestone's **Verify** commands, plus `npm run lint`, `npm run
   typecheck`, and `npm run build`. Report real output. If something fails, say
   so — do not describe it as done.
2. Update `FIX.md`: set the milestone's `**Status:**` line and its row in the
   `## Progress` table to `DONE`. Both.
3. Report what changed and why, and name the next milestone.
