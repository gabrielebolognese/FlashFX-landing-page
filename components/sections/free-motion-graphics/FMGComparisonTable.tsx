'use client';

import { motion } from 'framer-motion';
import { Check, Minus, X } from 'lucide-react';

interface CompRow {
  feature: string;
  flashfx: string;
  capcut: string;
  davinci: string;
  canva: string;
  flashfxWins?: boolean;
  note?: string;
}

const rows: CompRow[] = [
  {
    feature: 'Price (free tier)',
    flashfx: 'Free',
    capcut: 'Free',
    davinci: 'Free',
    canva: 'Free',
    note: 'All four offer free tiers',
  },
  {
    feature: 'Watermark on export',
    flashfx: 'None',
    capcut: 'CapCut watermark (removable with account)',
    davinci: 'None',
    canva: 'Canva watermark on premium elements',
    flashfxWins: true,
  },
  {
    feature: 'Export resolution (free)',
    flashfx: '1080p',
    capcut: '1080p',
    davinci: '1080p',
    canva: '1080p (but limited formats)',
    flashfxWins: false,
  },
  {
    feature: 'Motion graphics / keyframes',
    flashfx: 'Full keyframe timeline',
    capcut: 'Basic keyframes',
    davinci: 'Advanced (Fusion compositor)',
    canva: 'Limited preset animations only',
    flashfxWins: true,
  },
  {
    feature: 'Installation required',
    flashfx: 'None — browser-based',
    capcut: 'Mobile app or desktop install',
    davinci: '3–4 GB desktop install',
    canva: 'None — browser-based',
    flashfxWins: true,
  },
  {
    feature: 'Learning curve',
    flashfx: 'Low — export in minutes',
    capcut: 'Low — social media focused',
    davinci: 'High — node-based compositor',
    canva: 'Very low — template-drag-drop',
    flashfxWins: false,
    note: 'CapCut and Canva are easier for beginners with no motion graphics need',
  },
  {
    feature: 'Works on Chromebook',
    flashfx: 'Yes',
    capcut: 'Mobile only (web limited)',
    davinci: 'No',
    canva: 'Yes',
    flashfxWins: true,
  },
  {
    feature: 'RAM requirement',
    flashfx: '~200 MB at idle',
    capcut: '~300 MB',
    davinci: '~800 MB',
    canva: '~250 MB',
    flashfxWins: true,
  },
  {
    feature: 'Custom animation timing',
    flashfx: 'Full easing controls',
    capcut: 'Preset-only',
    davinci: 'Full easing controls',
    canva: 'None',
    flashfxWins: false,
    note: 'FlashFX and DaVinci both offer full easing',
  },
  {
    feature: 'Built for motion graphics',
    flashfx: 'Yes — primary focus',
    capcut: 'No — video editing first',
    davinci: 'Partially — Fusion module',
    canva: 'No — design/presentation first',
    flashfxWins: true,
  },
  {
    feature: 'MP4 export without sign-in',
    flashfx: 'Yes',
    capcut: 'No — account required',
    davinci: 'Yes',
    canva: 'No — account required',
    flashfxWins: true,
  },
  {
    feature: 'Social media templates',
    flashfx: 'Growing library',
    capcut: 'Extensive library',
    davinci: 'Very limited',
    canva: 'Extensive library',
    flashfxWins: false,
    note: 'CapCut and Canva lead on template quantity',
  },
];

const FLASHFX_COLOR = '#F5A623';

function Cell({ value, isFlashFX, wins }: { value: string; isFlashFX: boolean; wins?: boolean }) {
  return (
    <td className="px-4 py-4 text-sm align-top">
      <span className={isFlashFX && wins !== false ? 'text-fx-text-primary font-medium' : 'text-fx-text-secondary'}>
        {value}
      </span>
    </td>
  );
}

export function FMGComparisonTable() {
  const flashfxWins = rows.filter(r => r.flashfxWins === true).length;
  const ties = rows.filter(r => r.flashfxWins === false).length;

  return (
    <section id="fmg-comparison-table" className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Free Tier Comparison: FlashFX vs CapCut vs DaVinci vs Canva
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            All four tools offer a free tier. But &ldquo;free&rdquo; means something different in each. This table compares what you actually get without paying.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-fx-bg-base border border-fx-border rounded-card">
            <thead>
              <tr className="border-b border-fx-border">
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[22%]">
                  Feature
                </th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs uppercase tracking-wider w-[20%]" style={{ color: FLASHFX_COLOR }}>
                  FlashFX
                </th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[20%]">
                  CapCut
                </th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[20%]">
                  DaVinci Resolve
                </th>
                <th scope="col" className="px-4 py-4 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider w-[18%]">
                  Canva
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.feature}
                  className={[
                    index !== rows.length - 1 ? 'border-b border-fx-border' : '',
                    index % 2 === 0 ? '' : 'bg-fx-bg-raised/20',
                  ].join(' ')}
                >
                  <td className="px-4 py-4 align-top">
                    <span className="text-sm font-semibold text-fx-text-primary">{row.feature}</span>
                    {row.note && (
                      <p className="text-[11px] text-fx-text-secondary mt-0.5 leading-snug">{row.note}</p>
                    )}
                  </td>
                  <Cell value={row.flashfx} isFlashFX wins={row.flashfxWins} />
                  <Cell value={row.capcut} isFlashFX={false} />
                  <Cell value={row.davinci} isFlashFX={false} />
                  <Cell value={row.canva} isFlashFX={false} />
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
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex items-center justify-between px-5 py-4 border border-fx-border rounded-card bg-fx-bg-base">
            <span className="text-sm text-fx-text-secondary">FlashFX clearly leads</span>
            <span className="font-mono text-2xl font-bold" style={{ color: FLASHFX_COLOR }}>{flashfxWins}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border border-fx-border rounded-card bg-fx-bg-base">
            <span className="text-sm text-fx-text-secondary">Competitive or other tool leads</span>
            <span className="font-mono text-2xl font-bold text-fx-text-secondary">{ties}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
