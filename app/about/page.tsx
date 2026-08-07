import { Metadata } from 'next';
import { AboutHero } from '@/components/sections/about/AboutHero';
import { WhatWeBuild } from '@/components/sections/about/WhatWeBuild';
import { FoundingTeam } from '@/components/sections/about/FoundingTeam';
import { CompanyTimeline } from '@/components/sections/about/CompanyTimeline';
import { AboutCTA } from '@/components/sections/about/AboutCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'About FlashFX: Founded by Gabriele Bolognese',
  description:
    'FlashFX is a browser-based motion graphics and video editor founded on 1 January 2024 by Gabriele Bolognese, its founder and CEO. Meet the three-person team building an alternative to After Effects and Premiere Pro.',
  keywords: [
    'FlashFX',
    'about FlashFX',
    'Gabriele Bolognese',
    'FlashFX founder',
    'FlashFX team',
    'browser-based motion graphics',
    'After Effects alternative',
  ],
  authors: [{ name: 'Gabriele Bolognese', url: 'https://gabrielebolognese.blog' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About FlashFX: Founded by Gabriele Bolognese',
    description:
      'FlashFX is a browser-based motion graphics and video editor founded on 1 January 2024 by Gabriele Bolognese, its founder and CEO. Meet the three-person team building an alternative to After Effects and Premiere Pro.',
    url: 'https://flashfx.app/about',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FlashFX: Founded by Gabriele Bolognese',
    description:
      'FlashFX is a browser-based motion graphics and video editor founded on 1 January 2024 by Gabriele Bolognese, its founder and CEO.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/about',
  },
};

/*
 * Entity graph. The @id values are load-bearing: they must stay byte-identical
 * to the ones gabrielebolognese.blog emits, or the Organization and the Person
 * resolve as two unrelated nodes instead of one connected graph. The same block
 * is emitted on the homepage (app/page.tsx).
 *
 * The sameAs URLs are string-exact. Do not normalise `www`, do not add or strip
 * trailing slashes, do not reorder — sameAs matching is literal.
 */
const entityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://flashfx.app/#organization',
      name: 'FlashFX',
      url: 'https://flashfx.app',
      logo: 'https://flashfx.app/android-chrome-192x192.png',
      foundingDate: '2024-01-01',
      description:
        'FlashFX is a browser-based motion graphics and video editing platform, an alternative to After Effects and Premiere Pro.',
      founder: { '@id': 'https://gabrielebolognese.blog/#person' },
      sameAs: ['https://x.com/FlashFXeditor'],
    },
    {
      '@type': 'Person',
      '@id': 'https://gabrielebolognese.blog/#person',
      name: 'Gabriele Bolognese',
      url: 'https://gabrielebolognese.blog',
      jobTitle: 'Founder & CEO',
      worksFor: { '@id': 'https://flashfx.app/#organization' },
      sameAs: [
        'https://www.linkedin.com/in/gabriele-bolognese/',
        'https://github.com/gabrielebolognese',
        'https://www.youtube.com/@gabriele.bolognese',
        'https://www.instagram.com/logs.of.gabry/',
        'https://www.producthunt.com/@gabrielebolognese',
        'https://peerlist.io/gabrielebologne',
        'https://www.connectively.us/p/gabriele-bolognese',
      ],
    },
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
      name: 'About',
      item: 'https://flashfx.app/about',
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/*
        Plain <script>, not next/script. `next/script` defers JSON-LD into the RSC
        payload and injects it after hydration, so it never appears in the
        server-rendered HTML — verified 2026-08-03: every page on this site
        currently ships zero <script type="application/ld+json"> tags for exactly
        that reason. A plain script tag in a server component renders inline, which
        is what crawlers need. The other five pages still need this fix (see M2).
      */}
      <script
        id="entity-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <AboutHero />
        <SectionDivider />
        <WhatWeBuild />
        <SectionDivider />
        <FoundingTeam />
        <SectionDivider />
        <CompanyTimeline />
        <SectionDivider />
        <AboutCTA />
      </main>
    </>
  );
}
