import { Metadata } from 'next';
import { PricingPageHero } from '@/components/sections/pricing/PricingPageHero';
import { PricingSection } from '@/components/sections/PricingSection';
import { PricingFinalCTA } from '@/components/sections/pricing/PricingFinalCTA';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'Pricing: Free Tier, Pro & Ultra | FlashFX',
  description:
    'FlashFX pricing: a free tier with unlimited projects and no watermark, Pro at $29/month for AI and full 3D, and Ultra at $89/month for long-form agents, AI in 3D and 200M credits. No install, no credit card to start.',
  keywords: [
    'FlashFX pricing',
    'FlashFX cost',
    'motion graphics software pricing',
    'free motion graphics software',
    'video editor subscription',
    'After Effects alternative pricing',
  ],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Pricing: Free Tier, Pro & Ultra | FlashFX',
    description:
      'A free tier with unlimited projects and no watermark. Pro at $29/month for AI and full 3D. Ultra at $89/month for long-form agents, AI in 3D and 200M credits.',
    url: 'https://flashfx.app/pricing',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing: Free Tier, Pro & Ultra | FlashFX',
    description:
      'A free tier with unlimited projects and no watermark. Pro at $29/month for AI and full 3D. Ultra at $89/month for long-form agents, AI in 3D and 200M credits.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/pricing',
  },
};

/*
 * Offer prices mirror the `cardPlans` array in
 * components/sections/PricingSection.tsx, which this page renders directly —
 * that component stays the single source of truth for what a plan costs. If a
 * price changes there, change it here too, or the structured data will
 * advertise a price the page does not show.
 *
 * The author/publisher @id strings tie this into the entity graph emitted on /
 * and /about, and are byte-exact — see FIX.md.
 */
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FlashFX',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  url: 'https://flashfx.app',
  author: { '@id': 'https://flashfx.app/#organization' },
  publisher: { '@id': 'https://flashfx.app/#organization' },
  // No aggregateRating — see app/page.tsx. Do not reintroduce.
  description:
    'FlashFX is a browser-based motion graphics editor with a free tier, a $29/month Pro plan, and an $89/month Ultra plan.',
  screenshot: 'https://flashfx.app/Screenshot_2026-03-01_183521.png',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description:
        'Unlimited projects, the full editor, keyframe animation, every 3D primitive with model import and HDRI lighting, 1M AI credits a month, and exports with no watermark.',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '29',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description:
        'Everything in Free, plus the AI toolset, 50M AI credits a month, advanced 3D materials, 20 GB of storage, and priority support. $278 billed annually.',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '29',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
    },
    {
      '@type': 'Offer',
      name: 'Ultra',
      price: '89',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description:
        'Everything in Pro, plus long-form agents across multiple parallel scenes, AI in 3D, 200M AI credits a month, 70 GB of storage, and team collaboration. $854 billed annually.',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '89',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
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
      name: 'Pricing',
      item: 'https://flashfx.app/pricing',
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        id="pricing-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        id="pricing-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <PricingPageHero />
        <SectionDivider />
        {/*
          Reused verbatim from the homepage rather than duplicated, so the plan
          tables on / and /pricing can never disagree. It carries id="pricing",
          which is what PricingPageHero's Compare Plans button scrolls to.
        */}
        <PricingSection />
        <SectionDivider />
        <PricingFinalCTA />
      </main>
    </>
  );
}
