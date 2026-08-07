/*
 * The motion system (immersionmilestones.md I1).
 *
 * Import from '@/lib/motion' rather than reaching into the individual files.
 *
 *   duration, loop, ease, reveal   — the shared vocabulary. Use these instead
 *                                    of inventing a timing per component.
 *   useAmbient                     — the only sanctioned way to run a loop.
 *   AmbientProvider / useAmbientActive
 *                                  — share one grant across a subtree.
 *   setLoopCap / loopStats         — diagnostics. `setLoopCap(0)` stops all
 *                                    ambient motion sitewide.
 */

export { duration, loop, ease, reveal, revealTransition } from './tokens';
export { DEFAULT_CAP, setLoopCap, getLoopCap, loopStats } from './governor';
export type { LoopHandle } from './governor';
export { useAmbient, useAmbientActive, AmbientProvider } from './use-ambient';
export { deviceTier, isReducedTier, scaleForTier } from './device-tier';
export type { Tier } from './device-tier';
export type { UseAmbientOptions } from './use-ambient';
