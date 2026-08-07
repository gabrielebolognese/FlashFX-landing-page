'use client';

import { motion } from 'framer-motion';

/*
 * Introduces the pair of timelines that follow — the clip sequence first, then
 * the keyframe timeline (immersionmilestones.md I8, 2026-08-07).
 *
 * They used to sit in separate places on the page with unrelated sections
 * between them, which meant nothing said they were two halves of the same idea.
 * This heading is what makes them a pair.
 */
export function OrganizeWorkflow() {
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
        Organize <span style={{ color: '#f5c842' }}>workflow</span>
      </motion.h2>
    </section>
  );
}
