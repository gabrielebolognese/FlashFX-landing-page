'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ShimmerButton from '@/components/ui/shimmer-button';

export function FeaturesFinalCTA() {
  return (
    <section className="relative w-full px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Faster to try than to read about
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-10 leading-relaxed"
        >
          The editor opens in a tab. No install, no account needed to start, and the free
          tier is not a timed trial.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
            <ShimmerButton>Open the Editor</ShimmerButton>
          </a>
          <Link href="/pricing">
            <ShimmerButton>See Pricing</ShimmerButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
