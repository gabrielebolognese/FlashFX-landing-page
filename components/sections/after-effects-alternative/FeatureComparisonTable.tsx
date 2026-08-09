'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type WinnerKey = 'flashfx' | 'afterEffects' | 'daVinci' | 'tie' | null;

interface ComparisonRow {
  feature: string;
  flashfx: string;
  afterEffects: string;
  daVinci: string;
  winner: WinnerKey;
  note?: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Price',
    flashfx: 'Free (paid tier available)',
    afterEffects: '~$55/month (CC)',
    daVinci: 'Free (Studio: $295 one-time)',
    winner: 'flashfx',
    note: 'FlashFX free tier has no watermark',
  },
  {
    feature: 'Installation',
    flashfx: 'Browser-based, no install',
    // Adobe's stated minimum for the 25.x releases, and the same figure the
    // homepage and /lightweight-video-editor print. This row said "2-4 GB"
    // until 2026-08-09, which was the site's own worst contradiction on it.
    afterEffects: '8 GB of disk space',
    // "3-4 GB" had no source, and there is none to be had: Blackmagic publishes
    // no disk-space figure for Resolve at all. Its stated minimums cover CPU,
    // GPU and RAM only, and the techspecs page is about control panels. Third
    // parties range from 2 GB to over 7 GB with nothing primary behind any of
    // them, so the only defensible claim is the one every source agrees on.
    daVinci: 'Multi-gigabyte desktop install',
    winner: 'flashfx',
    note: 'FlashFX works on Chromebooks',
  },
  {
    feature: 'Startup Time',
    flashfx: '~2 seconds',
    afterEffects: '35-50 seconds',
    daVinci: '18-28 seconds',
    winner: 'flashfx',
  },
  {
    feature: 'Render Time (30s, 1080p)',
    flashfx: '~25 seconds',
    afterEffects: '6-14 minutes',
    daVinci: '14-28 minutes',
    winner: 'flashfx',
    note: 'DaVinci suffers most on iGPU setups',
  },
  {
    feature: 'Live Preview FPS',
    flashfx: '60 fps',
    afterEffects: '1-5 fps (before cache)',
    daVinci: '0-3 fps (before cache)',
    winner: 'flashfx',
  },
  {
    feature: 'RAM at Idle',
    flashfx: '~200 MB',
    afterEffects: '~1.1 GB',
    daVinci: '~800 MB',
    winner: 'flashfx',
  },
  {
    feature: 'RAM Under Render',
    flashfx: '~600 MB',
    afterEffects: '6-9 GB',
    daVinci: '4-7 GB',
    winner: 'flashfx',
  },
  {
    feature: 'iGPU Performance',
    flashfx: 'Designed for it',
    afterEffects: 'CPU-first, works fine',
    daVinci: 'GPU-first, loses advantage',
    winner: 'flashfx',
    note: 'DaVinci not recommended without discrete GPU',
  },
  {
    feature: 'Learning Curve',
    flashfx: 'Low: first export in minutes',
    afterEffects: 'Moderate: layer-based, many tutorials',
    daVinci: 'Steep: node compositor, few MoGr tutorials',
    winner: 'flashfx',
  },
  {
    feature: 'Motion Presets / Templates',
    flashfx: 'Built-in library',
    afterEffects: 'Enormous: thousands free & paid',
    daVinci: 'Limited, growing slowly',
    winner: 'afterEffects',
    note: 'AE ecosystem unmatched',
  },
  {
    feature: 'Plugin Ecosystem',
    flashfx: 'Built-ins + reviewed community plugins',
    afterEffects: 'Largest in the industry',
    daVinci: 'Limited compared to AE',
    // The row still goes to After Effects, and should. Anyone can publish an AE
    // plugin today; FlashFX reviews every community submission and has not
    // opened them to everyone yet. Saying otherwise to win a row would be a
    // claim a visitor could disprove in one click.
    winner: 'afterEffects',
    note: 'FlashFX community plugins are reviewed before release',
  },
  {
    feature: 'Export Formats',
    flashfx: 'MP4, WebM, GIF',
    afterEffects: 'MP4, MOV, AVI + more',
    daVinci: 'Wide format support',
    winner: 'afterEffects',
    note: 'AE & DR win on format breadth',
  },
  {
    feature: 'Collaboration',
    flashfx: 'Browser-based link sharing',
    afterEffects: 'File-based, no native collab',
    daVinci: 'Built-in collaboration (Studio)',
    winner: 'tie',
  },
  {
    feature: 'Updates',
    flashfx: 'Automatic (web app)',
    afterEffects: 'Manual CC updates',
    daVinci: 'Manual updates',
    winner: 'flashfx',
  },
  {
    feature: 'Offline Use',
    flashfx: 'No',
    afterEffects: 'Yes',
    daVinci: 'Yes',
    winner: 'afterEffects',
    note: 'AE & DR advantage for offline work',
  },
  {
    feature: 'Recommended For iGPU',
    flashfx: 'Yes',
    afterEffects: 'Yes, CPU-first design suits it',
    daVinci: 'Not recommended',
    winner: 'tie',
    note: 'FlashFX & AE both suit integrated GPU setups',
  },
];

const FLASHFX_COLOR = '#F5A623';

function WinnerCell({ value, winner, colKey }: { value: string; winner: WinnerKey; colKey: WinnerKey }) {
  const isFlashFX = colKey === 'flashfx';

  return (
    <td className="px-4 md:px-5 py-4 text-sm align-top">
      <div className="flex items-start gap-2">
        {winner === colKey && (
          <Check
            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
            style={{ color: isFlashFX ? FLASHFX_COLOR : '#64748b' }}
            aria-hidden="true"
          />
        )}
        <span className={winner === colKey ? (isFlashFX ? 'text-fx-text-primary font-medium' : 'text-fx-text-primary') : 'text-fx-text-secondary'}>
          {value}
        </span>
      </div>
    </td>
  );
}

export function FeatureComparisonTable() {
  return (
    <section id="comparison-table" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            FlashFX vs After Effects vs DaVinci Resolve
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            A full feature and performance comparison across every dimension that matters for independent creators on real hardware.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-fx-bg-surface border border-fx-border rounded-card">
            <thead>
              <tr className="border-b border-fx-border">
                <th scope="col" className="px-4 md:px-5 py-4 text-left font-mono text-xs md:text-sm text-fx-text-secondary uppercase tracking-wider w-[22%]">
                  Feature
                </th>
                <th scope="col" className="px-4 md:px-5 py-4 text-left font-mono text-xs md:text-sm uppercase tracking-wider w-[26%]"
                  style={{ color: FLASHFX_COLOR }}>
                  FlashFX
                </th>
                <th scope="col" className="px-4 md:px-5 py-4 text-left font-mono text-xs md:text-sm text-fx-text-secondary uppercase tracking-wider w-[26%]">
                  After Effects
                </th>
                <th scope="col" className="px-4 md:px-5 py-4 text-left font-mono text-xs md:text-sm text-fx-text-secondary uppercase tracking-wider w-[26%]">
                  DaVinci Resolve
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={row.feature}
                  className={[
                    index !== comparisonData.length - 1 ? 'border-b border-fx-border' : '',
                    index % 2 === 0 ? '' : 'bg-fx-bg-raised/30',
                  ].join(' ')}
                >
                  <td className="px-4 md:px-5 py-4 align-top">
                    <div>
                      <span className="text-sm font-semibold text-fx-text-primary">{row.feature}</span>
                      {row.note && (
                        <p className="text-[11px] text-fx-text-secondary mt-0.5 leading-snug">{row.note}</p>
                      )}
                    </div>
                  </td>
                  <WinnerCell value={row.flashfx} winner={row.winner} colKey="flashfx" />
                  <WinnerCell value={row.afterEffects} winner={row.winner} colKey="afterEffects" />
                  <WinnerCell value={row.daVinci} winner={row.winner} colKey="daVinci" />
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
            { label: 'FlashFX wins', count: comparisonData.filter(r => r.winner === 'flashfx').length, color: FLASHFX_COLOR },
            { label: 'After Effects wins', count: comparisonData.filter(r => r.winner === 'afterEffects').length, color: '#94A3B8' },
            { label: 'DaVinci wins', count: comparisonData.filter(r => r.winner === 'daVinci').length, color: '#5B8DB8' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between px-5 py-4 border border-fx-border rounded-card bg-fx-bg-surface">
              <span className="text-sm text-fx-text-secondary">{label}</span>
              <span className="font-mono text-2xl font-bold" style={{ color }}>{count}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
