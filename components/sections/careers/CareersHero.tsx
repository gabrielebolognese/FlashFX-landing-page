'use client';

import { motion } from 'framer-motion';

export function CareersHero() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Careers</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Small team, </span>
            <span style={{ color: '#f5c842' }}>no open roles</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary max-w-3xl leading-relaxed">
            FlashFX is built by three people. There is nothing to apply for right now, and we
            would rather say so plainly than keep a job board up that goes nowhere. If you
            want to be on our list for when that changes, the address is below.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
