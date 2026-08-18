import data from './gallery-images.json';

/*
 * The editor screenshot gallery: one list, three consumers.
 *
 * `lib/gallery-images.json` is the only place a screenshot is described. It is
 * read by the carousel that displays them, by the `ImageGallery` schema on the
 * homepage, and by `next-sitemap.config.js` for the image sitemap — a plain
 * JSON file rather than a `.ts` one precisely so the sitemap config, which is
 * CommonJS and runs outside the Next build, can `require` the same source.
 *
 * That matters more here than it looks. Image SEO is three signals that have to
 * agree: the `alt` a crawler reads in the HTML, the `caption` in the sitemap,
 * and the `description` in the structured data. Kept in three files they drift,
 * and a caption that contradicts its alt text is worse than no caption. Kept in
 * one, they cannot.
 *
 * ── Why the filenames matter ────────────────────────────────────────────────
 *
 * Every one of these arrived as "Screenshot 2026-08-08 190030.png", which tells
 * an image search nothing. Each is now named for what it actually shows — the
 * scene on the canvas and the panel open beside it — read off the picture
 * rather than guessed. The filename is one of the few things Google Images has
 * to go on besides the alt text and the surrounding copy.
 */

export type GalleryImage = {
  /** Filename inside `public/lookslike`. */
  file: string;
  /** Real pixel height. Every one is 1200 wide; heights vary by a few pixels. */
  h: number;
  /** Also the sitemap caption and the schema description. */
  alt: string;
};

/** Every screenshot is exported at this width. */
export const GALLERY_WIDTH = 1200;

export const GALLERY: GalleryImage[] = data;

export function gallerySrc(image: GalleryImage): string {
  return `/lookslike/${image.file}`;
}

/**
 * Three rows, dealt round-robin rather than sliced.
 *
 * The list is grouped by subject — the departure boards together, the bar
 * charts together, the weather scenes together — so slicing it into thirds
 * would put thirteen consecutive patterns in one row and thirteen consecutive
 * scenes in another. Dealing every third image spreads each group across all
 * three, so any one row is a fair sample of what the editor makes.
 */
export const GALLERY_ROWS: GalleryImage[][] = [0, 1, 2].map((row) =>
  GALLERY.filter((_, i) => i % 3 === row)
);

/**
 * `ImageObject` nodes for the homepage's `ImageGallery`.
 *
 * `creator` points at the existing organisation node rather than repeating the
 * publisher inline, so these hang off the entity graph the rest of the site
 * already emits instead of forming an island beside it.
 *
 * No `license` or `acquireLicensePage`: Google's licensable-images treatment
 * wants both, neither exists, and inventing a licence URL to earn a badge would
 * be a claim about rights we have not made anywhere else.
 */
export function galleryImageObjects(origin = 'https://flashfx.app') {
  return GALLERY.map((image) => ({
    '@type': 'ImageObject',
    contentUrl: `${origin}/lookslike/${image.file}`,
    url: `${origin}/lookslike/${image.file}`,
    name: image.alt,
    description: image.alt,
    width: GALLERY_WIDTH,
    height: image.h,
    encodingFormat: 'image/webp',
    creditText: 'FlashFX',
    creator: { '@id': `${origin}/#organization` },
    isPartOf: { '@id': `${origin}/#gallery` },
  }));
}
