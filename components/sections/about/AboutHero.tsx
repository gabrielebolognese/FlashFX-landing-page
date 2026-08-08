'use client';

import { motion } from 'framer-motion';

export function AboutHero() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">About</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">The team behind </span>
            <span style={{ color: '#f5c842' }}>FlashFX</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary max-w-3xl leading-relaxed">
            FlashFX is a browser-based motion graphics and video editor: an alternative to
            After Effects and Premiere Pro that runs in a tab, has a free tier, and needs no
            install. It has been in development since 1 January 2024, built by a small team
            led by founder and CEO Gabriele Bolognese.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
