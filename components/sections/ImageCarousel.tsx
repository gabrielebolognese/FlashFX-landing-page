'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAmbient, loop } from '@/lib/motion';
import { GALLERY, GALLERY_ROWS, GALLERY_WIDTH, gallerySrc, type GalleryImage } from '@/lib/gallery';

/*
 * Thirty-eight screenshots of the editor, in three rows that pass each other.
 *
 * ── Three rows, and why they run opposite ways ──────────────────────────────
 *
 * One row of thirty-eight is a very long belt: at any moment a visitor sees
 * three of them and the rest is a rumour. Three rows show nine at once and
 * finish the loop in a third of the time.
 *
 * The middle row runs against the other two. Three belts drifting the same way
 * read as one wide object sliding sideways, and the eye stops seeing individual
 * pictures. Opposed, each row reads as its own thing, and the crossing motion
 * is what makes the section feel alive rather than merely animated.
 *
 * ── The rows are dealt, not sliced ──────────────────────────────────────────
 *
 * `GALLERY_ROWS` takes every third image rather than a contiguous third, so the
 * subject groups in the source list spread across all three rows. See the note
 * in `lib/gallery.ts`.
 *
 * ── What the duplicates are for, and why they are silent ────────────────────
 *
 * Each row's contents are repeated three times so the belt can loop without a
 * seam. Only the first copy carries `alt` text; copies two and three are
 * `alt=""` and `aria-hidden`, because thirty-eight descriptions repeated three
 * times is 114 identical alt strings on one page — noise to a screen reader and
 * nothing a crawler wants either. The picture is the same; the description
 * should be said once.
 *
 * ── Where the descriptions come from ────────────────────────────────────────
 *
 * `lib/gallery-images.json`, which also feeds the `ImageGallery` schema on the
 * homepage and the image sitemap. Three signals from one source, so an alt and
 * its caption cannot contradict each other.
 */

/*
 * Card size.
 *
 * This was a flat `CARD_W = 420`, which is wider than the phone it was being
 * asked to fit on: 117% of a 360px screen, 108% of a 390px one. A single card
 * could never sit inside the viewport, so the row read as one permanently
 * clipped picture rather than as a gallery.
 *
 * It is a `clamp` now — 78vw on a phone, so one card sits in view with a sliver
 * of the next one showing that the row continues, and still 420px from tablet
 * width up. The ratio is the screenshots' own, 1200 x ~612.
 *
 * These are CSS strings rather than numbers on purpose. A number would have to
 * be recomputed in JavaScript on every resize and kept in step with the style
 * that consumes it; CSS resolves the width itself, and `MarqueeRow` measures
 * what CSS decided instead of predicting it.
 */
const CARD_W = 'clamp(240px, 78vw, 420px)';
const CARD_RATIO = 1200 / 612;
const CARD_H = `calc(${CARD_W} / ${CARD_RATIO})`;
const GAP = 'clamp(10px, 2.5vw, 20px)';

/** How many times each row's contents repeat to close the loop. */
const COPIES = 3;

export function ImageCarousel() {
  /** Index into the flat `GALLERY`, so the expanded view walks all 38. */
  const [open, setOpen] = useState<number | null>(null);
  const { ref: hostRef, active } = useAmbient<HTMLDivElement>();

  /** Both directions wrap, so the expanded view has no ends. */
  const step = useCallback((delta: number) => {
    setOpen((current) => (current === null ? current : (current + delta + GALLERY.length) % GALLERY.length));
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

  const shown = open === null ? null : GALLERY[open];

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
          Real projects built in FlashFX. Drag a row to explore, or click any one to open it.
        </motion.p>
      </div>

      <div ref={hostRef} className="relative z-10 w-full flex flex-col gap-5">
        {GALLERY_ROWS.map((row, i) => (
          <MarqueeRow
            key={i}
            images={row}
            // The middle row against the other two.
            reverse={i === 1}
            active={active && open === null}
            onOpen={(image) => setOpen(GALLERY.indexOf(image))}
          />
        ))}
      </div>

      <AnimatePresence>
        {shown && open !== null && (
          /*
           * Click the backdrop or the picture to dismiss, the same as the
           * lightbox in `SimpleToFullScale`. The arrows stop the click, since a
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
              picture. The row takes its height from the image, the only item
              with an intrinsic size, and the buttons stretch to match — so they
              track whatever is on screen without anything measuring anything.
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
                // Keyed on the index, so stepping cross-fades rather than
                // swapping the source under a static element.
                key={open}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <Image
                  src={gallerySrc(shown)}
                  alt={shown.alt}
                  width={GALLERY_WIDTH}
                  height={shown.h}
                  sizes="90vw"
                  /*
                   * 58vw on a phone, not 74. The expanded view is a row of
                   * image-plus-two-arrows, and at 390px the arrows and their
                   * gaps take 104px of the 366px left inside the padding — a
                   * 74vw image is 289px, so the row came to 393px and pushed
                   * its own arrows off the screen. 58vw is 226px and fits.
                   *
                   * `dvh` rather than `vh` for the same reason as everywhere
                   * else: `vh` is measured against the viewport with the address
                   * bar hidden, so a `vh`-capped image runs under the chrome.
                   */
                  className="w-auto h-auto max-w-[58vw] sm:max-w-[74vw] max-h-[68dvh] rounded-lg shadow-2xl"
                  priority
                />
                {/* The description, visible rather than only in the alt. It is
                    the same string, so the page and the crawler agree. */}
                <p className="max-w-[58vw] sm:max-w-[74vw] text-center text-sm text-fx-text-secondary px-2">
                  {shown.alt}
                </p>
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

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 px-4 text-center">
              <span className="font-mono text-[11px] uppercase tracking-widest text-fx-accent-yellow/80">
                {open + 1} / {GALLERY.length}
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

function MarqueeRow({
  images,
  reverse,
  active,
  onOpen,
}: {
  images: GalleryImage[];
  reverse: boolean;
  active: boolean;
  onOpen: (image: GalleryImage) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimationControls();
  const constraints = useRef<HTMLDivElement>(null);

  /*
   * A drag ends with a click event on whichever card was under the pointer, so
   * without this every attempt to fling a row would also open a picture. framer
   * only fires `onDragStart` once its own threshold is crossed, which makes it
   * exactly the signal for "that was a drag, not a tap".
   */
  const dragged = useRef(false);
  const strip = useRef<HTMLDivElement>(null);
  /** Whether the reversed row has been placed at its start yet. */
  const placed = useRef(false);

  /*
   * Measured, not computed.
   *
   * The loop distance has to be exactly one copy of the contents or the seam
   * shows. While the card was a fixed 420 that could be arithmetic, but the
   * width is a `clamp` now and only the browser knows what it resolved to — so
   * the strip reports its own width and the animation follows. `ResizeObserver`
   * covers the two ways it changes: the viewport resizing, and the images
   * loading in at their real size.
   */
  const [span, setSpan] = useState(0);

  useEffect(() => {
    const node = strip.current;
    if (!node) return;
    const measure = () => setSpan(node.scrollWidth / COPIES);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Nothing can start before the strip has a width; a zero span would animate
    // to the position it is already in and the row would sit still.
    if (!span) return;

    /*
     * The reversed row travels from -span up to 0, so it has to be sitting at
     * -span before it starts. That used to be an `initial` prop, which cannot
     * work now that the distance is measured rather than known at first render.
     * Placed once, by ref rather than on every dependency change: re-running it
     * on a hover would yank the row back mid-travel.
     */
    if (reverse && !placed.current) {
      controls.set({ x: -span });
      placed.current = true;
    }

    if (active && !isDragging && !isHovering) {
      /*
       * A single target with `repeat`, not a keyframe array. framer restarts a
       * repeat from wherever the value was when the animation began, so after a
       * drag the belt carries on from where it was let go instead of snapping
       * back to the start of a keyframe list.
       *
       * The reversed row sits at -span and animates towards 0; the others start
       * at 0 and animate towards -span. Three copies of the contents mean both
       * are inside the seamless zone the whole time.
       */
      controls.start({
        x: reverse ? 0 : -span,
        transition: { duration: loop.crawl, ease: 'linear', repeat: Infinity },
      });
    } else {
      controls.stop();
    }
  }, [active, isDragging, isHovering, controls, span, reverse]);

  return (
    <div
      ref={constraints}
      className="relative w-full cursor-grab active:cursor-grabbing"
      style={{ height: CARD_H }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        ref={strip}
        drag="x"
        dragConstraints={{ left: -span, right: 0 }}
        dragElastic={0.1}
        onPointerDownCapture={() => {
          dragged.current = false;
        }}
        onDragStart={() => {
          setIsDragging(true);
          dragged.current = true;
        }}
        onDragEnd={() => setIsDragging(false)}
        animate={controls}
        className="flex absolute left-0 top-0"
        style={{ gap: GAP }}
      >
        {Array.from({ length: COPIES }, (_, copy) => copy).map((copy) =>
          images.map((image, index) => (
            <motion.div
              key={`${copy}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 8) * 0.04 }}
              className="group relative flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border border-fx-border cursor-zoom-in"
              style={{ width: CARD_W, height: CARD_H }}
              whileHover={!isDragging ? { scale: 1.04 } : {}}
              onClick={() => {
                if (dragged.current) return;
                onOpen(image);
              }}
              role={copy === 0 ? 'button' : undefined}
              tabIndex={copy === 0 ? 0 : -1}
              aria-hidden={copy === 0 ? undefined : true}
              aria-label={copy === 0 ? `Expand: ${image.alt}` : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen(image);
                }
              }}
            >
              <Image
                src={gallerySrc(image)}
                // Said once. The two extra copies exist to close the loop, and
                // repeating the description three times helps nobody.
                alt={copy === 0 ? image.alt : ''}
                fill
                // Matches the clamp above, so a phone is not handed the
                // 420px-wide candidate for a 300px slot.
                sizes="(max-width: 538px) 78vw, 420px"
                className="object-cover pointer-events-none"
                draggable={false}
                quality={88}
              />
              {/* Only on hover: at this card size a permanent caption would
                  cover a third of the screenshot it is describing. */}
              <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base/95 via-fx-bg-base/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <p
                className="absolute bottom-0 left-0 right-0 p-3 text-fx-accent-yellow text-xs leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                {image.alt}
              </p>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
