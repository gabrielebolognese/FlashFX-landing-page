'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/*
 * A section under the "Features" opener.
 *
 * One component for all of them rather than a file each: they differ by a
 * heading, a list and which demo they hold. `AllWebEditing` / `DualTimeline` /
 * `EasyAnimations` already showed where copying goes — three near-identical
 * files differing by seven lines of ninety-one, which all had to be deleted
 * together (immersionmilestones.md, the opening audit).
 *
 * ── Two layouts ─────────────────────────────────────────────────────────────
 *
 *   split  copy and list on the left, demo on the right, matching
 *          `ThreeDSupport`. For a demo that reads in a square.
 *   full   heading and subtitle centred, demo across the whole width. For one
 *          that needs the room — the vector canvas draws a curve edge to edge
 *          and would be pointless in a column.
 *
 * ── What may go in `list` ───────────────────────────────────────────────────
 *
 * Only things already established. The shape primitives come from the owner;
 * the audio and video lines are lifted from `editorFeatures.ts`, which is the
 * site's own published description of those features. Nothing here is a new
 * claim, and new ones do not get invented to fill a bullet.
 */
export function FeatureBlock({
  id,
  title,
  accent,
  subtitle,
  list,
  layout = 'split',
  children,
}: {
  id: string;
  title: string;
  /** The trailing word to pick out in yellow. */
  accent?: string;
  subtitle?: string;
  list?: string[];
  layout?: 'split' | 'full';
  children?: React.ReactNode;
}) {
  const tail = accent && title.endsWith(accent);
  const head = tail ? title.slice(0, -accent!.length) : title;

  const heading = (
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white ${layout === 'full' ? 'text-center' : ''}`}
      style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
    >
      {head}
      {tail && <span style={{ color: '#f5c842' }}>{accent}</span>}
    </motion.h3>
  );

  const blurb = subtitle && (
    <motion.p
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.08 }}
      className={`mt-5 text-lg md:text-xl text-fx-text-secondary leading-relaxed ${
        layout === 'full' ? 'text-center max-w-3xl mx-auto' : 'max-w-xl'
      }`}
    >
      {subtitle}
    </motion.p>
  );

  const bullets = list && list.length > 0 && (
    <motion.ul
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.16 }}
      className="mt-7 space-y-3"
    >
      {list.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(245,197,24,0.14)', border: '1px solid rgba(245,197,24,0.3)' }}
          >
            <Check className="w-3 h-3 text-fx-accent-yellow" strokeWidth={3} />
          </span>
          <span className="text-base md:text-lg text-fx-text-primary/90">{item}</span>
        </li>
      ))}
    </motion.ul>
  );

  if (layout === 'full') {
    return (
      <section id={id} className="relative w-full py-14 md:py-20 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {heading}
          {blurb}
          {bullets}
        </div>
        {children && <div className="relative mt-10 md:mt-14 w-full">{children}</div>}
      </section>
    );
  }

  return (
    <section id={id} className="relative w-full py-14 md:py-20 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            // Demo first on a phone, copy second: a list of what a thing does,
            // above the thing doing it, is a promise before the evidence.
            className="order-2 lg:order-1"
          >
            {heading}
            {blurb}
            {bullets}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative w-full order-1 lg:order-2"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
