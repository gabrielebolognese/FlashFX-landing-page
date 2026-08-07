'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { LiquidGlassPanel } from '@/components/ui/liquid-glass';
import ShimmerButton from '@/components/ui/shimmer-button';
import { LazyYouTube } from '@/components/ui/lazy-youtube';

const features = [
  'Browser-based — works on any device',
  'Intuitive interface — create in minutes',
  'Real-time preview — see changes instantly',
  'Export ready — download in seconds',
];

export function SolutionSection() {
  return (
    <section className="relative w-full px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
            >
              <span className="text-white">Built for </span>
              <span style={{ color: '#f5c842' }}>Speed.</span>
              <br />
              <span className="text-white">Designed for </span>
              <span style={{ color: '#f5c842' }}>Creators.</span>
            </h2>
            <p className="text-lg text-fx-text-secondary">
              FlashFX strips away the complexity of traditional motion graphics software. Focus on your creativity, not fighting with tools.
            </p>
            <a href="/after-effects-alternative">
              <ShimmerButton>Explore all features</ShimmerButton>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LiquidGlassPanel
              tint="rgba(255, 165, 0, 0.15)"
              borderRadius="24px"
              style={{ padding: '32px' }}
            >
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-fx-accent-yellow mt-0.5 flex-shrink-0" />
                    <span className="text-fx-text-primary">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </LiquidGlassPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-fx-border">
            <LazyYouTube
              src="https://www.youtube.com/embed/n5bQwyGoXRE?autoplay=1&mute=1&loop=1&playlist=n5bQwyGoXRE&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1"
              title="FlashFX Built for Speed Demo"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
