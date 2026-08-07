import { Metadata } from 'next';
import { PolicyLayout } from '@/components/sections/legal/PolicyLayout';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Acceptable Use Policy | FlashFX',
  description:
    // Deliberately describes the document rather than listing its sections: the
    // text is served by Termly and can be edited outside this repo, so any
    // section list here would eventually describe a page that no longer exists.
    'The rules for using FlashFX: what counts as acceptable use of the editor and the work you export, what is prohibited, and what happens to accounts that break these rules.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Acceptable Use Policy | FlashFX',
    description: 'What you may and may not do with FlashFX.',
    url: 'https://flashfx.app/acceptable-use-policy',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acceptable Use Policy | FlashFX',
    description: 'What you may and may not do with FlashFX.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/acceptable-use-policy',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Acceptable Use Policy',
      item: 'https://flashfx.app/acceptable-use-policy',
    },
  ],
};

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <script
        id="acceptable-use-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PolicyLayout
        eyebrow="Legal"
        title="Acceptable Use Policy"
        standfirst="The short version: make what you want, do not use FlashFX to harm anyone. The detail is below."
        dataId="68d2d22d-5906-4a53-ada9-ec3b082a69d1"
      />
    </>
  );
}
