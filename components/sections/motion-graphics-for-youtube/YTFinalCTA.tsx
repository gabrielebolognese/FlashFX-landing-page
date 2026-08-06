'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ShimmerButton from '@/components/ui/shimmer-button';

export function YTFinalCTA() {
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
          Your next upload needs an intro
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-10 leading-relaxed"
        >
          Open the editor, apply a preset, and export it. The free tier has no watermark and
          no expiry, so the only thing you spend is the time it takes to build.
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
