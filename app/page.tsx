import { Hero } from '@/components/sections/Hero';
import { WhatIsFlashFX } from '@/components/sections/WhatIsFlashFX';
import { VideoPlaceholder } from '@/components/sections/VideoPlaceholder';
import { ImageCarousel } from '@/components/sections/ImageCarousel';
import { SolutionSection } from '@/components/sections/SolutionSection';
import { ForEveryone } from '@/components/sections/ForEveryone';
import { SimpleToFullScale } from '@/components/sections/SimpleToFullScale';
import { EditInPlainEnglish } from '@/components/sections/EditInPlainEnglish';
import { OrganizeWorkflow } from '@/components/sections/OrganizeWorkflow';
import { InteractiveCanvas } from '@/components/sections/InteractiveCanvas';
import { FeaturesOpener } from '@/components/sections/FeaturesOpener';
import { FeatureBlock } from '@/components/sections/FeatureBlock';
import { ShapeTools, ClipPlayback, VectorPen } from '@/components/demos/feature-demos';
import { ConvinceOpener } from '@/components/sections/ConvinceOpener';
import { AgentLanes, EditNotGenerate, AskAI, Endless } from '@/components/demos/convince-demos';
import { InspiredFrom } from '@/components/sections/InspiredFrom';import { ParticleGeneration } from '@/components/sections/ParticleGeneration';
import { ProceduralAnimation } from '@/components/sections/ProceduralAnimation';
import { TemplateStart } from '@/components/sections/TemplateStart';
import { AllOnWeb } from '@/components/sections/AllOnWeb';
import { ThreeDSupport } from '@/components/sections/ThreeDSupport';
import { KeyframeInterpolation } from '@/components/sections/KeyframeInterpolation';
import { EverythingToAnimate } from '@/components/sections/EverythingToAnimate';
import { FeatureHighlights } from '@/components/sections/FeatureHighlights';
import { ComparisonTeaser } from '@/components/sections/ComparisonTeaser';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { LoadTime } from '@/components/sections/LoadTime';
import { CreatorStories } from '@/components/sections/CreatorStories';
import { AllLinks } from '@/components/sections/AllLinks';
import { PricingSection } from '@/components/sections/PricingSection';
import { SectionSeam } from '@/components/ui/beam-border';

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
        <SolutionSection />
        {/* Before the plain-English section on purpose: the beginner card
            promises "describe and go", and the next section is that. */}
        <ForEveryone />
        {/* The evidence for the claim the two cards above make, in two
            screenshots of the same editor doing the least and the most. */}
        <SimpleToFullScale />
        {/*
          Directly after the opening video and before the timelines, because the
          order is an argument: here is the editor, here is what it can be told
          to do, and here is the timeline it does it on.
        */}
        <EditInPlainEnglish />
        {/*
          Every one of these was a YouTube embed of someone else's screen. They
          are now live demos of the product (immersionmilestones.md I3) — the
          `youtubeId` stays recorded so reverting any single section is a
          one-word edit.
        */}
        <OrganizeWorkflow />
        {/* First under "Organized workflow": nothing can be cut together until
            something has been brought in. */}
        <VideoPlaceholder id="media-pool" heading="Media pool" title="Media Pool" description="Bring footage, images and audio into one place" demo="mediapool" />
        <VideoPlaceholder id="clip-timeline" heading="Clip timeline" title="Clip Timeline" description="Arrange footage, overlays and audio in one sequence" demo="clips" youtubeId="-zyusYiQNEc" />
        <VideoPlaceholder id="animation-timeline" heading="Animation timeline" title="Animation Timeline" description="Keyframe animation made simple for everyone" demo="timeline" youtubeId="bHdIvt_lUrE" sectionHeading="Animation Timeline" />
        <InteractiveCanvas />

        {/*
          Everything from here to the procedural section is one run under the
          "Features" heading: three new blocks, then the three that already
          existed, unchanged and in the order they were already in.

          The first three carry only their titles. Their details are still to
          come from the owner, and inventing copy for them would breach the rule
          in CLAUDE.md against making up product facts.
        */}
        <FeaturesOpener />
        <FeatureBlock
          id="fast-shapes"
          title="Fast shape creation"
          accent="creation"
          subtitle="Drag one out and it is on the canvas. Every primitive is live from the moment it exists, ready to be animated like anything else."
          list={['Rectangle', 'Circle', 'Star', 'Polygon']}
        >
          <ShapeTools />
        </FeatureBlock>

        <FeatureBlock
          id="audio-video"
          title="Audio and video support"
          accent="support"
          subtitle="Footage and sound sit on the same timeline as your graphics, so what you animate and what you hear stay in step."
          /* Every line lifted from editorFeatures.ts, the site's own published
             description of Video Support and Multi-Track Audio. */
          list={[
            'Import video with GPU-accelerated playback',
            'Trim, offset, transform and filter clips',
            'Unlimited audio tracks with waveform view',
            'Fade in and out, per-clip volume, solo and mute',
          ]}
        >
          <ClipPlayback />
        </FeatureBlock>

        {/* Full width, and no list: the canvas is the argument, and a column of
            bullets beside it would halve the space the curve needs. */}
        <FeatureBlock
          id="vector-tools"
          title="Vector tool support"
          accent="support"
          layout="full"
          subtitle="Place points, pull the handles, and the curve follows. Grab one below and it is yours to bend."
        >
          <VectorPen />
        </FeatureBlock>

        <ThreeDSupport />
        <ParticleGeneration />
        {/* Directly under the particles: both are animation you describe rather
            than draw, from opposite ends. */}
        <ProceduralAnimation />
        {/* Straight after the capability tour: the page has just shown what the
            editor can do, which is exactly when "how would I ever make that"
            needs an answer. */}
        <TemplateStart />
        <AllOnWeb />
        <ImageCarousel />
        <WhatIsFlashFX />
        <EverythingToAnimate />
        <VideoPlaceholder id="animation-presets" heading="Animation presets" title="Animation Presets" description="Bring your ideas to life effortlessly" demo="presets" youtubeId="Rk9hf3QI5Is" />
        <KeyframeInterpolation />
        <CreatorStories />
        {/*
          Seams mark the transitions between the page's acts rather than every
          section boundary — a light on all 26 would be wallpaper. These four
          sit where the subject changes: from the product tour into the money
          conversation, then into proof, features, and the close
          (immersionmilestones.md I2).
        */}
        <SectionSeam />
        <ComparisonTeaser />
        <LoadTime />
        <SectionSeam />
        <FeatureHighlights />
        {/*
          The AI block, immediately before pricing. Everything in it is
          owner-stated and recorded in FIX.md under *Canonical facts* — in
          particular that the AI does not generate video, which is the one claim
          in here that must not drift in a rewrite.
        */}
        <ConvinceOpener />

        <FeatureBlock
          id="multi-agent"
          title="Multi-agent AI editing"
          accent="editing"
          subtitle="Several agents work the same timeline at once, each on its own span, so a long edit is not a queue."
          list={[
            'One agent per stretch of the timeline',
            'Up to six working at the same time',
            'Each one edits its own span independently',
          ]}
        >
          <AgentLanes />
        </FeatureBlock>

        {/* Full width, and the longest section here: it carries the claim the
            whole block is built on. */}
        <FeatureBlock
          id="non-destructive"
          title="Non-destructive AI editing"
          accent="editing"
          subtitle="Other tools generate a video and hand you a file. FlashFX does not generate video at all. The AI uses the editor: it works on your footage, cuts long videos, and builds real animation, and everything it touches stays editable at full scale afterwards. It can call other AI tools when it needs them, but what you get back is a project, not a render."
        >
          <EditNotGenerate />
        </FeatureBlock>

        <FeatureBlock
          id="ai-help"
          title="Need help with the software? AI can help"
          accent="AI can help"
          subtitle="If you would rather do the work yourself, ask. Say what you are trying to do and it explains where to go and what to change."
          list={[
            'Ask how to do something and get the steps',
            'Answers point at the panel you need',
            'Or follow along on YouTube instead',
          ]}
        >
          <AskAI />
        </FeatureBlock>

        <InspiredFrom />

        <FeatureBlock
          id="endless"
          title="The possibilities are endless"
          accent="endless"
          subtitle="Official FlashFX plugins, plus plugins built by the people using it. Community ones are reviewed before they ship, so submissions are not open to everyone yet. Templates and presets work the same way: what ships is a starting point, not the ceiling."
        >
          <Endless />
        </FeatureBlock>

        <SectionSeam />
        <PricingSection />
        <FAQSection />
        <SectionSeam />
        <FinalCTA />
        <AllLinks />
      </main>
    </>
  );
}
