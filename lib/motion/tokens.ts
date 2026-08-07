/*
 * The site's motion vocabulary (immersionmilestones.md I1).
 *
 * Before this, durations across the sections ranged from 0.4s to 2.4s with four
 * different easing curves, each picked ad hoc in the component that needed it.
 * That is a large part of why the motion already on the site reads as
 * incidental rather than designed — nothing shares a tempo, so nothing feels
 * like it belongs to the same object.
 *
 * New work uses these. Existing sections can be converted as they are touched;
 * there is no value in a sweep that changes 90 files and nothing else.
 */

/** One-shot motion: entrances, hovers, state changes. Seconds. */
export const duration = {
  /** Hover and press feedback. Should feel immediate, not animated. */
  instant: 0.15,
  /** Small state changes — a chip toggling, an icon swapping. */
  quick: 0.3,
  /** The default for anything entering the viewport. */
  settle: 0.55,
  /** Deliberately slow. Section headlines and hero elements only. */
  reveal: 0.8,
} as const;

/**
 * Ambient loop periods. Seconds for one full cycle.
 *
 * Long on purpose. A loop the eye can time is a loop the eye starts watching,
 * and ambient motion is meant to be felt rather than followed.
 */
export const loop = {
  /** A pulse or glow. Fast enough to read as alive. */
  breathe: 4,
  /** Floating shapes, slow parallax. */
  drift: 12,
  /** A light travelling a border, a playhead crossing a track. */
  sweep: 24,
  /** Marquees and anything spanning the full width of the page. */
  crawl: 40,
} as const;

/**
 * Easing curves. Cubic bezier control points, in framer-motion's array form.
 *
 * `entrance` is the signature curve — a hard start that decelerates long into
 * its finish, which is what makes an arrival feel placed rather than dropped.
 */
export const ease = {
  entrance: [0.22, 1, 0.36, 1] as [number, number, number, number],
  exit: [0.7, 0, 0.84, 0] as [number, number, number, number],
  /** Symmetric, so a loop that reverses has no visible seam at the turn. */
  breathe: [0.45, 0, 0.55, 1] as [number, number, number, number],
} as const;

/**
 * The default `viewport` for a reveal.
 *
 * `once` matters: a reveal that replays every time you scroll back reads as a
 * glitch. Ambient loops are the opposite case and go through `useAmbient`.
 */
export const reveal = {
  once: true,
  amount: 0.2,
} as const;

/** The standard entrance, for `motion` components that just need the default. */
export const revealTransition = {
  duration: duration.settle,
  ease: ease.entrance,
} as const;
