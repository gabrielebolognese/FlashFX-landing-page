import { Metadata } from 'next';
import { PolicyLayout } from '@/components/sections/legal/PolicyLayout';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Refund Policy — FlashFX',
  description:
    'When a FlashFX subscription can be refunded, how to request one, and how long it takes to process.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Refund Policy — FlashFX',
    description: 'When a FlashFX subscription can be refunded, and how to request one.',
    url: 'https://flashfx.app/refund-policy',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund Policy — FlashFX',
    description: 'When a FlashFX subscription can be refunded, and how to request one.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/refund-policy',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'Refund Policy', item: 'https://flashfx.app/refund-policy' },
  ],
};

export default function RefundPolicyPage() {
  return (
    <>
      <script
        id="refund-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PolicyLayout
        eyebrow="Legal"
        title="Refund Policy"
        standfirst="The free tier costs nothing, so this only applies to Ultra and Teams. Here is when a refund applies and how to ask for one."
        dataId="018911a9-2bbf-4134-b294-587fbc90fcea"
      />
    </>
  );
}
