/*
 * Shared guards for the WebGL background shaders (performancemilestones.md P4).
 *
 * Both `shader-animation.tsx` and `web-gl-shader.tsx` previously called
 * `setPixelRatio(window.devicePixelRatio)` and ran an uncapped
 * requestAnimationFrame loop that never stopped — so on the homepage three
 * renderers drew every frame, forever, including while scrolled far out of
 * view. On a retina display at DPR 3 that is nine times the pixels of DPR 1,
 * for a decorative background, on hardware this product specifically markets
 * itself to.
 */

/**
 * Device pixel ratio, capped.
 *
 * 1.5 is the point past which a soft gradient background gains nothing visible
 * while costing quadratically more fragment shading. Raise it only with a
 * measurement showing the difference is perceptible.
 */
export const MAX_PIXEL_RATIO = 1.5;

export function cappedPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
}

/**
 * Whether the visitor has asked for reduced motion. Callers should render a
 * single static frame rather than starting a loop — not skip the background
 * entirely, or the section loses its backdrop.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
