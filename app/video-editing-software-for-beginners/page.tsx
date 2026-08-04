import { Metadata } from 'next';
import { BeginnersHero } from '@/components/sections/video-editing-for-beginners/BeginnersHero';
import { LearningCurveComparison } from '@/components/sections/video-editing-for-beginners/LearningCurveComparison';
import { BeginnerWalkthrough } from '@/components/sections/video-editing-for-beginners/BeginnerWalkthrough';
import { BeginnerFAQSection } from '@/components/sections/video-editing-for-beginners/BeginnerFAQSection';
import { BeginnerFinalCTA } from '@/components/sections/video-editing-for-beginners/BeginnerFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';
import { beginnerFaqData } from '@/components/sections/video-editing-for-beginners/beginnerFaqData';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Video Editing Software for Beginners (2026) — Easy & Free | FlashFX',
  description: 'FlashFX is the easiest video editing software for beginners. Free, browser-based, no download needed. Create your first professional animation in under 15 minutes. No experience required.',
  keywords: [
    'video editing software for beginners',
    'easiest video editing software',
    'beginner motion graphics software',
    'simple animation software for beginners',
    'free easy video editor',
    'video editing for beginners 2026',
    'easy animation software',
    'how to make a YouTube intro beginner',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Video Editing Software for Beginners (2026) — Easy & Free | FlashFX',
    description: 'FlashFX is the easiest video editing software for beginners. Free, browser-based, no download. First export in under 15 minutes.',
    url: 'https://flashfx.app/video-editing-software-for-beginners',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Editing Software for Beginners (2026) — Easy & Free | FlashFX',
    description: 'FlashFX is the easiest video editing software for beginners. Free, browser-based. First export in under 15 minutes.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/video-editing-software-for-beginners',
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
  description: 'FlashFX is free, beginner-friendly motion graphics software. No prior experience required. Create and export professional animations in under 15 minutes.',
  url: 'https://flashfx.app',
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Create Your First Animation with FlashFX',
  description: 'Step-by-step guide for beginners to create and export a motion graphic using FlashFX.',
  totalTime: 'PT15M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Open FlashFX in Any Browser',
      text: 'Go to editor.flashfx.app. No account required, no download, no plugin to install.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose a Template or Start Blank',
      text: 'Select from the template library or start with a blank canvas at your preferred resolution.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Edit Text, Colors, and Timing',
      text: 'Click any element to select it. Change text and colors in the properties panel, and drag timeline handles to adjust timing.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Preview Your Animation',
      text: 'Press spacebar or click play to preview in real time.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Adjust with Motion Presets',
      text: 'Click an element and select an animation preset like Fade In, Slide Up, or Scale Pop.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Export as MP4',
      text: 'Click Export, select MP4, choose resolution, and click Render. The file downloads directly with no watermark.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: beginnerFaqData.map((faq) => ({
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
      name: 'Video Editing Software for Beginners',
      item: 'https://flashfx.app/video-editing-software-for-beginners',
    },
  ],
};

export default function VideoEditingForBeginnersPage() {
  return (
    <>
      <script
        id="beg-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="beg-howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        id="beg-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="beg-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <BeginnersHero />
        <SectionDivider />
        <LearningCurveComparison />
        <SectionDivider />
        <BeginnerWalkthrough />
        <SectionDivider />
        <BeginnerFAQSection />
        <SectionDivider />
        <BeginnerFinalCTA />
      </main>
    </>
  );
}
