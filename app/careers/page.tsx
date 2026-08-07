import { Metadata } from 'next';
import { CareersHero } from '@/components/sections/careers/CareersHero';
import { CareersContact } from '@/components/sections/careers/CareersContact';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Careers | FlashFX',
  description:
    'FlashFX is built by a team of three. There are no open roles right now, but you can reach us at careers@flashfx.app to be on the list for when that changes.',
  keywords: ['FlashFX careers', 'FlashFX jobs', 'work at FlashFX'],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Careers | FlashFX',
    description:
      'FlashFX is built by a team of three. No open roles right now — reach us at careers@flashfx.app.',
    url: 'https://flashfx.app/careers',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | FlashFX',
    description:
      'FlashFX is built by a team of three. No open roles right now — reach us at careers@flashfx.app.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/careers',
  },
};

/*
 * BreadcrumbList only. No JobPosting — there are no open roles, and marking up
 * a vacancy that does not exist would be fabrication of the kind FIX.md M4
 * existed to remove. Add JobPosting when a real role opens, not before.
 */
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
      name: 'Careers',
      item: 'https://flashfx.app/careers',
    },
  ],
};

export default function CareersPage() {
  return (
    <>
      <script
        id="careers-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <CareersHero />
        <SectionDivider />
        <CareersContact />
      </main>
    </>
  );
}
