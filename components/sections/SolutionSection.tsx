'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';
import { LazyYouTube } from '@/components/ui/lazy-youtube';

/*
 * Rebuilt 2026-08-07 at the owner's request.
 *
 * This was a two-column block headed "Built for Speed. Designed for Creators."
 * — heading, supporting paragraph and a call to action on the left, a
 * four-item feature list in a glass panel on the right, with the video below
 * all of it. It is now a single statement and the video, which is a much
 * stronger opening and gets to the demonstration far sooner.
 *
 * The "Explore all features" button is kept deliberately: it is the homepage's
 * internal link to /after-effects-alternative, one of the SEO landing pages
 * FIX.md exists to support, and dropping it would quietly cost that page an
 * inbound link from the most important page on the site.
 */
export function SolutionSection() {
  return (
    <section className="relative w-full px-6 py-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white max-w-5xl"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Professional motion graphics,{' '}
          <span style={{ color: '#f5c842' }}>on your browser</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 md:mt-16 w-full max-w-5xl"
        >
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-fx-border">
            <LazyYouTube
              src="https://www.youtube.com/embed/n5bQwyGoXRE?autoplay=1&mute=1&loop=1&playlist=n5bQwyGoXRE&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1"
              title="FlashFX motion graphics demo"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10"
        >
          <a href="/after-effects-alternative">
            <ShimmerButton>Explore all features</ShimmerButton>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
