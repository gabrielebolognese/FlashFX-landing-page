'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ShimmerButton from '@/components/ui/shimmer-button';

export function PricingFinalCTA() {
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
          Try it before you think about paying
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-10 leading-relaxed"
        >
          The editor opens in a browser tab. Build something, export it, and decide
          afterwards whether you need anything the free tier does not cover.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
            <ShimmerButton>Start for Free</ShimmerButton>
          </a>
          <Link href="/features">
            <ShimmerButton>See All Features</ShimmerButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
