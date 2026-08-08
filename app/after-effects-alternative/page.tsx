import { Metadata } from 'next';
import { PageHero } from '@/components/sections/after-effects-alternative/PageHero';
import { WhyCreatorsSwitch } from '@/components/sections/after-effects-alternative/WhyCreatorsSwitch';
import { FeatureComparisonTable } from '@/components/sections/after-effects-alternative/FeatureComparisonTable';
import { PerformanceBenchmark } from '@/components/sections/after-effects-alternative/PerformanceBenchmark';
import { PricingComparison } from '@/components/sections/after-effects-alternative/PricingComparison';
import { UseCaseMatrix } from '@/components/sections/after-effects-alternative/UseCaseMatrix';
import { MigrationGuide } from '@/components/sections/after-effects-alternative/MigrationGuide';
import { AEFAQSection } from '@/components/sections/after-effects-alternative/AEFAQSection';
import { AEFinalCTA } from '@/components/sections/after-effects-alternative/AEFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Best After Effects Alternative in 2026 | FlashFX (Free & Lightweight)',
  description: 'Looking for a free After Effects alternative? FlashFX delivers professional motion graphics with no learning curve, no heavy install, and no subscription. Try it free.',
  keywords: [
    'after effects alternative',
    'free after effects alternative',
    'motion graphics software',
    'browser-based video editor',
    'lightweight motion graphics',
    'after effects free alternative',
    'motion graphics for youtube',
    'after effects replacement',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Best After Effects Alternative in 2026 | FlashFX',
    description: 'Looking for a free After Effects alternative? FlashFX delivers professional motion graphics with no learning curve, no heavy install, and no subscription. Try it free.',
    url: 'https://flashfx.app/after-effects-alternative',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best After Effects Alternative in 2026 | FlashFX',
    description: 'Looking for a free After Effects alternative? FlashFX delivers professional motion graphics with no learning curve, no heavy install, and no subscription. Try it free.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/after-effects-alternative',
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
  description: 'FlashFX is a free, browser-based motion graphics application that provides a lightweight alternative to Adobe After Effects. Create professional motion graphics without installation, subscription fees, or high-end hardware requirements.',
  url: 'https://flashfx.app',
  // Was https://flashfx.app/static/screenshot.png — that path 404s, there is no
  // public/static directory. Pointed at a real asset 2026-08-04.
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
  // softwareVersion and releaseNotes removed 2026-08-04: both were unverifiable.
  // Restore with a real version string and real release notes if wanted — schema
  // does not require either property.
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is FlashFX completely free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FlashFX has a free tier with no watermark and access to core motion graphics features including timeline editing, basic effects, and MP4 export. A paid tier with advanced templates, additional export formats, and priority rendering is available for creators who need more capabilities. See the pricing page for detailed feature comparisons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can FlashFX replace After Effects for professional work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most creator use cases, including YouTube intros, social media reels, presentation animations, and explainer videos, FlashFX provides all the necessary tools without the complexity of After Effects. For highly specialized studio-level VFX compositing, advanced 3D rendering, and complex plugin-dependent workflows, After Effects remains the industry standard. However, the vast majority of creators do not need that level of capability for their day-to-day content production.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FlashFX work on a low-end PC or Chromebook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FlashFX is optimized to run in any modern web browser and requires approximately 4GB of RAM for smooth operation. It works perfectly on Chromebooks, older Windows laptops, and budget MacBooks where After Effects would not install or would crash frequently. There is no need for a dedicated GPU or high-end processor. If you can browse the web, you can use FlashFX.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to install anything?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. FlashFX is entirely browser-based. Simply navigate to the FlashFX URL, and you have immediate access to the full editing interface. There is no download, no installation wizard, no Creative Cloud account requirement, and no disk space consumed on your local drive. Updates happen automatically without any action required from you.',
      },
    },
    {
      '@type': 'Question',
      name: 'What export formats does FlashFX support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FlashFX currently supports MP4, WebM, and animated GIF export formats. These cover the majority of use cases for web video, social media content, and embedded animations. Additional formats including MOV and AVI are on the development roadmap. If you need a specific format not currently supported, you can export as MP4 and use a free converter tool as an intermediary step.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FlashFX good for YouTube intros and channel branding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Creating YouTube intros, outros, lower thirds, and channel branding graphics is one of the primary use cases FlashFX was designed for. The built-in template library includes pre-configured animations specifically tailored for YouTube content creators. You can customize colors, text, and timing to match your brand, then export directly as MP4 for upload. Many creators use FlashFX exclusively for all their channel graphics needs.',
      },
    },
  ],
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
      name: 'After Effects Alternative',
      item: 'https://flashfx.app/after-effects-alternative',
    },
  ],
};

export default function AfterEffectsAlternativePage() {
  return (
    <>
      <script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <PageHero />
        <SectionDivider />
        <WhyCreatorsSwitch />
        <SectionDivider />
        <FeatureComparisonTable />
        <SectionDivider />
        <PerformanceBenchmark />
        <SectionDivider />
        <PricingComparison />
        <SectionDivider />
        <UseCaseMatrix />
        <SectionDivider />
        <MigrationGuide />
        <SectionDivider />
        <AEFAQSection />
        <SectionDivider />
        <AEFinalCTA />
      </main>
    </>
  );
}
