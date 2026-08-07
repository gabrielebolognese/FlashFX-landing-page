'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CtaButton } from '@/components/ui/cta-button';
import {
  DEFAULTS,
  PRESETS,
  SHAPES,
  SLIDERS,
  type Controls,
  type Preset,
  type Shape,
} from '@/components/demos/particle-config';

/*
 * "Almost forgot… particle generation too" (immersionmilestones.md I8).
 *
 * Laid out to match `ThreeDSupport` (2026-08-07): heading and subtitle centred
 * across the section, then a two-column grid with the controls on the left and
 * the emitter on the right.
 *
 * It was a single stack before — title, presets, a full-bleed canvas, then
 * sliders underneath. That put the controls and the thing they control a screen
 * apart, so you dragged a slider and had to scroll back to see what it did. Side
 * by side, the feedback is immediate, which is the entire argument the section
 * is making.
 *
 * The emitter is `dynamic({ ssr: false })` — it needs a canvas and sits well
 * below the fold, so none of it belongs in the initial bundle.
 *
 * The control definitions come from `particle-config`, not from
 * `ParticleStudio`. Importing them from the studio pulled the whole simulation
 * into the page bundle and defeated the dynamic import outright — the emitter
 * turned up in the eager page chunk and First Load JS rose 3 kB.
 */
const ParticleStudio = dynamic(
  () => import('@/components/demos/ParticleStudio').then((m) => m.ParticleStudio),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
);

export function ParticleGeneration() {
  const [controls, setControls] = useState<Controls>(DEFAULTS);
  const set = <K extends keyof Controls>(key: K, value: Controls[K]) =>
    setControls((c) => ({ ...c, [key]: value }));

  const groupLabel =
    'font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary';

  return (
    <section id="particles" className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Heading and subtitle span the section, centred above the two columns. */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Almost forgot&hellip;{' '}
        <span style={{ color: '#f5c842' }}>particle generation too</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 px-6 text-center text-base md:text-lg text-fx-text-secondary max-w-2xl mx-auto"
      >
        Fire, smoke, magic, confetti &mdash; and any emitter you build yourself. Change
        anything on the left and it updates as you drag.
      </motion.p>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 mt-12 md:mt-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/*
            Controls left, emitter right — but the emitter comes first in the
            source and only swaps on `lg`. Stacked on a phone, a column of
            sliders above the thing they drive means you adjust something you
            cannot see; the fountain has to be on screen for the controls to
            mean anything.
          */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 space-y-8"
          >
            <div>
              <span className={groupLabel}>Preset</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const on = controls.preset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => set('preset', p.id as Preset)}
                      className={`px-4 py-1.5 rounded-full border font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                        on
                          ? 'bg-fx-accent-yellow text-fx-bg-base border-fx-accent-yellow'
                          : 'text-fx-text-secondary border-fx-border hover:border-fx-accent-yellow/50 hover:text-fx-text-primary'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two across rather than the old four: this column is half the
                width the sliders used to have. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {SLIDERS.map((s) => (
                <label key={s.key} className="block">
                  <span className="flex items-baseline justify-between mb-2">
                    <span className={groupLabel}>{s.label}</span>
                    <span className="font-mono text-[11px] text-fx-accent-yellow tabular-nums">
                      {s.step < 1 ? controls[s.key].toFixed(2) : Math.round(controls[s.key])}
                      {s.unit}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={controls[s.key]}
                    onChange={(e) => set(s.key, Number(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer bg-fx-border accent-fx-accent-yellow"
                    aria-label={s.label}
                  />
                </label>
              ))}
            </div>

            <div>
              <span className={groupLabel}>Shape</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {SHAPES.map((s) => {
                  const on = controls.shape === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => set('shape', s.id as Shape)}
                      className={`px-3 py-1 rounded-md border font-mono text-[10px] tracking-wide transition-colors duration-200 ${
                        on
                          ? 'bg-fx-accent-yellow/15 border-fx-accent-yellow text-fx-accent-yellow'
                          : 'text-fx-text-secondary border-fx-border hover:border-fx-accent-yellow/50 hover:text-fx-text-primary'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/*
              `md`, the same size the 3D section uses. The hero's `lg` is the
              page's one loudest moment and stays that way — a section CTA that
              matches it competes with it.
            */}
            <div className="pt-2">
              <CtaButton href="https://editor.flashfx.app" size="md">
                Make your own
              </CtaButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            /*
              The aspect lives here, on a server-rendered element, not on
              `ParticleStudio`. The studio is `ssr: false`, so its root does not
              exist until the chunk lands — putting the ratio there would leave
              this column at zero height on first paint and shift the whole row
              when it arrived. The box is reserved now and the canvas fills it.
            */
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square order-1 lg:order-2"
          >
            {/* Same treatment as the 3D viewer: a pool of light instead of a
                panel, so the emitter sits in the section rather than in a box. */}
            <div
              className="absolute left-1/2 top-1/2 w-[78%] h-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(245,197,24,0.11) 0%, rgba(124,92,191,0.07) 42%, transparent 72%)',
              }}
            />
            {/*
              The emitter launches from `y: h * 0.93` — the bottom edge — so it
              needs height far more than width, hence the square from `lg` rather
              than the 16:9 a video would want. Matches the 3D viewer's ratio.
            */}
            <ParticleStudio controls={controls} className="absolute inset-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
