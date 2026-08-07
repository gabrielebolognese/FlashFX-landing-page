import { Metadata } from 'next';
import { FeaturesPageHero } from '@/components/sections/features/FeaturesPageHero';
import { FeatureCategoryGrid } from '@/components/sections/features/FeatureCategoryGrid';
import { TemplatesSection } from '@/components/sections/features/TemplatesSection';
import { ExportSection } from '@/components/sections/features/ExportSection';
import { FeaturesFinalCTA } from '@/components/sections/features/FeaturesFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Features: Vector Design, Keyframe Animation, 3D & Export | FlashFX',
  description:
    'Every FlashFX feature in one place: vector design tools, keyframe animation with 16 easing functions, 90 motion presets, 3D with model import, 70+ image filters, and MP4, WebM, GIF, SVG and PNG sequence export. All in the browser.',
  keywords: [
    'FlashFX features',
    'browser motion graphics features',
    'keyframe animation software',
    'motion graphics presets',
    'video export formats',
    'online animation editor features',
    'web based 3D animation',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Features: Vector Design, Keyframe Animation, 3D & Export | FlashFX',
    description:
      'Vector design, keyframe animation, 3D, audio, and export — the whole motion graphics pipeline, running in a browser tab with nothing to install.',
    url: 'https://flashfx.app/features',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features: Vector Design, Keyframe Animation, 3D & Export | FlashFX',
    description:
      'Vector design, keyframe animation, 3D, audio, and export — the whole motion graphics pipeline, running in a browser tab with nothing to install.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/features',
  },
};

/*
 * Ties into the entity graph emitted on / and /about via the author and
 * publisher @id references. Those strings are byte-exact — see FIX.md.
 */
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FlashFX',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  url: 'https://flashfx.app',
  author: { '@id': 'https://flashfx.app/#organization' },
  publisher: { '@id': 'https://flashfx.app/#organization' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  // No aggregateRating — see app/page.tsx. Do not reintroduce.
  description:
    'FlashFX is a browser-based motion graphics editor with vector design tools, keyframe animation, 3D, audio, and multi-format export.',
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
  featureList: [
    'Vector design tools with pen tool and bezier curves',
    'Keyframe animation with 16 easing functions',
    '90 animation presets across 17 categories',
    '3D primitives with GLB, OBJ, FBX and STL model import',
    '70+ image filters across 14 categories',
    'Multi-track audio with waveform visualisation',
    'Export to MP4, WebM, GIF, SVG and PNG sequence',
  ],
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
      name: 'Features',
      item: 'https://flashfx.app/features',
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <script
        id="features-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="features-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <FeaturesPageHero />
        <SectionDivider />
        <FeatureCategoryGrid />
        <SectionDivider />
        <TemplatesSection />
        <SectionDivider />
        <ExportSection />
        <SectionDivider />
        <FeaturesFinalCTA />
      </main>
    </>
  );
}
