import { Metadata } from 'next';
import { BrandHero } from '@/components/sections/brand/BrandHero';
import { BrandLogo } from '@/components/sections/brand/BrandLogo';
import { BrandPalette } from '@/components/sections/brand/BrandPalette';
import { BrandTypography } from '@/components/sections/brand/BrandTypography';
import { BrandNaming } from '@/components/sections/brand/BrandNaming';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Brand — Logo, Colour, Type & Boilerplate | FlashFX',
  description:
    'The FlashFX brand: logo download, the colour palette with hex values, the four typefaces we use, how to write the name, and standard boilerplate for press.',
  keywords: ['FlashFX brand', 'FlashFX logo', 'FlashFX press kit', 'FlashFX colours', 'FlashFX boilerplate'],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Brand — Logo, Colour, Type & Boilerplate | FlashFX',
    description:
      'Logo download, colour palette with hex values, typefaces, name usage, and standard boilerplate for press.',
    url: 'https://flashfx.app/brand',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand — Logo, Colour, Type & Boilerplate | FlashFX',
    description:
      'Logo download, colour palette with hex values, typefaces, name usage, and standard boilerplate for press.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/brand',
  },
};

/*
 * BreadcrumbList only, deliberately.
 *
 * The Organization node lives on / and /about (FIX.md M2) and this page does not
 * re-emit it. A third copy would be a third place for the byte-exact @id and
 * sameAs values to drift, and the graph gains nothing from the repetition.
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
      name: 'Brand',
      item: 'https://flashfx.app/brand',
    },
  ],
};

export default function BrandPage() {
  return (
    <>
      <script
        id="brand-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <BrandHero />
        <SectionDivider />
        <BrandLogo />
        <SectionDivider />
        <BrandPalette />
        <SectionDivider />
        <BrandTypography />
        <SectionDivider />
        <BrandNaming />
      </main>
    </>
  );
}
