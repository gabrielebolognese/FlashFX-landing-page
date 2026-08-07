/*
 * The ambient loop governor (immersionmilestones.md I1).
 *
 * P6 cut 72 permanently-running SVG paths down to 24 that stop when off screen,
 * and gave the site its first reduced-motion handling. The immersion work adds
 * loops back deliberately — which is the exact circumstance in which that gets
 * quietly undone, one section at a time, until the site is slow again and
 * nobody can point at the commit that did it.
 *
 * So loops are not a thing a component owns. They are a thing a component is
 * granted. Every ambient loop registers here, and at most `cap` of them run at
 * once no matter how many are on screen — which matters on a tall monitor,
 * where a dozen sections can be "in view" simultaneously.
 *
 * This module is deliberately framework-free: no React, no framer-motion. It
 * exists so `use-ambient.tsx` can be a thin wrapper over it, and so the policy
 * lives in one testable place.
 */

/**
 * How many ambient loops may run at once.
 *
 * Counts *registrations*, not animated elements. A section with 24 animated
 * paths registers once and passes the grant down to all 24 — the unit is "one
 * ambient system", because that is what a visitor perceives and what costs a
 * compositor a coherent chunk of work.
 */
export const DEFAULT_CAP = 6;

type Entry = {
  priority: number;
  /** Registration order, as the tie-break. Earlier on the page wins. */
  seq: number;
  visible: boolean;
  granted: boolean;
  notify: (granted: boolean) => void;
};

const entries = new Set<Entry>();
let seq = 0;
let cap = DEFAULT_CAP;

/**
 * Recompute grants from scratch.
 *
 * Cheap enough to run on every visibility change: the set is bounded by the
 * number of ambient systems on a page, which is tens at the very most, and this
 * only fires when something crosses the viewport edge.
 */
function rebalance(): void {
  // Array.from rather than a spread: tsconfig targets ES5, where spreading a
  // Set needs --downlevelIteration.
  const contenders = Array.from(entries).filter((e) => e.visible);

  // Highest priority first; registration order breaks ties, so the loop nearer
  // the top of the page keeps its slot rather than the two swapping frames.
  contenders.sort((a, b) => b.priority - a.priority || a.seq - b.seq);

  const winners = new Set(contenders.slice(0, cap));

  entries.forEach((entry) => {
    const granted = winners.has(entry);
    if (granted !== entry.granted) {
      entry.granted = granted;
      entry.notify(granted);
    }
  });
}

export interface LoopHandle {
  /** Call when the element enters or leaves the viewport. */
  setVisible(visible: boolean): void;
  /** Call on unmount. Frees the slot for whoever is waiting. */
  release(): void;
}

/**
 * Claim a place in the queue. The callback fires whenever this loop's grant
 * changes — including later, when another loop scrolls away and frees a slot.
 *
 * @param priority Higher wins a contested slot. Default 0. Reserve higher
 *   values for motion that is the point of a section rather than decoration
 *   behind it: a live product demo outranks a floating shape.
 */
export function registerLoop(priority: number, notify: (granted: boolean) => void): LoopHandle {
  const entry: Entry = { priority, seq: seq++, visible: false, granted: false, notify };
  entries.add(entry);

  return {
    setVisible(visible: boolean) {
      if (entry.visible === visible) return;
      entry.visible = visible;
      rebalance();
    },
    release() {
      entries.delete(entry);
      // A freed slot may let a waiting loop start, so this cannot be skipped.
      rebalance();
    },
  };
}

/**
 * Change the cap at runtime.
 *
 * `setLoopCap(0)` stops every ambient loop on the site, which is the quickest
 * way to answer "is this section slow because of the animation?" from a
 * console. It is also what the I1 acceptance criteria check.
 */
export function setLoopCap(next: number): void {
  cap = Math.max(0, next);
  rebalance();
}

export function getLoopCap(): number {
  return cap;
}

/** Diagnostics: how many loops are registered, visible and running. */
export function loopStats(): { registered: number; visible: number; running: number } {
  let visible = 0;
  let running = 0;
  entries.forEach((e) => {
    if (e.visible) visible++;
    if (e.granted) running++;
  });
  return { registered: entries.size, visible, running };
}
