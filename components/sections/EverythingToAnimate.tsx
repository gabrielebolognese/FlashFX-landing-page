'use client';

import { motion } from 'framer-motion';

/*
 * Introduces the animation tools that follow — presets, then interpolation
 * (immersionmilestones.md I8, 2026-08-07).
 *
 * Same job as `OrganizeWorkflow` does for the two timelines: these were
 * separate full-size sections with their own huge headings, competing with each
 * other rather than reading as parts of one story.
 */
export function EverythingToAnimate() {
  return (
    <section className="relative w-full px-6 pt-20 pb-4 md:pt-28 md:pb-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Everything you need to <span style={{ color: '#f5c842' }}>animate</span>
      </motion.h2>
    </section>
  );
}
