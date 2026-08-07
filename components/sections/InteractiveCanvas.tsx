'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

/*
 * Follows the two timelines (immersionmilestones.md I8, 2026-08-07).
 *
 * The editor mock is `dynamic({ ssr: false })`: it is a large interactive tree
 * that needs pointer and canvas APIs, and it sits well below the fold, so none
 * of it belongs in the initial bundle.
 */
const CanvasStudio = dynamic(
  () => import('@/components/demos/CanvasStudio').then((m) => m.CanvasStudio),
  {
    ssr: false,
    // Sized to match, so nothing shifts when the chunk lands.
    loading: () => <div className="w-full h-full rounded-xl border border-fx-border bg-[#0b0f1a]" />,
  }
);

export function InteractiveCanvas() {
  return (
    <section id="interactive-canvas" className="relative w-full px-6 py-20 md:py-28">
      <div className="max-w-[92rem] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Interactive <span style={{ color: '#f5c842' }}>canvas</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-center text-lg md:text-xl text-fx-text-secondary max-w-3xl mx-auto"
        >
          A low-latency canvas lets you edit without timeline mess.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 md:mt-14 w-full h-[64vh] min-h-[440px] md:h-[76vh] md:min-h-[560px]"
        >
          <CanvasStudio />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-fx-text-secondary/60"
        >
          Drag anything on the canvas
        </motion.p>
      </div>
    </section>
  );
}
