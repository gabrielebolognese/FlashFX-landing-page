'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function LightHero() {
  const scrollToRequirements = () => {
    const element = document.getElementById('system-requirements');
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
            Works on 4 GB RAM · No GPU Required · Browser-Based
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">The Lightweight Video Editor</span>
            <span style={{ color: '#f5c842' }}> Built for Low-End PCs</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-10 max-w-3xl leading-relaxed">
            FlashFX is a fast, browser-based motion graphics editor that runs on any machine — Chromebooks, old laptops, and budget PCs included. No installation, no 8 GB RAM requirement, no dedicated GPU. Just open a tab and start editing.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Try It Free</ShimmerButton>
            </a>
            <ShimmerButton onClick={scrollToRequirements}>See System Requirements</ShimmerButton>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: '2 GB', label: 'Min. RAM needed' },
              { value: '~200 MB', label: 'Browser memory idle' },
              { value: '0', label: 'GB to download' },
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
