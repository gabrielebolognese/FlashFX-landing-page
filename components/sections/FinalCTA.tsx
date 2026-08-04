'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function FinalCTA() {
  return (
    <section className="relative w-full px-6 py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-fx-text-primary">
            Start Creating Today
          </h2>
          <p className="text-lg text-fx-text-secondary max-w-2xl mx-auto">
            Join thousands of creators who have switched to FlashFX. No credit card required. No installation needed.
          </p>
          <div className="flex justify-center">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Launch FlashFX</ShimmerButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
