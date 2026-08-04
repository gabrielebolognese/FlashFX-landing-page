import { Hero } from '@/components/sections/Hero';
import { WhatIsFlashFX } from '@/components/sections/WhatIsFlashFX';
import { VideoPlaceholder } from '@/components/sections/VideoPlaceholder';
import { ImageCarousel } from '@/components/sections/ImageCarousel';
import { SolutionSection } from '@/components/sections/SolutionSection';
import { FeaturesIntro } from '@/components/sections/FeaturesIntro';
import { AllWebEditing } from '@/components/sections/AllWebEditing';
import { EasyAnimations } from '@/components/sections/EasyAnimations';
import { ThreeDSupport } from '@/components/sections/ThreeDSupport';
import { KeyframeInterpolation } from '@/components/sections/KeyframeInterpolation';
import { SplitHero } from '@/components/sections/SplitHero';
import { FeatureHighlights } from '@/components/sections/FeatureHighlights';
import { ComparisonTeaser } from '@/components/sections/ComparisonTeaser';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { LoadTime } from '@/components/sections/LoadTime';
import { CreatorStories } from '@/components/sections/CreatorStories';
import { AllLinks } from '@/components/sections/AllLinks';
import { PricingSection } from '@/components/sections/PricingSection';

/*
 * Entity graph. The @id values are load-bearing: they must stay byte-identical
 * to the ones gabrielebolognese.blog emits, and to the copy on /about, or the
 * Organization and the Person resolve as unrelated nodes instead of one graph.
 *
 * The sameAs URLs are string-exact. Do not normalise `www`, do not add or strip
 * trailing slashes, do not reorder — sameAs matching is literal.
 *
 * Emitted as a plain <script>, never next/script: next/script defers JSON-LD
 * into the RSC payload and injects it post-hydration, so it never reaches the
 * server HTML where crawlers look.
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

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FlashFX',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  // Ties this standalone node into the entity graph above.
  author: { '@id': 'https://flashfx.app/#organization' },
  publisher: { '@id': 'https://flashfx.app/#organization' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  // No aggregateRating here, deliberately. First-party rating markup with no
  // verifiable review source is self-serving and risks a manual action — the
  // fastest way to lose rich results on the domain. Do not reintroduce it.
  description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is FlashFX free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FlashFX is completely free to use. Create unlimited projects, export as many times as you need, with no hidden costs or subscription fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it run on low-end PCs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. FlashFX is optimized for performance and runs smoothly in any modern web browser, even on modest hardware. No expensive GPU required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it good for YouTube?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Perfect for YouTube. FlashFX exports high-quality MP4 files optimized for social media platforms. Many creators use it for intros, outros, and thumbnails.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it replace After Effects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most creators, yes. While After Effects offers advanced features for professionals, FlashFX covers 90% of common use cases with a fraction of the complexity.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        id="entity-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
      />
      <script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        <Hero />
        <WhatIsFlashFX />
        <ImageCarousel />
        <SolutionSection />
        <VideoPlaceholder title="Intuitive Timeline Editing" description="Keyframe animation made simple for everyone" youtubeId="bHdIvt_lUrE" sectionHeading="Intuitive Timeline Editing" />
        <FeaturesIntro />
        <AllWebEditing />
        <VideoPlaceholder title="All Web Editing" description="Professional editing, right in your browser" gridBackground youtubeId="-zyusYiQNEc" />
        <EasyAnimations />
        <VideoPlaceholder title="Animation Presets" description="Bring your ideas to life effortlessly" gridBackground youtubeId="Rk9hf3QI5Is" />
        <ThreeDSupport />
        <VideoPlaceholder title="3D Support" description="Create stunning 3D motion graphics that captivate your audience" gridBackground />
        <KeyframeInterpolation />
        <VideoPlaceholder title="Keyframe Interpolation" description="Click any curve to preview its shape" gridBackground youtubeId="fkQhKYaSv0Q" />
        <VideoPlaceholder title="Share Projects" description="Collaborate and share your work with anyone, instantly" gridBackground youtubeId="sqdlJULYNZA" sectionHeading="Share Projects" />
        <SplitHero />
        <VideoPlaceholder title="Templates & Presets" description="Start creating instantly with pre-built motion graphics" />
        <CreatorStories />
        <ComparisonTeaser />
        <LoadTime />
        <FeatureHighlights />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
        <AllLinks />
      </main>
    </>
  );
}
