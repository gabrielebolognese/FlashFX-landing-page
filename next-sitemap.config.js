/**
 * Runs via the `postbuild` script in package.json, after `next build`.
 * netlify.toml must invoke `npm run build` for this to run in production —
 * see the comment there before changing the build command.
 *
 * Routes are discovered from the build manifest, so a new app/<slug>/page.tsx
 * lands in the sitemap automatically. Only the table below needs touching, and
 * only if the new route deserves something other than the default.
 */

/**
 * Per-route priority and changefreq. Anything not listed falls through to
 * DEFAULT_ROUTE.
 *
 * Google ignores both fields, so this documents intent for us more than it
 * signals anything to crawlers — but a file where every URL is an identical
 * 0.7/daily communicates nothing to whoever reads it next either.
 */
const ROUTES = {
  '/': { priority: 1.0, changefreq: 'weekly' },
  // The SEO landing pages — the reason most of these routes exist.
  '/after-effects-alternative': { priority: 0.9, changefreq: 'monthly' },
  '/free-motion-graphics-software': { priority: 0.9, changefreq: 'monthly' },
  '/lightweight-video-editor': { priority: 0.9, changefreq: 'monthly' },
  '/video-editing-software-for-beginners': { priority: 0.9, changefreq: 'monthly' },
  '/motion-graphics-software-for-youtube': { priority: 0.9, changefreq: 'monthly' },
  '/flashfx-vs-capcut-vs-davinci': { priority: 0.9, changefreq: 'monthly' },
  // Product surface.
  '/features': { priority: 0.8, changefreq: 'monthly' },
  '/pricing': { priority: 0.8, changefreq: 'monthly' },
  // Identity. Load-bearing for the entity graph rather than for traffic.
  '/about': { priority: 0.6, changefreq: 'monthly' },
  '/download': { priority: 0.6, changefreq: 'monthly' },
  '/faq': { priority: 0.7, changefreq: 'monthly' },
  // Weekly because it should change often. If it stops changing, lower it —
  // a stale changelog is worse than no changelog.
  '/changelog': { priority: 0.6, changefreq: 'weekly' },
  // Reference material. Indexed, but never the page we want to rank.
  '/brand': { priority: 0.4, changefreq: 'yearly' },
  '/careers': { priority: 0.4, changefreq: 'monthly' },
  // Reproduces the privacy notice in server-rendered HTML rather than through
  // Termly's client-side embed, so it is the version worth indexing — and the
  // only one of the five legal URLs that appears in the sitemap at all.
  '/your-data': { priority: 0.5, changefreq: 'yearly' },
  /*
   * The four Termly-backed legal pages are deliberately absent from this table.
   * None of them is emitted, so an entry here would be dead config that reads
   * as though it still applies — see `exclude` below for why each is out.
   */
};

const DEFAULT_ROUTE = { priority: 0.7, changefreq: 'monthly' };

/*
 * Image sitemap entries for the homepage gallery.
 *
 * Read from the same JSON the carousel renders and the ImageGallery schema
 * quotes, which is the reason that file is JSON and not TypeScript: this config
 * is CommonJS and runs after the Next build, outside anything that could import
 * a `.ts` module.
 *
 * Google discovers images it can already reach by crawling the page, so this is
 * not the difference between indexed and not. What it adds is the caption,
 * attached to the image rather than inferred from whatever markup happens to
 * surround it, and a guarantee that images inside a client-rendered marquee are
 * enumerated somewhere a crawler does not have to execute JavaScript to find.
 */
const galleryImages = require('./lib/gallery-images.json');

const HOMEPAGE_IMAGES = galleryImages.map((image) => ({
  loc: new URL(`/lookslike/${image.file}`, process.env.SITE_URL || 'https://flashfx.app'),
  title: image.alt.split(',')[0],
  caption: image.alt,
}));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://flashfx.app',
  generateRobotsTxt: true,
  /*
   * The sitemap is a list of URLs we are asking Google to index. Anything we
   * have told Google not to index must not appear on it, or the two signals
   * contradict each other — which is precisely what Search Console reports as
   * "Submitted URL marked 'noindex'".
   *
   * All four Termly-backed legal pages are out, for two different reasons:
   *
   *   /privacy canonicalises to /your-data, which carries the same policy in
   *   server-rendered HTML. Listing a non-canonical URL would say "index this"
   *   from the sitemap and "index the other one" from the canonical tag.
   *
   *   /terms, /refund-policy and /acceptable-use-policy are noindex as of
   *   2026-08-07. Termly injects their text client-side, so server-rendered
   *   HTML is ~250 characters of chrome and nothing more. They have no
   *   server-rendered twin to canonicalise to, so the noindex is the right
   *   instrument. Reasoning in full in app/terms/page.tsx.
   *
   * All four stay live, linked from the footer, and readable. They are simply
   * not advertised for indexing.
   */
  exclude: ['/privacy', '/terms', '/refund-policy', '/acceptable-use-policy'],
  transform: async (config, path) => {
    const { priority, changefreq } = ROUTES[path] || DEFAULT_ROUTE;

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
      // Only the homepage carries the gallery, so only the homepage lists it.
      images: path === '/' ? HOMEPAGE_IMAGES : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
