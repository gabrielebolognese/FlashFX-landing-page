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
  // Termly's client-side embed, so it is the version worth indexing.
  '/your-data': { priority: 0.5, changefreq: 'yearly' },
  // Legal. Indexed so they can be found and cited, never optimised for.
  '/privacy': { priority: 0.3, changefreq: 'yearly' },
  '/terms': { priority: 0.3, changefreq: 'yearly' },
  '/refund-policy': { priority: 0.3, changefreq: 'yearly' },
  '/acceptable-use-policy': { priority: 0.3, changefreq: 'yearly' },
};

const DEFAULT_ROUTE = { priority: 0.7, changefreq: 'monthly' };

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://flashfx.app',
  generateRobotsTxt: true,
  /*
   * /privacy canonicalises to /your-data, which carries the same policy in
   * server-rendered HTML. Listing a non-canonical URL in the sitemap sends
   * Google two contradicting signals — "index this" from the sitemap, "index
   * the other one" from the canonical tag. The page stays live and linked; it
   * is just not advertised for indexing.
   */
  exclude: ['/privacy'],
  transform: async (config, path) => {
    const { priority, changefreq } = ROUTES[path] || DEFAULT_ROUTE;

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
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
