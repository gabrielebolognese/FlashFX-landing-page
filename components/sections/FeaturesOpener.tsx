'use client';

import { motion } from 'framer-motion';

/*
 * The "Features" title, opening the block that runs from here to the procedural
 * section.
 *
 * It is a divider rather than a section: what follows it is Fast shape creation,
 * Audio and video support, Vector tool support, 3D, Particles and Procedural, in
 * that order. Everything under this heading is one argument, and the heading is
 * what tells a visitor that a run of related sections has started.
 *
 * Not to be confused with `FeatureHighlights` further down the page, which is
 * the 176-card "Everything FlashFX can do" grid. This one opens the tour; that
 * one is the index.
 */
export function FeaturesOpener() {
  return (
    <section id="features" className="relative w-full pt-24 md:pt-32 pb-4 md:pb-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-xl sm:text-2xl md:text-3xl leading-snug"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#f5c842',
          }}
        >
          Creative freedom
        </motion.p>
      </div>
    </section>
  );
}
