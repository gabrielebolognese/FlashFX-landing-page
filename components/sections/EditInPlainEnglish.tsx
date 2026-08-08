'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

/*
 * "Edit in plain English" — the AI section.
 *
 * Sits directly under the opening video and before the timelines, because the
 * order of the page is an argument: here is the editor, here is what it can be
 * told to do, and here is the timeline it does it on.
 *
 * ── What this section may and may not claim ─────────────────────────────────
 *
 * The claim is that FlashFX is built to be *operated* by an AI — Claude works
 * the editor itself rather than generating a video somewhere else and handing
 * back a file. That is an owner-confirmed fact, recorded in FIX.md under
 * *Canonical facts* (2026-08-07). Do not extend it beyond what is written
 * there.
 *
 * It must also not imply the AI features are free. `faqData.ts` states plainly
 * that "the free tier is a complete manual editor with no AI features" and puts
 * them on Ultra and Teams. The line under the demo says so, and it stays.
 */
const PromptToArt = dynamic(() => import('@/components/demos/PromptToArt').then((m) => m.PromptToArt), {
  ssr: false,
  // Reserves nothing of its own — the section below sizes the slot, so there is
  // no shift when the chunk lands.
  loading: () => <div className="absolute inset-0" />,
});

export function EditInPlainEnglish() {
  return (
    <section id="edit-in-plain-english" className="relative w-full py-20 md:py-28 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Edit in <span style={{ color: '#f5c842' }}>plain English</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 px-6 text-center text-base md:text-lg text-fx-text-secondary max-w-2xl mx-auto"
      >
        FlashFX is built for an AI to drive. Describe what you want and Claude works the
        editor itself &mdash; the same canvas, keyframes and properties you would touch,
        left behind for you to take over.
      </motion.p>

      <div className="relative mt-10 md:mt-14">
        <PromptToArt />
      </div>

      <p className="mt-2 px-6 text-center font-mono text-[11px] tracking-wide text-fx-text-secondary/70">
        AI features are included with Ultra and Teams.
      </p>
    </section>
  );
}
