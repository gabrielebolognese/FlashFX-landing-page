/*
 * How much motion this machine should be asked to do (immersionmilestones.md
 * I7).
 *
 * This site markets itself to people on modest hardware — "runs on low-end PCs"
 * is a claim on three of its landing pages. Shipping them a page that stutters
 * would undercut the product's whole argument, so the visitor's machine gets a
 * say in how much runs.
 *
 * Deliberately conservative in what it treats as a signal. `deviceMemory` is
 * quantised and absent in Safari, `hardwareConcurrency` says nothing about core
 * quality, and neither is a reliable proxy for GPU. So a machine is only
 * demoted when it declares something genuinely low — not merely when it fails
 * to declare anything.
 *
 * ── Touch-primary devices, added 2026-08-20 ─────────────────────────────────
 *
 * The hardware signals alone never caught a phone. A modern handset reports
 * eight cores, and Chrome caps `deviceMemory` at 8 to limit fingerprinting, so
 * both thresholds pass and every phone resolved to `full` — taking the entire
 * desktop motion load: the full-screen backdrop shader repainting every frame,
 * six concurrent ambient loops, and undiminished particle counts. The tier
 * existed for exactly this visitor and had no way to see them.
 *
 * `(pointer: coarse)` is that missing declaration. It reports the device's
 * *primary* input, so a laptop with a touchscreen still reads `fine` — it is a
 * statement that the thing in front of the screen is a finger, which in practice
 * means a mobile GPU and a battery.
 *
 * ── Why pointer and not viewport width ──────────────────────────────────────
 *
 * A narrow window on a desktop is not a phone, and the answer here is cached for
 * the session — so anything that changes while the page is open would be read
 * once and then be wrong. Pointer type does not change under a visitor; window
 * width changes every time someone drags a corner.
 */

export type Tier = 'full' | 'reduced';

/*
 * Only `deviceMemory` is declared here. `hardwareConcurrency` is already on the
 * DOM `Navigator` type as a required number, so redeclaring it as optional is a
 * type error — it is read straight off `navigator` and guarded at runtime
 * instead, because old browsers do omit it whatever the types say.
 */
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/** Cached: the answer cannot change within a session, and this is read often. */
let cached: Tier | null = null;

export function deviceTier(): Tier {
  if (cached) return cached;
  if (typeof window === 'undefined') return 'full';

  const nav = navigator as NavigatorWithMemory;

  // An explicit request for less motion is the strongest signal there is.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*
   * Touch-primary: a phone or a tablet. See the note at the top for why this is
   * the pointer type rather than the viewport width.
   */
  const touch = window.matchMedia('(pointer: coarse)').matches;

  // Both are absent on plenty of capable machines, so `undefined` must not
  // demote — only a stated low value does.
  const cores: number | undefined = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;
  const weak = (cores !== undefined && cores <= 4) || (memory !== undefined && memory <= 4);

  cached = reduced || touch || weak ? 'reduced' : 'full';
  return cached;
}

export const isReducedTier = () => deviceTier() === 'reduced';

/**
 * Scale a count for the tier — cube swarms, particle caps, path counts.
 *
 * Returns the full figure on capable machines and roughly a third of it
 * otherwise, never below `min`, so a reduced-tier visitor still sees the thing
 * rather than an empty frame.
 */
export function scaleForTier(full: number, min = 1): number {
  return isReducedTier() ? Math.max(min, Math.round(full * 0.35)) : full;
}
