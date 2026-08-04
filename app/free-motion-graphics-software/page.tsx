import { Metadata } from 'next';
import { FMGHero } from '@/components/sections/free-motion-graphics/FMGHero';
import { WhatMakesSoftwareFree } from '@/components/sections/free-motion-graphics/WhatMakesSoftwareFree';
import { FMGFreeTierBreakdown } from '@/components/sections/free-motion-graphics/FMGFreeTierBreakdown';
import { FMGComparisonTable } from '@/components/sections/free-motion-graphics/FMGComparisonTable';
import { OutputQualitySection } from '@/components/sections/free-motion-graphics/OutputQualitySection';
import { FMGUseCases } from '@/components/sections/free-motion-graphics/FMGUseCases';
import { FMGFAQSection } from '@/components/sections/free-motion-graphics/FMGFAQSection';
import { fmgFaqData } from '@/components/sections/free-motion-graphics/fmgFaqData';
import { FMGFinalCTA } from '@/components/sections/free-motion-graphics/FMGFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Free Motion Graphics Software (2026) — No Watermark | FlashFX',
  description: 'FlashFX is free motion graphics software with no watermark, no installation, and no subscription. Create professional animations for YouTube, social media, and presentations. Try it free in your browser.',
  keywords: [
    'free motion graphics software',
    'free motion graphics software for beginners',
    'motion graphics software without watermark',
    'free motion graphics editor',
    'free animation software 2026',
    'free motion graphics tool',
    'browser based motion graphics',
    'no watermark video animation software',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Free Motion Graphics Software (2026) — No Watermark | FlashFX',
    description: 'FlashFX is free motion graphics software with no watermark, no installation, and no subscription. Create professional animations in your browser.',
    url: 'https://flashfx.app/free-motion-graphics-software',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Motion Graphics Software (2026) — No Watermark | FlashFX',
    description: 'FlashFX is free motion graphics software with no watermark, no installation, and no subscription. Create professional animations in your browser.',
  },
  alternates: {
    canonical: 'https://flashfx.app/free-motion-graphics-software',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FlashFX',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  // No aggregateRating — see app/page.tsx. Do not reintroduce.
  description: 'FlashFX is free motion graphics software that runs in the browser. Create professional animations for YouTube, social media, and presentations with no watermark, no installation, and no subscription.',
  url: 'https://flashfx.app',
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
  // softwareVersion and releaseNotes removed 2026-08-04: both were unverifiable.
  // Restore with real values if wanted — schema does not require either.
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: fmgFaqData.map((faq) => ({
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
      name: 'Free Motion Graphics Software',
      item: 'https://flashfx.app/free-motion-graphics-software',
    },
  ],
};

export default function FreeMotionGraphicsSoftwarePage() {
  return (
    <>
      <script
        id="fmg-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="fmg-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="fmg-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <FMGHero />
        <SectionDivider />
        <WhatMakesSoftwareFree />
        <SectionDivider />
        <FMGFreeTierBreakdown />
        <SectionDivider />
        <FMGComparisonTable />
        <SectionDivider />
        <OutputQualitySection />
        <SectionDivider />
        <FMGUseCases />
        <SectionDivider />
        <FMGFAQSection />
        <SectionDivider />
        <FMGFinalCTA />
      </main>
    </>
  );
}
