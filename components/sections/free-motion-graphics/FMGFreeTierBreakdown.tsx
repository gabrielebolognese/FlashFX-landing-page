'use client';

import { motion } from 'framer-motion';
import { Film, Layers, Zap, Download, Wand as Wand2, Share2 } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Full Timeline Editor',
    description: 'Multi-layer timeline with keyframe support, motion paths, and easing controls. Identical to the paid tier — no features removed.',
  },
  {
    icon: Wand2,
    title: 'Built-in Motion Presets',
    description: 'Access a curated library of animation presets for text, shapes, and transitions. Apply, adjust timing, and export — no subscription required.',
  },
  {
    icon: Film,
    title: '1080p MP4 Export',
    description: 'Export at full 1080p resolution with no watermark. Your exported file is clean and ready to upload to YouTube, Instagram, or any platform.',
  },
  {
    icon: Zap,
    title: 'Fast Browser Rendering',
    description: 'FlashFX renders in the browser using optimized WebGL. A 30-second project typically renders in under 30 seconds on any modern device.',
  },
  {
    icon: Share2,
    title: 'Project Sharing',
    description: 'Share projects via link for feedback or collaboration. Free users can share projects publicly with anyone who has the link.',
  },
  {
    icon: Download,
    title: 'WebM & GIF Export',
    description: 'Export as WebM for web embedding or animated GIF for social posts and email campaigns — both available on the free tier.',
  },
];

export function FMGFreeTierBreakdown() {
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
            FlashFX Free Tier — Full Feature Breakdown
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            Every feature below is available at no cost. No trial timer, no export limit, no upgrade prompt blocking your workflow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="p-6 border border-fx-border rounded-card bg-fx-bg-surface hover:border-fx-accent-blue/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-card flex items-center justify-center mb-4 bg-fx-bg-raised border border-fx-border">
                <Icon className="w-4 h-4" style={{ color: '#f5c842' }} aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-fx-text-primary mb-2">{title}</h3>
              <p className="text-sm text-fx-text-secondary leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 px-6 py-5 border border-fx-border rounded-card bg-fx-bg-surface flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-fx-text-primary">What does the paid tier add?</p>
            <p className="text-sm text-fx-text-secondary mt-1">Advanced templates, MOV and AVI export, priority rendering queue, and team collaboration features. The free tier covers everything a solo creator needs.</p>
          </div>
          <a href="/pricing" className="text-sm font-medium underline underline-offset-4 text-fx-text-secondary hover:text-fx-text-primary transition-colors whitespace-nowrap">
            View Pricing
          </a>
        </motion.div>
      </div>
    </section>
  );
}
