'use client';

import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAmbient, loop } from '@/lib/motion';


/*
 * Thirteen screenshots of the editor with an animation part-built, supplied by
 * the owner 2026-08-08 and replacing the nine that were here.
 *
 * ── The filenames are the point ─────────────────────────────────────────────
 *
 * They arrived as "Screenshot 2026-08-08 190030.png", which tells a crawler
 * nothing and tells an image search less. Each is now named for what it
 * actually shows, read off the editor UI in the picture itself, and the alt
 * text says what is being made rather than repeating the product name nine
 * times the way the old set did ("Stunning Visuals", "Easy to Use Interface").
 *
 * ── And the weight ─────────────────────────────────────────────────────────
 *
 * 3.4 MB of PNG became 493 kB of WebP at 1200px, 86% less. Four of the
 * originals were over the 220 kB per-asset budget and would have failed the
 * build. Re-export at 1200px if any is ever replaced.
 */
const images = [
  {
    src: '/lookslike/flashfx-departure-board-animation.webp',
    alt: 'An airport departure board animation being built in FlashFX, its split-flap letters keyframed across 234 timeline tracks',
  },
  {
    src: '/lookslike/flashfx-bar-chart-race-animation.webp',
    alt: 'A bar chart race of programming languages animating in FlashFX, with per-digit counters rolling on 220 tracks',
  },
  {
    src: '/lookslike/flashfx-forest-scene-animation.webp',
    alt: 'A layered forest scene in FlashFX, trees swaying on their own keyframed tracks',
  },
  {
    src: '/lookslike/flashfx-sunset-scene-animation.webp',
    alt: 'A sunset scene in FlashFX, the sun sinking into the sea under banded gradient skies',
  },
  {
    src: '/lookslike/flashfx-hypno-spiral-pattern.webp',
    alt: 'A hypnotic spiral pattern generated in FlashFX, with the pattern presets and parameters open',
  },
  {
    src: '/lookslike/flashfx-ripple-rings-pattern.webp',
    alt: 'Concentric ripple rings generated in FlashFX, with scale, warp, contrast and speed controls',
  },
  {
    src: '/lookslike/flashfx-galaxy-scene-animation.webp',
    alt: 'A galaxy scene in FlashFX, planets orbiting a glowing core over a starfield',
  },
  {
    src: '/lookslike/flashfx-cell-field-pattern.webp',
    alt: 'A cell field pattern in FlashFX, warm Voronoi shapes animating over a loading title',
  },
  {
    src: '/lookslike/flashfx-fireworks-animation.webp',
    alt: 'A fireworks animation in FlashFX, sparks bursting across a night sky on 75 tracks',
  },
  {
    src: '/lookslike/flashfx-neon-plasma-pattern.webp',
    alt: 'A neon plasma pattern in FlashFX, glowing cells drifting across the canvas',
  },
  {
    src: '/lookslike/flashfx-bar-chart-expressions.webp',
    alt: 'A quarterly bar chart in FlashFX with the expressions panel open, driving position with a wiggle expression',
  },
  {
    src: '/lookslike/flashfx-chain-reaction-animation.webp',
    alt: 'A chain reaction animation in FlashFX: dominoes into a marble, a lever, a bucket and 200 balls through a funnel',
  },
  {
    src: '/lookslike/flashfx-galaxy-334-track-timeline.webp',
    alt: 'A long galaxy animation in FlashFX zoomed out to show all 334 timeline tracks at once',
  },
];

// Duplicate images for seamless loop
const duplicatedImages = [...images, ...images, ...images];

export function ImageCarousel() {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimationControls();

  /*
   * The marquee used to run whenever the visitor was neither dragging nor
   * hovering — which includes the entire time this section is nowhere near the
   * viewport. It was the only continuously running animation in content on the
   * site, and it ran for the whole session (immersionmilestones.md I1).
   *
   * `constraintsRef` and the ambient ref are the same element, so the drag
   * bounds are unchanged.
   */
  const { ref: constraintsRef, active } = useAmbient<HTMLDivElement>();

  const imageWidth = 490; // 700 * 0.7 = 490px (30% smaller)
  const gap = 24; // 6 * 4 = 24px
  const totalWidth = (imageWidth + gap) * images.length;

  useEffect(() => {
    if (active && !isDragging && !isHovering) {
      controls.start({
        x: -totalWidth,
        transition: {
          duration: loop.crawl,
          ease: 'linear',
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [active, isDragging, isHovering, controls, totalWidth]);

  return (
    <section className="relative w-full py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-center mb-4"
          style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#f5c842' }}>See</span><span className="text-white"> what it looks like</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-fx-text-secondary text-center text-lg"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          Drag to explore real projects created with FlashFX
        </motion.p>
      </div>

      <div
        ref={constraintsRef}
        className="relative z-10 w-full h-[350px] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -totalWidth * 2, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={controls}
          className="flex gap-6 absolute left-0"
          style={{ paddingLeft: '10%' }}
        >
          {duplicatedImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % images.length) * 0.05 }}
              className="relative flex-shrink-0 w-[490px] h-[350px] rounded-lg overflow-hidden shadow-2xl border border-fx-border"
              whileHover={!isDragging ? { scale: 1.05 } : {}}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover pointer-events-none"
                draggable={false}
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <p className="text-fx-accent-yellow text-sm font-medium" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-8 text-center">
        <p className="text-fx-text-secondary text-sm" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          ← Drag to explore more →
        </p>
      </div>
    </section>
  );
}
