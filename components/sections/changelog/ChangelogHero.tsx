'use client';

import { motion } from 'framer-motion';

export function ChangelogHero() {
  return (
    <section className="relative w-full px-6 pt-16 pb-10 md:pt-20 md:pb-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Changelog</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">What&rsquo;s </span>
            <span style={{ color: '#f5c842' }}>changed</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary leading-relaxed">
            Every release, newest first. FlashFX runs in the browser, so you are always on the
            current version. Nothing here needs downloading.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
