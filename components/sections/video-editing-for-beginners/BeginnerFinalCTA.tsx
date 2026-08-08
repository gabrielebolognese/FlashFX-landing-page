'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';
import Link from 'next/link';

export function BeginnerFinalCTA() {
  return (
    <section className="relative w-full px-6 py-24 bg-fx-bg-base">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary">
            Create Your First Animation Today, for Free
          </h2>
          <p className="text-lg text-fx-text-secondary max-w-xl mx-auto leading-relaxed">
            No experience required. No software to download. Open FlashFX in your browser and export your first professional animation in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Start Creating, Free</ShimmerButton>
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { href: '/free-motion-graphics-software', label: 'Free motion graphics software' },
              { href: '/lightweight-video-editor', label: 'Lightweight video editor' },
              { href: '/after-effects-alternative', label: 'After Effects alternative' },
              { href: '/pricing', label: 'Pricing' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-fx-text-secondary hover:text-fx-text-primary underline underline-offset-4 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
