import Link from 'next/link';

const footerLinks = {
  product: {
    label: 'Product',
    links: [
      { text: 'Motion Editor', href: 'https://editor.flashfx.app', external: true },
      { text: 'Templates Library', href: '/features#templates' },
      { text: 'Export & Formats', href: '/features#export' },
      { text: 'Pricing', href: '/pricing' },
      { text: 'Download', href: '/download' },
      { text: 'Changelog', href: '/changelog' },
      // Lives on its own subdomain, not a route here — external so the renderer
      // emits <a target="_blank"> rather than a next/link to a page that does
      // not exist.
      { text: 'Roadmap', href: 'https://roadmap.flashfx.app', external: true },
    ],
  },
  resources: {
    label: 'Resources',
    links: [
      { text: 'Documentation', href: 'https://documentation.flashfx.app', external: true },
      // Own subdomain, not a route here — same as Roadmap above.
      { text: 'Blog', href: 'https://blog.flashfx.app', external: true },
      { text: 'Beginner Guide', href: '/video-editing-software-for-beginners' },
      { text: 'YouTube Creators', href: '/motion-graphics-software-for-youtube' },
      { text: 'FAQ', href: '/faq' },
      // No status page exists and none is planned. If one is ever stood up it
      // belongs on a hosted service at status.flashfx.app, linked externally
      // like Roadmap and Blog — not hand-written here, where it would go stale
      // silently during the first outage.
    ],
  },
  compare: {
    label: 'Compare',
    accent: true,
    links: [
      { text: 'vs After Effects', href: '/after-effects-alternative' },
      // One page covers both, deliberately — see comparisonData.ts.
      { text: 'vs CapCut & DaVinci', href: '/flashfx-vs-capcut-vs-davinci' },
      { text: 'Free Motion Graphics', href: '/free-motion-graphics-software' },
      { text: 'Lightweight Editor', href: '/lightweight-video-editor' },
    ],
  },
  company: {
    label: 'Company',
    links: [
      { text: 'About', href: '/about' },
      { text: 'Careers', href: '/careers' },
      { text: 'Brand', href: '/brand' },
    ],
  },
  /*
   * Legal, split out of Company on 2026-08-20.
   *
   * These five were the tail of an eight-item Company column, below About,
   * Careers and Brand — which is where a visitor looking for the refund terms
   * would never think to look, and where a policy link carries no more weight
   * than a brand-assets link. A named column is the convention for exactly this
   * reason, and it is the first place anyone checks.
   *
   * All five are already separate routes with their own metadata; nothing here
   * changes what they are, only where they are found.
   *
   * `Your Data` is in this group rather than Company because it is not an
   * explainer sitting beside the privacy policy — it *is* the privacy policy in
   * server-rendered form, and `/privacy` canonicalises to it.
   */
  legal: {
    label: 'Legal',
    links: [
      { text: 'Terms of Service', href: '/terms' },
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'Refund Policy', href: '/refund-policy' },
      { text: 'Acceptable Use', href: '/acceptable-use-policy' },
      { text: 'Your Data in FlashFX', href: '/your-data' },
    ],
  },
  connect: {
    label: 'Connect',
    links: [
      { text: 'X (Twitter)', href: 'https://x.com/FlashFXeditor', external: true },
      { text: 'Instagram', href: 'https://www.instagram.com/flashfxeditor/', external: true },
      { text: 'YouTube', href: 'https://www.youtube.com/@flashfxeditor', external: true },
      { text: 'Newsletter', href: 'https://substack.com/@flashfx', external: true },
    ],
  },
};

export function Footer() {
  return (
    <footer className="relative w-full bg-fx-bg-surface">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-fx-text-primary mb-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            FlashFX
          </h2>
          <p className="text-fx-text-secondary text-[0.8rem]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            Motion graphics without the complexity.
          </p>
        </div>

        {/*
          Six columns now that Legal has its own. Six across does not fit at
          1024px without the labels wrapping, so `lg` takes three and a second
          row, and only `xl` puts them all on one line.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-12">
          {Object.entries(footerLinks).map(([key, column]) => (
            <div key={key}>
              <h3
                className={`font-medium text-[0.75rem] tracking-wider uppercase text-fx-text-secondary mb-5 ${'accent' in column && column.accent ? 'border-l border-[rgba(245,197,24,0.3)] pl-[6px]' : ''}`}
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                {column.label}
              </h3>
              <nav className="flex flex-col gap-[10px]">
                {column.links.map((link) =>
                  'external' in link && link.external ? (
                    <a
                      key={link.text}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.875rem] text-fx-text-secondary hover:text-fx-text-primary transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      {link.text}
                    </a>
                  ) : (
                    <Link
                      key={link.text}
                      href={link.href}
                      className="text-[0.875rem] text-fx-text-secondary hover:text-fx-text-primary transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      {link.text}
                    </Link>
                  )
                )}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.75rem] text-fx-text-secondary" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            © 2026 FlashFX. All rights reserved.
          </p>
          {/*
            Sitewide founder attribution. The rel="me" is the point of this link:
            it is the reciprocal half of the identity claim gabrielebolognese.blog
            makes, and it appears on every page because the footer does. Do not
            drop `me` from the rel when editing — "noopener noreferrer" alone
            silently removes the identity signal while looking untouched.

            Rendered outside the footerLinks map on purpose: that map's renderer
            hardcodes rel="noopener noreferrer" and has no way to express rel="me".
          */}
          <p className="text-[0.75rem] text-fx-text-secondary" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            Built by{' '}
            <a
              href="https://gabrielebolognese.blog"
              target="_blank"
              rel="me noopener noreferrer"
              className="text-fx-text-primary hover:text-fx-accent-yellow transition-colors duration-150"
            >
              Gabriele Bolognese
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
