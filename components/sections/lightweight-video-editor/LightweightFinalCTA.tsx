'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';
import Link from 'next/link';

export function LightweightFinalCTA() {
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
            Professional Motion Graphics on Any Machine
          </h2>
          <p className="text-lg text-fx-text-secondary max-w-xl mx-auto leading-relaxed">
            No download, no install, no RAM requirements that disqualify your hardware. Open FlashFX in any browser and start creating.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Open FlashFX — No Install</ShimmerButton>
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { href: '/free-motion-graphics-software', label: 'Free motion graphics software' },
              { href: '/after-effects-alternative', label: 'After Effects alternative' },
              { href: '/features', label: 'All features' },
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
