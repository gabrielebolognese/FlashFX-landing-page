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

  // Both are absent on plenty of capable machines, so `undefined` must not
  // demote — only a stated low value does.
  const cores: number | undefined = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;
  const weak = (cores !== undefined && cores <= 4) || (memory !== undefined && memory <= 4);

  cached = reduced || weak ? 'reduced' : 'full';
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
