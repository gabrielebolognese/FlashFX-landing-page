'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CtaButton } from '@/components/ui/cta-button';
import { EDITOR_URL } from '@/lib/editor';

/*
 * "Tired of lag?" — the performance section.
 *
 * Rebuilt 2026-08-07. It used to be the word "Load Time" in a gradient over a
 * YouTube clip, which named a topic without making a claim: a visitor could read
 * the whole thing and not learn one fact. It is six figures now, each with the
 * thing it is being compared against.
 *
 * ── What may be claimed here, and what may not ──────────────────────────────
 *
 * The FlashFX side is first-party and stated plainly: 0 MB, ~2s, no discrete
 * GPU, chunked timelines, several projects at once. All of it is in FIX.md under
 * *Canonical facts*.
 *
 * The After Effects side quotes exactly **one** specification: the ~15 GB
 * install. Every other line about it is structural — it installs to disk, it
 * wants a dedicated card, it opens one project at a time — which holds
 * regardless of which version's spec sheet you read. Keep it that way.
 *
 * On the 15 GB: helpx.adobe.com has refused to load on every attempt across
 * several sessions, so it is **not confirmed at the source**. It rests on two
 * things instead: `SystemRequirementsSection.tsx` has published "15+ GB
 * installation" on `/lightweight-video-editor` since long before this section
 * existed, and third-party sources agree on 15 GB for the 25.x releases. The
 * older 8 GB figure circulating for earlier versions is what the two-to-one
 * disagreement in FIX.md was about.
 *
 * Because it is unconfirmed, it is hedged in the copy ("about 15 GB") and it is
 * the *same* number the rest of the site uses. If Adobe's page ever loads and
 * says otherwise, both places change together — a figure that is wrong in one
 * spot and right in another is worse than either.
 *
 * The 50-second figure is the one measurement, and it carries its own caveat in
 * the markup: *measured on one machine*. That label is load-bearing.
 * `/flashfx-vs-capcut-vs-davinci` promises "no unmeasured performance claims" in
 * its metadata, and an unqualified "50s" would put this section in conflict with
 * the site's own stated position.
 */

type Stat = {
  /** Counts up when it arrives. Omit for a word. */
  to?: number;
  word?: string;
  unit?: string;
  label: string;
  /** The After Effects counterpart. Structural, apart from the install size. */
  against: ReactNode;
  /** Renders the "measured on one machine" caveat. */
  measured?: boolean;
};

/**
 * The one number on the After Effects side. It is deliberately quieter than the
 * FlashFX figure above it: this card's claim is the 0, and 15 GB is the thing
 * the 0 is standing against, not a competing headline.
 */
function Figure({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-fx-text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {children}
    </strong>
  );
}

const STATS: Stat[] = [
  {
    to: 0,
    unit: 'MB',
    label: 'to install',
    against: (
      <>
        After Effects wants <Figure>about 15 GB</Figure> on disk before you open anything
      </>
    ),
  },
  {
    to: 2,
    unit: 's',
    label: 'to open the editor',
    against: 'Around 50s for After Effects on the same machine',
    measured: true,
  },
  { to: 4, unit: 'GB', label: 'of RAM is enough', against: 'After Effects is built for workstation memory' },
  { to: 0, unit: '', label: 'graphics cards required', against: 'After Effects wants a dedicated card' },
  { word: 'Hours', label: 'of timeline, chunked', against: 'Length stops being a memory problem' },
  { word: 'Many', label: 'projects open at once', against: 'After Effects works one project at a time' },
];

/**
 * Count from zero when the number arrives on screen.
 *
 * Runs once, on an IntersectionObserver, and holds the final value afterwards —
 * a figure that re-counts every time it is scrolled past is a distraction rather
 * than an arrival. Reduced motion gets the final value immediately: the number
 * is the content, the counting is decoration.
 */
function useCountUp(to: number, run: boolean, ms = 1100) {
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || to === 0) {
      setValue(to);
      return;
    }

    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / ms);
      // Decelerating, so it lands rather than stopping.
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);

  return value;
}

function StatCard({ stat, index, run }: { stat: Stat; index: number; run: boolean }) {
  const counted = useCountUp(stat.to ?? 0, run && stat.to !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-fx-border p-6 sm:p-7 flex flex-col"
      style={{ background: 'rgba(20, 31, 64, 0.62)' }}
    >
      <span
        className="block text-5xl sm:text-6xl lg:text-7xl leading-none tabular-nums"
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.045em',
          color: '#f5c842',
        }}
      >
        {stat.word ?? counted}
        {stat.unit && <span className="text-3xl sm:text-4xl lg:text-5xl ml-0.5">{stat.unit}</span>}
      </span>

      <span className="mt-3 text-base sm:text-lg text-fx-text-primary" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        {stat.label}
      </span>

      <span className="mt-4 pt-4 border-t border-fx-border text-sm text-fx-text-secondary leading-relaxed">
        {stat.against}
        {stat.measured && (
          /* Not fine print for its own sake: this is the only figure here that
             is a measurement rather than a property, and the site's comparison
             page promises no unmeasured performance claims. */
          <span className="block mt-1.5 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/55">
            measured on one machine
          </span>
        )}
      </span>
    </motion.div>
  );
}

export function LoadTime() {
  const [run, setRun] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="performance" className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Tired of <span style={{ color: '#f5c842' }}>lag?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-center text-xl sm:text-2xl md:text-3xl leading-snug text-fx-text-primary/90 max-w-4xl mx-auto"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          FlashFX is built with performance optimisation in mind. You could run this
          on a school PC.
        </motion.p>

        <div ref={host} className="mt-14 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} run={run} />
          ))}
        </div>

        {/* Six figures and then the obvious next move. The one claim on this
            page a visitor can check in about two seconds is the two-second
            one. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex justify-center"
        >
          <CtaButton href={EDITOR_URL} size="lg">
            Try it for yourself
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
