import { Metadata } from 'next';
import { YourDataHero } from '@/components/sections/your-data/YourDataHero';
import { PolicyBody } from '@/components/sections/your-data/PolicyBody';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Your Data in FlashFX — What We Collect and Why',
  description:
    'Exactly what FlashFX collects, why, how long we keep it, who it is shared with, and how to get it deleted. Email and password only — no sensitive data, no third-party data, nothing sold.',
  keywords: [
    'FlashFX privacy',
    'FlashFX data',
    'FlashFX GDPR',
    'what data does FlashFX collect',
    'FlashFX delete my data',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Your Data in FlashFX — What We Collect and Why',
    description:
      'What we collect, why, how long we keep it, and how to make us delete it. In full, in plain language.',
    url: 'https://flashfx.app/your-data',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Data in FlashFX — What We Collect and Why',
    description:
      'What we collect, why, how long we keep it, and how to make us delete it. In full, in plain language.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/your-data',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'Your Data in FlashFX', item: 'https://flashfx.app/your-data' },
  ],
};

export default function YourDataPage() {
  return (
    <>
      <script
        id="your-data-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <YourDataHero />
        <SectionDivider />
        <PolicyBody />
      </main>
    </>
  );
}
