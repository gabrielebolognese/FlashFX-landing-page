import { Metadata } from 'next';
import { PolicyLayout } from '@/components/sections/legal/PolicyLayout';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Terms of Service | FlashFX',
  description:
    'The terms you agree to when using FlashFX: what you may do with the service, what you keep ownership of, and where our responsibility ends.',
  /*
   * noindex, follow — decided 2026-08-07.
   *
   * The text of this page is delivered by Termly's embed script, which injects
   * it client-side. Server-rendered HTML is about 250 characters: the chrome,
   * and nothing else. Google does render JavaScript, but for a third-party
   * embed it is unreliable and slow, so what stood a real chance of being
   * indexed was an all-but-empty page.
   *
   * A legal page has no search job to do. It has to exist, be reachable, and be
   * readable by a person who goes looking for it — all of which still hold.
   * Removing it from the index costs nothing and stops three near-empty URLs
   * representing the site.
   *
   * `follow` stays on so the crawler keeps traversing the footer links from
   * here rather than treating this as a dead end.
   *
   * Not the same treatment as /privacy, deliberately: that one canonicalises to
   * /your-data, which carries the identical policy in server-rendered HTML.
   * Combining noindex with a canonical is a documented Google anti-pattern —
   * the noindex can propagate to the canonical target — so a page with a real
   * indexable twin gets the canonical, and these three, which have none, get
   * the noindex.
   *
   * Excluded from the sitemap in next-sitemap.config.js to match; advertising a
   * noindex URL for indexing is the contradiction Search Console reports as
   * "Submitted URL marked 'noindex'".
   */
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service | FlashFX',
    description: 'The terms you agree to when using FlashFX.',
    url: 'https://flashfx.app/terms',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | FlashFX',
    description: 'The terms you agree to when using FlashFX.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/terms',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://flashfx.app/terms' },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        id="terms-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PolicyLayout
        eyebrow="Legal"
        title="Terms of Service"
        standfirst="The agreement between you and FlashFX. Your projects stay yours — this covers everything else."
        dataId="6f1659f4-6685-4aab-a869-79fc9c08d1b6"
      />
    </>
  );
}
