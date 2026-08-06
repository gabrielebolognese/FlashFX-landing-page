import { Metadata } from 'next';
import { PolicyLayout } from '@/components/sections/legal/PolicyLayout';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Privacy Policy — FlashFX',
  description:
    'How FlashFX collects, uses, and stores your data, what rights you have over it, and how to exercise them.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy — FlashFX',
    description: 'How FlashFX collects, uses, and stores your data, and what rights you have over it.',
    url: 'https://flashfx.app/privacy',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — FlashFX',
    description: 'How FlashFX collects, uses, and stores your data, and what rights you have over it.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/privacy',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://flashfx.app/privacy' },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <script
        id="privacy-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PolicyLayout
        eyebrow="Legal"
        title="Privacy Policy"
        standfirst="What we collect, why we collect it, how long we keep it, and how to ask us to delete it."
        dataId="3988d8e2-6a65-4a0e-b9ed-f9d69258766b"
      />
    </>
  );
}
