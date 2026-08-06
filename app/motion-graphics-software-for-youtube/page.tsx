import { Metadata } from 'next';
import { YTHero } from '@/components/sections/motion-graphics-for-youtube/YTHero';
import { YTUseCases } from '@/components/sections/motion-graphics-for-youtube/YTUseCases';
import { YTWorkflow } from '@/components/sections/motion-graphics-for-youtube/YTWorkflow';
import { YTFormats } from '@/components/sections/motion-graphics-for-youtube/YTFormats';
import { YTFAQSection } from '@/components/sections/motion-graphics-for-youtube/YTFAQSection';
import { ytFaqData } from '@/components/sections/motion-graphics-for-youtube/ytFaqData';
import { YTFinalCTA } from '@/components/sections/motion-graphics-for-youtube/YTFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Motion Graphics Software for YouTube — Intros, End Screens & Shorts | FlashFX',
  description:
    'Make YouTube intros, end screens, lower thirds, and Shorts in your browser. 90 animation presets, custom fonts, MP4 and transparent PNG sequence export, and no watermark on the free tier.',
  keywords: [
    'motion graphics software for youtube',
    'youtube intro maker',
    'youtube end screen maker',
    'lower thirds software',
    'youtube shorts animation',
    'free youtube intro creator',
    'browser motion graphics for creators',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Motion Graphics Software for YouTube — Intros, End Screens & Shorts | FlashFX',
    description:
      'Make YouTube intros, end screens, lower thirds, and Shorts in your browser. No install, no watermark on the free tier.',
    url: 'https://flashfx.app/motion-graphics-software-for-youtube',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motion Graphics Software for YouTube — Intros, End Screens & Shorts | FlashFX',
    description:
      'Make YouTube intros, end screens, lower thirds, and Shorts in your browser. No install, no watermark on the free tier.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/motion-graphics-software-for-youtube',
  },
};

/*
 * author/publisher tie this into the entity graph emitted on / and /about.
 * Those @id strings are byte-exact — see FIX.md.
 */
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FlashFX',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  url: 'https://flashfx.app',
  author: { '@id': 'https://flashfx.app/#organization' },
  publisher: { '@id': 'https://flashfx.app/#organization' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  // No aggregateRating — see app/page.tsx. Do not reintroduce.
  description:
    'FlashFX is browser-based motion graphics software for YouTube creators. Build channel intros, end screens, lower thirds, and Shorts with 90 animation presets, then export clean MP4 or transparent PNG sequences with no watermark.',
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
};

/*
 * Derived from ytFaqData rather than restated, so the visible FAQ and the
 * structured data cannot drift apart. Keep it derived.
 */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ytFaqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://flashfx.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Motion Graphics Software for YouTube',
      item: 'https://flashfx.app/motion-graphics-software-for-youtube',
    },
  ],
};

export default function MotionGraphicsForYouTubePage() {
  return (
    <>
      <script
        id="yt-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="yt-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="yt-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <YTHero />
        <SectionDivider />
        <YTUseCases />
        <SectionDivider />
        <YTWorkflow />
        <SectionDivider />
        <YTFormats />
        <SectionDivider />
        <YTFAQSection />
        <SectionDivider />
        <YTFinalCTA />
      </main>
    </>
  );
}
