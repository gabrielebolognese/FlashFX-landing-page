'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
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

  return (
    <section id="particles" className="relative w-full py-20 md:py-28 overflow-hidden">
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
        anything below and it updates as you drag.
      </motion.p>

      {/* Preset row */}
      <div className="mt-8 px-6 flex flex-wrap justify-center gap-2">
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

      {/* The emitter itself: full width, no panel, like the other demos. */}
      <div className="relative w-full h-[50vh] min-h-[320px] md:h-[58vh] mt-6">
        <ParticleStudio controls={controls} className="absolute inset-0" />
      </div>

      <div className="mt-8 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          {SLIDERS.map((s) => (
            <label key={s.key} className="block">
              <span className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary">
                  {s.label}
                </span>
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

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary mr-1">
            Shape
          </span>
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
    </section>
  );
}
