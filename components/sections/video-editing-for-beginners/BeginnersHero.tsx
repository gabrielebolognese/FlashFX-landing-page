'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function BeginnersHero() {
  const scrollToWalkthrough = () => {
    const element = document.getElementById('beginner-walkthrough');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-fx-border rounded-card bg-fx-bg-surface text-xs font-mono text-fx-text-secondary uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            First export in under 15 minutes · No prior experience needed
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Video Editing Software</span>
            <span style={{ color: '#f5c842' }}> for Beginners </span>
            <span className="text-white">That Actually Works</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-10 max-w-3xl leading-relaxed">
            FlashFX is beginner motion graphics software designed around one principle: new users should be able to create and export a professional animation within 15 minutes of opening it for the first time. No tutorials required. No steep learning curve. Just open it and start.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Start Creating, It&apos;s Free</ShimmerButton>
            </a>
            <ShimmerButton onClick={scrollToWalkthrough}>See Step-by-Step Guide</ShimmerButton>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: '15 min', label: 'Avg. time to first export' },
              { value: '0', label: 'Prior skills needed' },
              { value: '100%', label: 'Free to get started' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-mono text-2xl md:text-3xl font-bold" style={{ color: '#f5c842' }}>{value}</p>
                <p className="text-xs text-fx-text-secondary mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
