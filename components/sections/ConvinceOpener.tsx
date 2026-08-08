'use client';

import { motion } from 'framer-motion';

/*
 * The "Not convinced yet?" title, opening the AI block.
 *
 * A divider like `FeaturesOpener`, and built from the same shape on purpose: two
 * runs of related sections on one page should announce themselves the same way,
 * or the second one reads as a different kind of thing.
 *
 * What follows is multi-agent editing, non-destructive editing, AI as a guide,
 * what it was inspired by, and plugins. Then pricing.
 */
export function ConvinceOpener() {
  return (
    <section id="not-convinced" className="relative w-full pt-24 md:pt-32 pb-4 md:pb-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          Not convinced <span style={{ color: '#f5c842' }}>yet?</span>
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
          Then let us talk about the AI
        </motion.p>
      </div>
    </section>
  );
}
