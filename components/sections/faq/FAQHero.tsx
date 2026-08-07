'use client';

import { motion } from 'framer-motion';

export function FAQHero() {
  return (
    <section className="relative w-full px-6 pt-16 pb-10 md:pt-20 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Help</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Questions, </span>
            <span style={{ color: '#f5c842' }}>answered</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary max-w-3xl leading-relaxed">
            Search for what you need, or read through by topic.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
