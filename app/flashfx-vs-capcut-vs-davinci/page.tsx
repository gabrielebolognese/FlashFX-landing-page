import { Metadata } from 'next';
import { CompareHero } from '@/components/sections/compare/CompareHero';
import { PipelineArchitecture } from '@/components/sections/compare/PipelineArchitecture';
import { HardwareFloor } from '@/components/sections/compare/HardwareFloor';
import { CapabilityMatrix } from '@/components/sections/compare/CapabilityMatrix';
import { WhenToUseWhich } from '@/components/sections/compare/WhenToUseWhich';
import { MeasurementNote } from '@/components/sections/compare/MeasurementNote';
import { CompareFAQSection } from '@/components/sections/compare/CompareFAQSection';
import { compareFaqData } from '@/components/sections/compare/compareFaqData';
import { CompareFinalCTA } from '@/components/sections/compare/CompareFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'FlashFX vs CapCut vs DaVinci Resolve — Architecture, Hardware & Features',
  description:
    'How FlashFX, CapCut and DaVinci Resolve differ by pipeline architecture, hardware requirements, and what each can actually do. Published specs and capability comparison — no unmeasured performance claims.',
  keywords: [
    'FlashFX vs CapCut',
    'FlashFX vs DaVinci Resolve',
    'CapCut alternative',
    'DaVinci Resolve alternative',
    'browser video editor comparison',
    'motion graphics software comparison',
    'CapCut vs DaVinci Resolve',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FlashFX vs CapCut vs DaVinci Resolve — Architecture, Hardware & Features',
    description:
      'Three tools built for different jobs. Compared by architecture, hardware floor, and capability — with no unmeasured performance claims.',
    url: 'https://flashfx.app/flashfx-vs-capcut-vs-davinci',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFX vs CapCut vs DaVinci Resolve',
    description:
      'Three tools built for different jobs. Compared by architecture, hardware floor, and capability — with no unmeasured performance claims.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/flashfx-vs-capcut-vs-davinci',
  },
};

/*
 * No performance claims in this schema either — only what the page states, and
 * the page states architecture and published specs. See comparisonData.ts.
 *
 * author/publisher tie into the entity graph on / and /about. Byte-exact.
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
    'FlashFX is a browser-based motion graphics editor. Unlike CapCut it has a full compositing model with a keyframe graph, masks and nested compositions; unlike DaVinci Resolve it needs no installation and no dedicated GPU.',
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: compareFaqData.map((faq) => ({
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
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'FlashFX vs CapCut vs DaVinci Resolve',
      item: 'https://flashfx.app/flashfx-vs-capcut-vs-davinci',
    },
  ],
};

export default function CompareCapcutDavinciPage() {
  return (
    <>
      <script
        id="compare-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="compare-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="compare-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <CompareHero />
        <SectionDivider />
        <PipelineArchitecture />
        <SectionDivider />
        <HardwareFloor />
        <SectionDivider />
        <CapabilityMatrix />
        <SectionDivider />
        <WhenToUseWhich />
        <SectionDivider />
        <MeasurementNote />
        <SectionDivider />
        <CompareFAQSection />
        <SectionDivider />
        <CompareFinalCTA />
      </main>
    </>
  );
}
