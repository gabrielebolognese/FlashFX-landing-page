'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function AEFinalCTA() {
  return (
    <section className="relative w-full px-6 py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary">
            Start Creating Motion Graphics Today, for Free
          </h2>
          <p className="text-lg text-fx-text-secondary">
            No installation. No subscription. No After Effects required.
          </p>
          <div className="flex justify-center">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Try FlashFX</ShimmerButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
