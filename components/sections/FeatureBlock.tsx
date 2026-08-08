'use client';

import { motion } from 'framer-motion';

/*
 * A titled slot under the "Features" opener.
 *
 * One component mounted three times rather than three files: Fast shape
 * creation, Audio and video support and Vector tool support differ only by their
 * heading right now, and `AllWebEditing` / `DualTimeline` / `EasyAnimations`
 * already demonstrated what happens when near-identical sections are copied —
 * three files differing by seven lines of ninety-one, all of which had to be
 * deleted together (immersionmilestones.md, the opening audit).
 *
 * ── Heading only, on purpose ────────────────────────────────────────────────
 *
 * No body copy and no artwork. The details for each of these are still to come
 * from the owner, and the standing rule in CLAUDE.md is that product facts are
 * never invented — a plausible-sounding sentence about what a vector tool does
 * is exactly the kind of thing that ends up shipped and wrong.
 *
 * A heading on its own reads as a divider rather than as a broken section, which
 * is why there is no empty panel or "coming soon" placeholder here. Pass
 * `children` and it becomes a full section with no change to this file.
 */
export function FeatureBlock({
  id,
  title,
  accent,
  children,
}: {
  id: string;
  title: string;
  /** The word to pick out in yellow, if the title has one worth picking out. */
  accent?: string;
  children?: React.ReactNode;
}) {
  const head = accent && title.endsWith(accent) ? title.slice(0, -accent.length) : title;

  return (
    <section id={id} className="relative w-full py-14 md:py-20 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          {head}
          {accent && title.endsWith(accent) && <span style={{ color: '#f5c842' }}>{accent}</span>}
        </motion.h3>

        {children && <div className="mt-10 md:mt-14">{children}</div>}
      </div>
    </section>
  );
}
