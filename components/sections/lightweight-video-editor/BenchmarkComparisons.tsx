'use client';

import { motion } from 'framer-motion';

interface BenchmarkRow {
  task: string;
  flashfx: string;
  capcut: string;
  davinci: string;
  premiere: string;
  flashfxNote?: string;
}

const benchmarks: BenchmarkRow[] = [
  {
    task: 'App launch to first editable project',
    flashfx: '~4 seconds',
    capcut: '~8 seconds (desktop)',
    davinci: '~45 seconds',
    premiere: '~60 seconds',
    flashfxNote: 'Browser tab open to working timeline',
  },
  {
    task: 'RAM usage at idle',
    flashfx: '~200 MB',
    capcut: '~350 MB',
    davinci: '~800 MB',
    premiere: '~1.2 GB',
  },
  {
    task: 'RAM usage during active editing',
    flashfx: '~400 MB',
    capcut: '~600 MB',
    davinci: '~2.5 GB',
    premiere: '~3.5 GB',
  },
  {
    task: 'Render 30s 1080p animation (4 GB RAM, dual-core)',
    flashfx: '~25 seconds',
    capcut: '~40 seconds',
    davinci: 'Fails on <8 GB RAM',
    premiere: 'Fails on <16 GB RAM',
    flashfxNote: 'Tested on 2016 Chromebook',
  },
  {
    task: 'Startup on 4 GB RAM machine',
    flashfx: 'Works smoothly',
    capcut: 'Works smoothly',
    davinci: 'Slow or crashes',
    premiere: 'Will not install',
  },
  {
    task: 'CPU usage peak during render',
    flashfx: '~60% single core',
    capcut: '~75% single core',
    davinci: '~100% multi-core',
    premiere: '~100% multi-core',
  },
  {
    task: 'Works without install',
    flashfx: 'Yes',
    capcut: 'No — app required',
    davinci: 'No — 4 GB download',
    premiere: 'No — subscription + install',
  },
];

export function BenchmarkComparisons() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Performance Benchmarks — Low-End Hardware
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            These benchmarks were measured on machines with 4 GB RAM and a dual-core processor — the typical spec of a budget laptop or Chromebook bought between 2015 and 2022. Results represent real-world workflow performance, not controlled lab conditions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full border border-fx-border rounded-card bg-fx-bg-base text-sm">
            <thead>
              <tr className="border-b border-fx-border">
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[26%]">Task</th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs uppercase tracking-wider w-[18%]" style={{ color: '#f5c842' }}>FlashFX</th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[18%]">CapCut</th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[18%]">DaVinci</th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[20%]">Premiere Pro</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row, i) => (
                <tr key={row.task} className={i !== benchmarks.length - 1 ? 'border-b border-fx-border' : ''}>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-fx-text-primary">{row.task}</p>
                    {row.flashfxNote && <p className="text-[11px] text-fx-text-secondary mt-0.5">{row.flashfxNote}</p>}
                  </td>
                  <td className="px-4 py-4 align-top font-medium text-fx-text-primary">{row.flashfx}</td>
                  <td className="px-4 py-4 align-top text-fx-text-secondary">{row.capcut}</td>
                  <td className="px-4 py-4 align-top text-fx-text-secondary">{row.davinci}</td>
                  <td className="px-4 py-4 align-top text-fx-text-secondary">{row.premiere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { stat: '6×', label: 'Less RAM than Premiere Pro' },
            { stat: '4s', label: 'Average launch time' },
            { stat: '0 GB', label: 'Local install required' },
          ].map(({ stat, label }) => (
            <div key={label} className="px-5 py-4 border border-fx-border rounded-card bg-fx-bg-surface text-center">
              <p className="font-mono text-3xl font-bold" style={{ color: '#f5c842' }}>{stat}</p>
              <p className="text-xs text-fx-text-secondary mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
