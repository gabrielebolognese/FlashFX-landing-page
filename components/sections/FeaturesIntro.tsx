'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

/*
 * three.js is loaded on demand rather than in the initial bundle
 * (performancemilestones.md P5). Decorative background only, so `ssr: false`
 * costs nothing a crawler cares about, and the placeholder matches the
 * shader's own clear colour so nothing flashes or shifts.
 */
const WebGLShader = dynamic(
  () => import('@/components/ui/web-gl-shader').then((m) => m.WebGLShader),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0" style={{ background: '#0a1628' }} />,
  }
);


export function FeaturesIntro() {
  return (
    <section className="relative w-full py-32 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <WebGLShader />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-6xl md:text-7xl lg:text-8xl leading-tight bg-gradient-to-r from-fx-accent-yellow to-orange-500 bg-clip-text text-transparent mb-6"
            style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Features
          </h2>

          <p className="text-fx-text-secondary text-xl md:text-2xl max-w-3xl mx-auto">
            Not convinced yet? Take a look at what FlashFX is actually capable of
          </p>
        </motion.div>
      </div>
    </section>
  );
}

