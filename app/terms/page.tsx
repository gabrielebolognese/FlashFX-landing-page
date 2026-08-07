import { Metadata } from 'next';
import { PolicyLayout } from '@/components/sections/legal/PolicyLayout';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Terms of Service | FlashFX',
  description:
    'The terms you agree to when using FlashFX: what you may do with the service, what you keep ownership of, and where our responsibility ends.',
  robots: {
    index: true,
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
