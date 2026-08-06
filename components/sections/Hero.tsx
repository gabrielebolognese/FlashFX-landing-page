'use client';

import { motion } from 'framer-motion';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import ShimmerButton from '@/components/ui/shimmer-button';

/*
 * This used to render `null` until the PageLoader overlay finished, which meant
 * the largest contentful element on the site did not exist in the DOM during
 * the entire load — so whatever Google measured as LCP, it was never the hero.
 * The headline now renders immediately (performancemilestones.md P1). Do not
 * reintroduce a gate here.
 */
export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <ShaderAnimation active />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white mb-6"
          style={{ fontFamily: 'var(--font-lexend), sans-serif' }}
        >
          Make Animations with <span className="text-yellow-400">FlashFX</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          Professional motion graphics in your browser. No installation, no complexity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
            <ShimmerButton>Get Started</ShimmerButton>
          </a>
          <a href="#demo">
            <ShimmerButton>Watch Demo</ShimmerButton>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
