import { Metadata } from 'next';
import { DownloadHero } from '@/components/sections/download/DownloadHero';
import { InstallGuide } from '@/components/sections/download/InstallGuide';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Download — FlashFX Is All Web | Install It From Your Browser',
  description:
    'There is no FlashFX installer. It runs in the browser. Here is how to install it as a windowed app from Chrome, Edge, Brave, Safari, iOS, and Android in a few clicks.',
  keywords: [
    'FlashFX download',
    'install FlashFX',
    'FlashFX desktop app',
    'install web app as app',
    'browser motion graphics no download',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Download — FlashFX Is All Web | Install It From Your Browser',
    description:
      'No installer. FlashFX runs in the browser — here is how to install it as a windowed app in a few clicks.',
    url: 'https://flashfx.app/download',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download — FlashFX Is All Web | Install It From Your Browser',
    description:
      'No installer. FlashFX runs in the browser — here is how to install it as a windowed app in a few clicks.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/download',
  },
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
      name: 'Download',
      item: 'https://flashfx.app/download',
    },
  ],
};

export default function DownloadPage() {
  return (
    <>
      <script
        id="download-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <DownloadHero />
        <SectionDivider />
        <InstallGuide />
      </main>
    </>
  );
}
