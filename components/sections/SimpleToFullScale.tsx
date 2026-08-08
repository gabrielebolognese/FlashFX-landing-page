'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/*
 * "From simple designs" / "To full scale animations".
 *
 * Two screenshots of the same editor, doing the least and the most it can. The
 * beginner shot is a clock with one fill layer; the expert shot is 334 timeline
 * tracks at frame 71 of 1814. The pair makes the argument on its own, which is
 * why the section is two labels and two pictures and nothing else.
 *
 * Sits under the beginner/expert cards, which say the same thing in words. This
 * is the evidence for the claim they make.
 *
 * ── The screenshots ─────────────────────────────────────────────────────────
 *
 * Unlike the template cards, these keep their native 1875px width: they expand
 * to 90% of the viewport, so there is nothing to gain by shrinking them and
 * detail to lose. WebP at quality 85 puts both well inside the 220 kB asset
 * budget that the PNGs broke -- 464 kB down to 192 kB for the pair.
 */

const SHOTS = [
  {
    label: 'From simple designs',
    src: '/beginnermode.webp',
    alt: 'The FlashFX editor with a simple animated clock on the canvas and the icon library open',
    width: 1874,
    height: 959,
  },
  {
    label: 'To full scale animations',
    src: '/expertmode.webp',
    alt: 'The FlashFX editor running a 334-track timeline with dense keyframes across every layer',
    width: 1875,
    height: 953,
  },
] as const;

type Shot = (typeof SHOTS)[number];

export function SimpleToFullScale() {
  const [open, setOpen] = useState<Shot | null>(null);
  const close = useCallback(() => setOpen(null), []);

  /*
   * While the overlay is up the page behind it must not scroll, or dismissing it
   * leaves you somewhere you did not choose to be. The padding compensates for
   * the scrollbar that `overflow: hidden` removes; without it the whole page
   * jumps sideways the moment an image is opened, which reads as a bug in the
   * page rather than as a lightbox opening.
   */
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <section id="simple-to-full-scale" className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 mx-auto px-4 sm:px-6" style={{ maxWidth: 1344 }}>
        {SHOTS.map((shot, i) => (
          <div key={shot.src} className={i === 0 ? '' : 'mt-16 md:mt-24'}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] mb-8 md:mb-10"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                color: i === 0 ? '#ffffff' : '#f5c842',
              }}
            >
              {shot.label}
            </motion.h2>

            <motion.button
              type="button"
              onClick={() => setOpen(shot)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              // `fx-template` is the same lift-and-glow the template cards use.
              // One hover treatment for every clickable picture on the page.
              className="fx-template block w-full rounded-2xl overflow-hidden border border-fx-border cursor-zoom-in"
              aria-label={`${shot.label}. Open larger`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(min-width: 1024px) 92vw, 96vw"
                className="w-full h-auto"
                // The second one is well below the fold on any screen; the first
                // is too on all but the tallest.
                loading="lazy"
              />
            </motion.button>
          </div>
        ))}

        {/*
          The hand-off into "Edit in plain English", which is the next section.
          It belongs here rather than on that section's own heading because it
          answers the picture directly above it: the expert shot is 334 tracks of
          hand-placed keyframes, and this is the sentence that says you do not
          have to place them.
        */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 md:mt-20 text-center text-2xl sm:text-3xl md:text-4xl leading-snug text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '-0.025em' }}
        >
          But don&rsquo;t worry, you don&rsquo;t have to do all this manually, because you can&hellip;
        </motion.p>
      </div>

      <AnimatePresence>
        {open && (
          /*
           * Click anywhere to dismiss -- the backdrop and the picture share one
           * handler, so there is no dead zone where a click does nothing. That
           * is the whole interaction: no close button to find, no edge to miss.
           */
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
            style={{ background: 'rgba(6, 9, 24, 0.92)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={open.label}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {/*
                90% of the viewport on both axes, with the ratio kept. Capping
                width alone would overflow a short window and capping height
                alone would overflow a narrow one; `w-auto h-auto` against both
                maxima lets whichever runs out first decide the size.
              */}
              <Image
                src={open.src}
                alt={open.alt}
                width={open.width}
                height={open.height}
                sizes="90vw"
                className="w-auto h-auto max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
                priority
              />
            </motion.div>

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-widest text-white/45">
              click anywhere to close
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
