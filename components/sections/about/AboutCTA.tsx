'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function AboutCTA() {
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
            Try It, or Come Talk to Us
          </h2>
          <p className="text-lg text-fx-text-secondary">
            The editor is free and opens in your browser. The Discord is where the team
            actually is.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Launch FlashFX</ShimmerButton>
            </a>
            <a href="https://discord.gg/VkSrB55HWg" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Join the Discord</ShimmerButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
