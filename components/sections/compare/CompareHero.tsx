'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function CompareHero() {
  const scrollToMatrix = () => {
    const element = document.getElementById('capability-matrix');
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
            Architecture and specs, no unmeasured claims
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">FlashFX vs CapCut </span>
            <span style={{ color: '#f5c842' }}>vs DaVinci Resolve</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-6 max-w-3xl leading-relaxed">
            Three tools that are genuinely different products, not three versions of the same
            one. This page compares how they are built, what hardware each demands, and which
            features exist in which, not which is fastest.
          </p>
          <p className="text-base text-fx-text-secondary mb-10 max-w-3xl leading-relaxed">
            We have not published performance figures here, and the reason is on this page.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Try FlashFX Free</ShimmerButton>
            </a>
            <ShimmerButton onClick={scrollToMatrix}>See the Capability Matrix</ShimmerButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
