'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ShimmerButton from '@/components/ui/shimmer-button';

export function CompareFinalCTA() {
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
          The only benchmark that matters is your own
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-10 leading-relaxed"
        >
          FlashFX opens in a tab, so trying it costs a click rather than a download and an
          install. Build something and see whether it fits how you work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
            <ShimmerButton>Try FlashFX Free</ShimmerButton>
          </a>
          <Link href="/features">
            <ShimmerButton>See All Features</ShimmerButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
