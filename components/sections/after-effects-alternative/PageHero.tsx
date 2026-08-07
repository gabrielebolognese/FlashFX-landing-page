'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function PageHero() {
  const scrollToComparison = () => {
    const element = document.getElementById('comparison-table');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">The Best After Effects </span>
            <span style={{ color: '#f5c842' }}>Alternative</span>
            <span className="text-white"> for Creators Who Want Speed</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-8 max-w-3xl leading-relaxed">
            FlashFX is a free, browser-based motion graphics application that removes the complexity, cost, and system requirements of Adobe After Effects. No installation required. No subscription fees. Start creating professional motion graphics in minutes, not months.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Try FlashFX</ShimmerButton>
            </a>
            <ShimmerButton onClick={scrollToComparison}>Compare</ShimmerButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
