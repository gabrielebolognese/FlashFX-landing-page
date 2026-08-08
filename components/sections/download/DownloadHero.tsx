'use client';

import { motion } from 'framer-motion';

export function DownloadHero() {
  return (
    <section className="relative w-full px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05]"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">FlashFX is </span>
            <span style={{ color: '#f5c842' }}>all web</span>
          </h1>

          <p
            className="text-2xl md:text-3xl lg:text-4xl text-fx-text-primary leading-snug max-w-4xl mx-auto"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.02em' }}
          >
            You can install this page with Chromium
          </p>

          <p className="text-base md:text-lg text-fx-text-secondary mt-8 max-w-2xl mx-auto leading-relaxed">
            There is no installer to download and no setup to run. Every browser worth using
            can turn a page into a windowed app in about four clicks. Here is how.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
