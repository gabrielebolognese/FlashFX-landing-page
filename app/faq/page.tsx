import { Metadata } from 'next';
import { FAQHero } from '@/components/sections/faq/FAQHero';
import { FAQExplorer } from '@/components/sections/faq/FAQExplorer';
import { faqData } from '@/components/sections/faq/faqData';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'FAQ: Everything About FlashFX | Search the Answers',
  description:
    'Answers about FlashFX: browser support, what you can animate, export formats and transparency, the free tier, paid plan pricing, project storage, and version history.',
  keywords: [
    'FlashFX FAQ',
    'FlashFX help',
    'FlashFX questions',
    'FlashFX export formats',
    'FlashFX free tier',
    'FlashFX browser support',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FAQ: Everything About FlashFX',
    description:
      'Answers about browser support, animation, export formats, the free tier, pricing, and project storage.',
    url: 'https://flashfx.app/faq',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ: Everything About FlashFX',
    description:
      'Answers about browser support, animation, export formats, the free tier, pricing, and project storage.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/faq',
  },
};

/*
 * Derived from faqData rather than restated, so the visible list and the
 * structured data cannot drift. Every entry is rendered on the page — the
 * search filters the view, not the markup, so the schema stays complete.
 */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: entry.answer,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://flashfx.app/faq' },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="faq-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <FAQHero />
        <FAQExplorer />
      </main>
    </>
  );
}
