'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
 *
 * ── The heights are real ───────────────────────────────────────────────────
 *
 * Every one is 1200 wide but they run from 606 to 616 tall, so each carries its
 * own. The strip crops them to a fixed card with `object-cover` and would not
 * care, but the expanded view sizes itself from these numbers, and one shared
 * height would stretch most of the set by a percent or two.
 */
const images = [
  {
    src: '/lookslike/flashfx-departure-board-animation.webp',
    h: 612,
    alt: 'An airport departure board animation being built in FlashFX, its split-flap letters keyframed across 234 timeline tracks',
  },
  {
    src: '/lookslike/flashfx-bar-chart-race-animation.webp',
    h: 613,
    alt: 'A bar chart race of programming languages animating in FlashFX, with per-digit counters rolling on 220 tracks',
  },
  {
    src: '/lookslike/flashfx-forest-scene-animation.webp',
    h: 613,
    alt: 'A layered forest scene in FlashFX, trees swaying on their own keyframed tracks',
  },
  {
    src: '/lookslike/flashfx-sunset-scene-animation.webp',
    h: 607,
    alt: 'A sunset scene in FlashFX, the sun sinking into the sea under banded gradient skies',
  },
  {
    src: '/lookslike/flashfx-hypno-spiral-pattern.webp',
    h: 607,
    alt: 'A hypnotic spiral pattern generated in FlashFX, with the pattern presets and parameters open',
  },
  {
    src: '/lookslike/flashfx-ripple-rings-pattern.webp',
    h: 610,
    alt: 'Concentric ripple rings generated in FlashFX, with scale, warp, contrast and speed controls',
  },
  {
    src: '/lookslike/flashfx-galaxy-scene-animation.webp',
    h: 613,
    alt: 'A galaxy scene in FlashFX, planets orbiting a glowing core over a starfield',
  },
  {
    src: '/lookslike/flashfx-cell-field-pattern.webp',
    h: 609,
    alt: 'A cell field pattern in FlashFX, warm Voronoi shapes animating over a loading title',
  },
  {
    src: '/lookslike/flashfx-fireworks-animation.webp',
    h: 606,
    alt: 'A fireworks animation in FlashFX, sparks bursting across a night sky on 75 tracks',
  },
  {
    src: '/lookslike/flashfx-neon-plasma-pattern.webp',
    h: 611,
    alt: 'A neon plasma pattern in FlashFX, glowing cells drifting across the canvas',
  },
  {
    src: '/lookslike/flashfx-bar-chart-expressions.webp',
    h: 612,
    alt: 'A quarterly bar chart in FlashFX with the expressions panel open, driving position with a wiggle expression',
  },
  {
    src: '/lookslike/flashfx-chain-reaction-animation.webp',
    h: 614,
    alt: 'A chain reaction animation in FlashFX: dominoes into a marble, a lever, a bucket and 200 balls through a funnel',
  },
  {
    src: '/lookslike/flashfx-galaxy-334-track-timeline.webp',
    h: 616,
    alt: 'A long galaxy animation in FlashFX zoomed out to show all 334 timeline tracks at once',
  },
];

// Duplicate images for seamless loop
const duplicatedImages = [...images, ...images, ...images];

export function ImageCarousel() {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  /** Which screenshot is expanded, as an index into `images`. */
  const [open, setOpen] = useState<number | null>(null);
  const controls = useAnimationControls();

  /*
   * A drag ends with a click event on whichever card was under the pointer, so
   * without this every attempt to fling the strip would also open a picture.
   * framer only fires `onDragStart` once its own threshold is crossed, which
   * makes it exactly the signal for "that was a drag, not a tap".
   */
  const draggedRef = useRef(false);

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
    // The strip also holds still while a picture is expanded: it is behind the
    // overlay, and scrolling it there is work nobody can see.
    if (active && !isDragging && !isHovering && open === null) {
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
  }, [active, isDragging, isHovering, open, controls, totalWidth]);

  /** Both directions wrap, so the expanded view has no ends. */
  const step = useCallback((delta: number) => {
    setOpen((current) => (current === null ? current : (current + delta + images.length) % images.length));
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  const shown = open === null ? null : images[open];

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
          Drag to explore real projects created with FlashFX, and click any one to open it
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
          onPointerDownCapture={() => {
            draggedRef.current = false;
          }}
          onDragStart={() => {
            setIsDragging(true);
            draggedRef.current = true;
          }}
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
              className="group relative flex-shrink-0 w-[490px] h-[350px] rounded-lg overflow-hidden shadow-2xl border border-fx-border cursor-zoom-in"
              whileHover={!isDragging ? { scale: 1.05 } : {}}
              onClick={() => {
                if (draggedRef.current) return;
                setOpen(index % images.length);
              }}
              role="button"
              tabIndex={0}
              aria-label={`Expand: ${image.alt}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(index % images.length);
                }
              }}
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

      <AnimatePresence>
        {shown && open !== null && (
          /*
           * Click the backdrop or the picture to dismiss, the same as the
           * lightbox in `SimpleToFullScale`: no close button to find and no edge
           * to miss. The arrows are the exception and stop the click, since a
           * control that closed the thing it navigates would be useless.
           */
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
            style={{ background: 'rgba(6, 9, 24, 0.92)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={shown.alt}
          >
            {/*
              `items-stretch` is what makes the arrows the height of the
              picture. The row takes its height from the image, which is the only
              item with an intrinsic size, and the two buttons stretch to match
              it — so they stay exactly as tall as whatever is on screen without
              anything measuring anything.
            */}
            <div className="flex items-stretch gap-2 sm:gap-4">
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="flex-shrink-0 w-11 sm:w-16 flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] hover:bg-fx-accent-yellow/15 hover:border-fx-accent-yellow/50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
              </button>

              <motion.div
                // Keyed on the index, so stepping cross-fades to the next
                // picture rather than swapping the source underneath a static
                // element.
                key={open}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center"
              >
                {/*
                  Bounded on both axes with the ratio kept. Capping width alone
                  overflows a short window and capping height alone overflows a
                  narrow one; `w-auto h-auto` against both maxima lets whichever
                  runs out first decide the size.
                */}
                <Image
                  src={shown.src}
                  alt={shown.alt}
                  width={1200}
                  height={shown.h}
                  sizes="90vw"
                  className="w-auto h-auto max-w-[74vw] max-h-[80vh] rounded-lg shadow-2xl"
                  priority
                />
              </motion.div>

              <button
                type="button"
                aria-label="Next screenshot"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="flex-shrink-0 w-11 sm:w-16 flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] hover:bg-fx-accent-yellow/15 hover:border-fx-accent-yellow/50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
              </button>
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 px-4 text-center">
              <span className="font-mono text-[11px] uppercase tracking-widest text-fx-accent-yellow/80">
                {open + 1} / {images.length}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                arrows to browse &nbsp;·&nbsp; click anywhere to close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
