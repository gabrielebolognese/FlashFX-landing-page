'use client';


import Image from 'next/image';
import { useRef, useCallback, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CtaButton } from '@/components/ui/cta-button';
import { EDITOR_URL } from '@/lib/editor';

import { editorFeatures, FeatureItem } from './feature-highlights/editorFeatures';
import { animationPresets, AnimationPresetItem } from './feature-highlights/animationPresets';
import { editableProperties, PropertyItem } from './feature-highlights/editableProperties';

type CardItem = FeatureItem | AnimationPresetItem | PropertyItem;

function FeatureCard({ item, showCategory }: { item: CardItem; showCategory?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const { Icon } = item as { Icon: LucideIcon };
  const category = 'category' in item ? (item as AnimationPresetItem).category : undefined;

  /*
   * The spotlight follow, coalesced into one write per frame
   * (immersionmilestones.md I6).
   *
   * This used to assign a freshly built `radial-gradient(...)` string to
   * `style.background` straight out of the mousemove handler. Two problems, and
   * they compound:
   *
   *   `mousemove` fires far more often than the screen refreshes — a 1000 Hz
   *   mouse delivers roughly sixteen events per frame — so fifteen out of every
   *   sixteen writes were painted over before anyone saw them.
   *
   *   Each one re-parsed a gradient and invalidated the paint of a card in a
   *   176-card grid — at the time, one sitting behind a `backdrop-filter:
   *   blur(16px)`, which made repainting it about as expensive as a repaint
   *   gets. That blur is gone now, but the coalescing is still what keeps this
   *   handler honest.
   *
   * Now the handler only records the position; a single `requestAnimationFrame`
   * writes two custom properties, and the gradient itself is declared once in
   * `.fx-spotlight`. The visible behaviour is identical.
   */
  const pending = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  const flush = useCallback(() => {
    frame.current = 0;
    const spotlight = spotlightRef.current;
    const point = pending.current;
    if (!spotlight || !point) return;
    spotlight.style.setProperty('--fx-sx', `${point.x}%`);
    spotlight.style.setProperty('--fx-sy', `${point.y}%`);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      pending.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  const handleMouseEnter = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.dataset.on = '1';
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(-5px)';
      iconRef.current.style.filter = 'drop-shadow(0 8px 16px rgba(245, 197, 24, 0.4))';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Drop any frame still queued, so it cannot repaint the spotlight after the
    // pointer has already left.
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    if (spotlightRef.current) spotlightRef.current.dataset.on = '0';
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(0px)';
      iconRef.current.style.filter = 'none';
    }
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div className="fx-feature-card h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full rounded-2xl overflow-hidden cursor-default"
        /*
          No `backdrop-filter` (2026-08-07). It was `blur(16px)` on all 176.
          Behind an opaque section that was merely wasteful — the backdrop never
          changed, so the blur was computed once and cached. Now that the shader
          field shows through this section, the backdrop changes every frame,
          which would force every visible card to re-blur every frame. A
          backdrop-filtered layer over moving content is about the most
          expensive thing a compositor can be asked to maintain.

          The fill went 0.72 → 0.88 to compensate: enough that the card reads as
          a solid surface, translucent enough that the field still tints it.
        */
        style={{
          background: 'rgba(20, 31, 64, 0.88)',
          border: '1px solid rgba(230, 237, 243, 0.1)',
          borderTopColor: 'rgba(230, 237, 243, 0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(230,237,243,0.06) inset',
        }}
      >
        {/* No BeamBorder. 176 of them was 176 extra elements and a hover
            listener each, for a border sweep nobody goes looking for. */}

        <div
          ref={spotlightRef}
          data-on="0"
          className="fx-spotlight absolute inset-0 pointer-events-none z-10"
          style={{ borderRadius: 'inherit' }}
        />

        <div className="relative z-20 p-5 h-full flex flex-col">
          {showCategory && category && (
            <span
              className="text-xs font-medium mb-3 tracking-wider uppercase"
              style={{ color: 'rgba(245, 197, 24, 0.5)', fontFamily: 'var(--font-outfit)' }}
            >
              {category}
            </span>
          )}
          <div
            ref={iconRef}
            className="mb-3 w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.16) 0%, rgba(245, 197, 24, 0.05) 100%)',
              border: '1px solid rgba(245, 197, 24, 0.22)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
            }}
          >
            <Icon className="w-4 h-4 text-fx-accent-yellow" strokeWidth={1.5} />
          </div>

          <h3
            className="text-sm font-normal text-fx-text-primary mb-1.5"
            style={{ fontFamily: 'var(--font-outfit)', fontWeight: 400 }}
          >
            {item.title}
          </h3>
          <p className="text-fx-text-secondary text-xs leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  subtitle,
  items,
  showCategory,
}: {
  title: string;
  subtitle: string;
  items: CardItem[];
  showCategory?: boolean;
}) {
  return (
    <div className="mb-20">
      <div className="mb-8">
        <h3
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600 }}
        >
          {title}
        </h3>
        <p className="text-fx-text-secondary text-sm">{subtitle}</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <FeatureCard key={item.title} item={item} showCategory={showCategory} />
        ))}
      </div>
    </div>
  );
}

export function FeatureHighlights() {
  return (
    /*
      No background of its own (2026-08-07). It used to paint an opaque
      `bg-fx-bg-base`, a 40px rule grid over that, and a gradient over both —
      the old look, and three full-section layers the compositor had to carry.
      The grid is gone and the section is transparent, so the field of light
      from `SiteBackdrop` runs through it like the rest of the page
      (immersionmilestones.md I4).

      The iceberg below still needs solid ground: its top and bottom fades are
      hand-matched to #141f40 and would show a hard seam against a shader. It
      keeps that ground, with a lead-in gradient above it that takes the page
      from the field into the solid colour.
    */
    <section className="relative w-full pt-24">
      <div className="relative z-[10] max-w-screen-2xl mx-auto px-6">
        <h2
          className="section-heading font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-20"
          style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#f5c842' }}>Everything</span>
          <span className="text-white"> FlashFX can do</span>
        </h2>

        <CategorySection
          title="Editor Features"
          subtitle="The full suite of tools built into the FlashFX editor"
          items={editorFeatures}
        />

        <CategorySection
          title="Editable Properties"
          subtitle="Every visual property you can control and animate on any element"
          items={editableProperties}
        />

        <CategorySection
          title="Animation Presets"
          subtitle="Ready-to-use preset animations for elements and text"
          items={animationPresets}
          showCategory
        />
      </div>

      {/* Field of light into solid ground, so the iceberg's fades have the
          colour they were matched against. */}
      <div
        className="w-full h-24 md:h-32"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #141f40 100%)' }}
      />

      {/*
        Was a raw <img>, which meant no lazy loading and no intrinsic sizing.
        next/image gives both. It sits far below the fold, so it is explicitly
        not `priority` — see performancemilestones.md P3.
      */}
      {/*
        The iceberg: everything above is the tip, and the picture is the rest of
        it. It has to look like part of the page rather than a photograph pasted
        onto one.

        Sized by its own aspect ratio rather than a fixed 140vh. At 140vh with
        `object-cover` the bottom was cropped by about 185px on a desktop — and
        far worse on a phone, where a 375px-wide viewport made the container
        nearly five times taller than the image's proportions, so it filled the
        height and cropped almost all the width away. `h-auto` shows the whole
        thing at every width and pushes what follows down, which is the point.

        Both edges are near-black (#040c13 top, #000107 bottom) against a
        #141f40 page, so both are faded into the background rather than meeting
        it as a seam. The bottom fade is the deep one, and the line sits inside
        it.
      */}
      <div className="relative w-full" style={{ lineHeight: 0, background: '#141f40' }}>
        <Image
          src="/fix-copy.webp"
          alt="An iceberg, most of it below the surface"
          width={1600}
          height={1414}
          sizes="100vw"
          className="w-full h-auto select-none"
        />

        <div
          className="absolute inset-x-0 top-0 h-[12%] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #141f40 0%, rgba(20,31,64,0.55) 45%, transparent 100%)' }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(20,31,64,0.45) 38%, rgba(20,31,64,0.88) 70%, #141f40 92%)',
          }}
        />

        {/*
          The caption is the button. It was yellow text sitting on the picture;
          it is now a filled call to action at exactly the same
          `clamp(2.5rem, 5vw, 5rem)`, which is what `xl` exists for — every
          measurement in that size is in `em`, so the padding, the gap and the
          arrow all scale off this one font size rather than being guessed.

          No `textShadow` any more: `.fx-cta` brings its own glow, and the two
          layered on each other read as a smudge.
        */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[6%]">
          <CtaButton
            href={EDITOR_URL}
            size="xl"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
          >
            And so much more
          </CtaButton>
        </div>
      </div>

      <div
        className="relative w-full text-center"
        style={{
          background: '#141f40',
          paddingBottom: '7rem',
        }}
      >

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {[
            'Like the 300+ 3D features',
            '110 image effect filters',
            'Team collaboration features',
            'Not to mention all marketplace templates',
            'And all AI features',
          ].map((item) => (
            <li
              key={item}
              style={{
                color: 'rgba(230, 237, 243, 0.55)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#f5c842', fontSize: '0.6em', opacity: 0.7 }}>: </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
