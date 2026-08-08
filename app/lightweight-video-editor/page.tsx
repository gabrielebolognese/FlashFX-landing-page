import { Metadata } from 'next';
import { LightHero } from '@/components/sections/lightweight-video-editor/LightHero';
import { SystemRequirementsSection } from '@/components/sections/lightweight-video-editor/SystemRequirementsSection';
import { BenchmarkComparisons } from '@/components/sections/lightweight-video-editor/BenchmarkComparisons';
import { LightweightFAQSection } from '@/components/sections/lightweight-video-editor/LightweightFAQSection';
import { LightweightFinalCTA } from '@/components/sections/lightweight-video-editor/LightweightFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';
import { lightweightFaqData } from '@/components/sections/lightweight-video-editor/lightweightFaqData';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Lightweight Video Editor: Works on Low-End PCs & Chromebooks | FlashFX',
  description: 'FlashFX is a lightweight video editing software that runs in the browser. Works on 4 GB RAM, no GPU required, no installation. Fast motion graphics for any PC, Chromebook, or old laptop.',
  keywords: [
    'lightweight video editor',
    'lightweight video editing software',
    'video editor for low end PC',
    'fast video editor low RAM',
    'motion graphics software for old PC',
    'browser based video editor',
    'video editor Chromebook',
    'video editor without installation',
    'video editor 4GB RAM',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Lightweight Video Editor: Works on Low-End PCs & Chromebooks | FlashFX',
    description: 'FlashFX is a lightweight video editing software that runs in the browser on any hardware. Works on 4 GB RAM, no GPU required, no installation.',
    url: 'https://flashfx.app/lightweight-video-editor',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lightweight Video Editor: Works on Low-End PCs & Chromebooks | FlashFX',
    description: 'FlashFX is a lightweight video editing software that runs in the browser on any hardware.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/lightweight-video-editor',
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
  description: 'FlashFX is a lightweight video and motion graphics editor that runs in the browser. Requires only 4 GB RAM and no GPU. Works on Chromebooks, old laptops, and budget PCs.',
  url: 'https://flashfx.app',
  memoryRequirements: '4 GB RAM',
  processorRequirements: 'Any dual-core processor',
  storageRequirements: '0 GB: browser-based',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: lightweightFaqData.map((faq) => ({
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
      name: 'Lightweight Video Editor',
      item: 'https://flashfx.app/lightweight-video-editor',
    },
  ],
};

export default function LightweightVideoEditorPage() {
  return (
    <>
      <script
        id="lw-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="lw-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="lw-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <LightHero />
        <SectionDivider />
        <SystemRequirementsSection />
        <SectionDivider />
        <BenchmarkComparisons />
        <SectionDivider />
        <LightweightFAQSection />
        <SectionDivider />
        <LightweightFinalCTA />
      </main>
    </>
  );
}
