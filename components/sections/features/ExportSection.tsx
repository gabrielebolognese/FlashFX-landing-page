'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';

/*
 * Formats and encoders are taken from the claims the site already makes:
 * editorFeatures.ts ('MP4 & WebM Export' — H.264 and VP8/VP9 via FFmpeg;
 * 'PNG Sequence Export' — transparent background) and PricingSection.tsx
 * (export formats MP4 / GIF / WebM / SVG). Nothing here is new.
 *
 * This section owns the `#export` anchor the footer links to
 * (/features#export) — renaming the id breaks that link.
 */
const formats = [
  {
    name: 'MP4',
    detail: 'H.264 encoding via FFmpeg. The default for YouTube, Instagram, and TikTok.',
  },
  {
    name: 'WebM',
    detail: 'VP8 and VP9 encoding, for the web where file size matters more than reach.',
  },
  {
    name: 'PNG sequence',
    detail: 'Every frame as a numbered PNG, transparency preserved, for compositing elsewhere.',
  },
  {
    name: 'GIF',
    detail: 'For looping clips that need to autoplay anywhere without a video player.',
  },
  {
    name: 'SVG',
    detail: 'Vector output for static frames that need to scale without resampling.',
  },
];

const controls = [
  'Quality presets, or set the bitrate yourself',
  'Custom resolution — not locked to preset canvas sizes',
  'Frame rate control with common presets',
  'Real-time progress while the export encodes',
];

export function ExportSection() {
  return (
    <section id="export" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Export &amp; formats
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Rendering happens in the browser and the file lands in your downloads. No render
          queue, no upload step, and no watermark burned into the frame.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Formats</h3>
              <dl className="space-y-4">
                {formats.map((format) => (
                  <div key={format.name} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-mono text-sm w-32 flex-shrink-0" style={{ color: '#f5c842' }}>
                      {format.name}
                    </dt>
                    <dd className="text-sm text-fx-text-secondary leading-relaxed">
                      {format.detail}
                    </dd>
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
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Controls</h3>
              <ul className="space-y-3">
                {controls.map((control) => (
                  <li
                    key={control}
                    className="text-sm text-fx-text-secondary leading-relaxed pl-4 relative"
                  >
                    <span
                      className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                    />
                    {control}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
