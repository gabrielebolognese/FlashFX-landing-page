import { Metadata } from 'next';
import { ChangelogHero } from '@/components/sections/changelog/ChangelogHero';
import { ChangelogList } from '@/components/sections/changelog/ChangelogList';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Changelog: What Has Changed in FlashFX',
  description:
    'Every FlashFX release, newest first. Because FlashFX runs in the browser, you are always on the current version. There is nothing to download or update.',
  keywords: ['FlashFX changelog', 'FlashFX releases', 'FlashFX updates', 'FlashFX new features'],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Changelog: What Has Changed in FlashFX',
    description: 'Every FlashFX release, newest first.',
    url: 'https://flashfx.app/changelog',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog: What Has Changed in FlashFX',
    description: 'Every FlashFX release, newest first.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/changelog',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashfx.app' },
    { '@type': 'ListItem', position: 2, name: 'Changelog', item: 'https://flashfx.app/changelog' },
  ],
};

export default function ChangelogPage() {
  return (
    <>
      <script
        id="changelog-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <ChangelogHero />
        <ChangelogList />
      </main>
    </>
  );
}
