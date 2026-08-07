'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function FeaturesPageHero() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Features</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Everything in </span>
            <span style={{ color: '#f5c842' }}>one browser tab</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-10 max-w-3xl leading-relaxed">
            Vector design, keyframe animation, 3D, audio, and export — the whole motion
            graphics pipeline, running in a tab with nothing to install. Here is what is
            in the editor.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Open the Editor</ShimmerButton>
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: '45', label: 'Editor capabilities' },
              { value: '90', label: 'Animation presets' },
              { value: '39', label: 'Editable properties' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-mono text-2xl md:text-3xl font-bold" style={{ color: '#f5c842' }}>
                  {value}
                </p>
                <p className="text-xs text-fx-text-secondary mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
