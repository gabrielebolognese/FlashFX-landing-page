'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import ShimmerButton from '@/components/ui/shimmer-button';

const comparisons = [
  { feature: 'Free to use', flashfx: true, afterEffects: false },
  { feature: 'Runs in browser', flashfx: true, afterEffects: false },
  { feature: 'Instant rendering', flashfx: true, afterEffects: false },
];

export function ComparisonTeaser() {
  return (
    <section className="relative w-full px-6 py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-4xl font-bold text-fx-text-primary text-center mb-12"
        >
          FlashFX vs After Effects
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-fx-bg-base border border-fx-border rounded-card overflow-hidden"
        >
          <div className="grid grid-cols-3 border-b border-fx-border">
            <div className="p-4"></div>
            <div className="p-4 text-center border-l border-fx-border">
              <span className="font-display font-semibold text-fx-accent-yellow">FlashFX</span>
            </div>
            <div className="p-4 text-center border-l border-fx-border">
              <span className="font-mono text-sm text-fx-text-secondary">After Effects</span>
            </div>
          </div>

          {comparisons.map((comparison) => (
            <div key={comparison.feature} className="grid grid-cols-3 border-b border-fx-border last:border-b-0">
              <div className="p-4 text-fx-text-primary">{comparison.feature}</div>
              <div className="p-4 flex justify-center items-center border-l border-fx-border">
                {comparison.flashfx ? (
                  <Check className="w-5 h-5 text-fx-accent-yellow" />
                ) : (
                  <X className="w-5 h-5 text-fx-text-secondary" />
                )}
              </div>
              <div className="p-4 flex justify-center items-center border-l border-fx-border">
                {comparison.afterEffects ? (
                  <Check className="w-5 h-5 text-fx-accent-yellow" />
                ) : (
                  <X className="w-5 h-5 text-fx-text-secondary" />
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <a href="/after-effects-alternative">
            <ShimmerButton>Full Comparison</ShimmerButton>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
