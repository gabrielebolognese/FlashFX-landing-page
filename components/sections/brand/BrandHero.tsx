'use client';

import { motion } from 'framer-motion';

export function BrandHero() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Brand</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">The FlashFX </span>
            <span style={{ color: '#f5c842' }}>brand</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary max-w-3xl leading-relaxed">
            The logo, colours, and type we use, and how to refer to FlashFX in writing. If
            you are covering FlashFX or building something alongside it, take what you need
            from this page.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
