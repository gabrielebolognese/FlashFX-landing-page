'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FLASHFX_COLOR = '#F5A623';
const AE_COLOR = '#94A3B8';
const DR_COLOR = '#5B8DB8';

interface BenchmarkEntry {
  metric: string;
  unit: string;
  lowerIsBetter: boolean;
  flashfx: { value: number; label: string; range?: string };
  afterEffects: { value: number; label: string; range?: string };
  daVinci: { value: number; label: string; range?: string };
  max: number;
}

const benchmarks: BenchmarkEntry[] = [
  {
    metric: 'Startup Time',
    unit: 'seconds',
    lowerIsBetter: true,
    flashfx: { value: 2, label: '~2s' },
    afterEffects: { value: 42, label: '~42s', range: '35–50s' },
    daVinci: { value: 23, label: '~23s', range: '18–28s' },
    max: 50,
  },
  {
    metric: 'Render Time',
    unit: 'min · 30s clip, 1080p',
    lowerIsBetter: true,
    flashfx: { value: 0.4, label: '~25s' },
    afterEffects: { value: 10, label: '~10 min', range: '6–14 min' },
    daVinci: { value: 21, label: '~21 min', range: '14–28 min' },
    max: 24,
  },
  {
    metric: 'Live Preview FPS',
    unit: 'fps before cache',
    lowerIsBetter: false,
    flashfx: { value: 60, label: '60 fps' },
    afterEffects: { value: 3, label: '~3 fps', range: '1–5 fps' },
    daVinci: { value: 1.5, label: '~1.5 fps', range: '0–3 fps' },
    max: 60,
  },
  {
    metric: 'RAM at Idle',
    unit: 'GB',
    lowerIsBetter: true,
    flashfx: { value: 0.2, label: '~200 MB' },
    afterEffects: { value: 1.1, label: '~1.1 GB' },
    daVinci: { value: 0.8, label: '~800 MB' },
    max: 1.2,
  },
  {
    metric: 'RAM Under Render',
    unit: 'GB',
    lowerIsBetter: true,
    flashfx: { value: 0.6, label: '~600 MB' },
    afterEffects: { value: 7.5, label: '~7.5 GB', range: '6–9 GB' },
    daVinci: { value: 5.5, label: '~5.5 GB', range: '4–7 GB' },
    max: 10,
  },
];

const tools = [
  { key: 'flashfx' as const, label: 'FlashFX', color: FLASHFX_COLOR },
  { key: 'afterEffects' as const, label: 'After Effects', color: AE_COLOR },
  { key: 'daVinci' as const, label: 'DaVinci Resolve', color: DR_COLOR },
];

function BenchmarkCard({ benchmark, isInView }: { benchmark: BenchmarkEntry; isInView: boolean }) {
  const flashfxIsWinner = benchmark.lowerIsBetter
    ? benchmark.flashfx.value <= benchmark.afterEffects.value && benchmark.flashfx.value <= benchmark.daVinci.value
    : benchmark.flashfx.value >= benchmark.afterEffects.value && benchmark.flashfx.value >= benchmark.daVinci.value;

  return (
    <div className="h-full p-5 bg-fx-bg-surface border border-fx-border rounded-card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-mono text-sm font-semibold text-fx-text-primary uppercase tracking-wide leading-tight">
            {benchmark.metric}
          </h3>
          <p className="text-xs text-fx-text-secondary mt-1">
            {benchmark.unit} &middot; {benchmark.lowerIsBetter ? 'lower is better' : 'higher is better'}
          </p>
        </div>
        {flashfxIsWinner && (
          <span
            className="flex-shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border tracking-wider uppercase"
            style={{ color: FLASHFX_COLOR, borderColor: FLASHFX_COLOR + '60', backgroundColor: FLASHFX_COLOR + '15' }}
          >
            FX wins
          </span>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {tools.map((tool, i) => {
          const entry = benchmark[tool.key];
          const pct = Math.max((entry.value / benchmark.max) * 100, 1.5);
          return (
            <div key={tool.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: tool.color }}>
                  {tool.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-fx-text-primary">{entry.label}</span>
                  {entry.range && (
                    <span className="font-mono text-[10px] text-fx-text-secondary hidden sm:inline">({entry.range})</span>
                  )}
                </div>
              </div>
              <div className="w-full h-5 bg-fx-bg-raised border border-fx-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: tool.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${pct}%` } : { width: 0 }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PerformanceBenchmark() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Performance Benchmarks
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            Measured on a mid-range Windows laptop with 8GB RAM, Intel Core i5 (2019), and integrated graphics — the hardware millions of creators actually own.
          </p>
        </motion.div>

        <div className="flex items-center gap-5 mb-8 flex-wrap">
          {tools.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm text-fx-text-secondary">{label}</span>
            </div>
          ))}
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {benchmarks.map((benchmark, i) => (
            <motion.div
              key={benchmark.metric}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <BenchmarkCard benchmark={benchmark} isInView={isInView} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-5 border border-fx-border rounded-card bg-fx-bg-raised"
        >
          <p className="text-sm text-fx-text-secondary leading-relaxed">
            <strong className="text-fx-text-primary">Note on DaVinci Resolve:</strong> Resolve is GPU-first by design. On systems with a discrete GPU it can outperform After Effects significantly. However, on integrated-GPU setups it loses its main advantage — render times can exceed even After Effects, making it the weakest choice for budget hardware.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
