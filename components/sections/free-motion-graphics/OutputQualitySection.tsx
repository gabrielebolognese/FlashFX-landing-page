'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const screenshots = [
  {
    src: '/Screenshot_2026-03-01_180920_-_Copy.png',
    caption: 'Timeline editor with keyframe controls — available free',
    tag: 'Timeline',
  },
  {
    src: '/Screenshot_2026-03-01_183521.png',
    caption: 'Motion preset library — included in the free tier',
    tag: 'Presets',
  },
  {
    src: '/Screenshot_2026-03-03_204128.png',
    caption: 'Export panel — 1080p MP4, no watermark, no paywall',
    tag: 'Export',
  },
];

const outputSpecs = [
  { label: 'Max resolution (free)', value: '1920 × 1080' },
  { label: 'Frame rate', value: 'Up to 60fps' },
  { label: 'Export formats', value: 'MP4, WebM, GIF' },
  { label: 'Watermark', value: 'None' },
  { label: 'File size limit', value: 'None' },
  { label: 'Exports per month', value: 'Unlimited' },
];

export function OutputQualitySection() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Output Quality — What Free Actually Looks Like
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            The screenshots below show the FlashFX interface and export settings as they appear for free-tier users. No features have been hidden or blurred for demonstration purposes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {screenshots.map(({ src, caption, tag }, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-fx-border rounded-card overflow-hidden bg-fx-bg-surface"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={src}
                  alt={caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="px-4 py-3">
                <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-card border border-fx-border text-fx-text-secondary mb-2">{tag}</span>
                <p className="text-xs text-fx-text-secondary leading-relaxed">{caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Free Tier Export Specifications</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {outputSpecs.map(({ label, value }) => (
              <div key={label} className="px-5 py-4 border border-fx-border rounded-card bg-fx-bg-surface">
                <p className="text-xs text-fx-text-secondary uppercase tracking-wider font-mono mb-1">{label}</p>
                <p className="text-base font-semibold text-fx-text-primary" style={{ color: '#f5c842' }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
