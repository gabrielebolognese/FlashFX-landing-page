/**
 * Shared SEO values.
 *
 * Next.js merges metadata shallowly: a page that declares its own `openGraph`
 * or `twitter` object replaces the layout's wholesale rather than merging into
 * it. So the image has to be repeated on every page that defines those keys —
 * hence this constant, so the six copies cannot drift apart.
 */

/**
 * Social card image. 1872x955 (ratio 1.96, against the 1.905 ideal), so it
 * renders at 1200x630 without awkward cropping.
 *
 * This is a real product screenshot, not a purpose-made card: the FlashFX logo
 * sits centre-canvas and stays legible at feed size. Swap in a dedicated
 * 1200x630 asset when one exists — update only this file and all pages follow.
 */
export const OG_IMAGE = {
  url: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
  width: 1872,
  height: 955,
  alt: 'The FlashFX editor running in a browser, showing a logo animation on the canvas alongside the media pool, properties panel, and keyframe timeline.',
} as const;

/** Ready-made `openGraph.images` / `twitter.images` value. */
export const OG_IMAGES = [OG_IMAGE];
