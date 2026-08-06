'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';

/*
 * Canvas sizes are the standard YouTube dimensions, reachable because canvas
 * size is typed rather than chosen from a locked preset list. Format and
 * encoder claims come from editorFeatures.ts and PricingSection — see
 * components/sections/features/ExportSection.tsx, which documents the same set.
 */
const canvases = [
  { label: 'Standard upload', size: '1920 x 1080', note: '16:9, the default for long-form' },
  { label: 'Shorts', size: '1080 x 1920', note: '9:16 vertical' },
  { label: 'Square', size: '1080 x 1080', note: 'For cross-posting the same cut' },
];

const outputs = [
  { format: 'MP4', note: 'H.264. The safe default for a YouTube upload.' },
  { format: 'PNG sequence', note: 'Transparency preserved, for compositing into an existing edit.' },
  { format: 'WebM', note: 'VP8 or VP9, when file size matters more than compatibility.' },
  { format: 'GIF', note: 'Short loops for community posts and thumbnails elsewhere.' },
];

export function YTFormats() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Sizes and formats
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Canvas dimensions are typed in, not picked from a fixed list, so nothing stops you
          working at whatever size the platform wants this month.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Canvas</h3>
              <dl className="space-y-4">
                {canvases.map((canvas) => (
                  <div key={canvas.label}>
                    <dt className="flex items-baseline justify-between gap-4 mb-1">
                      <span className="text-sm text-fx-text-primary font-medium">
                        {canvas.label}
                      </span>
                      <span className="font-mono text-sm" style={{ color: '#f5c842' }}>
                        {canvas.size}
                      </span>
                    </dt>
                    <dd className="text-sm text-fx-text-secondary">{canvas.note}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Export</h3>
              <dl className="space-y-4">
                {outputs.map((output) => (
                  <div key={output.format} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt
                      className="font-mono text-sm w-32 flex-shrink-0"
                      style={{ color: '#f5c842' }}
                    >
                      {output.format}
                    </dt>
                    <dd className="text-sm text-fx-text-secondary leading-relaxed">
                      {output.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
