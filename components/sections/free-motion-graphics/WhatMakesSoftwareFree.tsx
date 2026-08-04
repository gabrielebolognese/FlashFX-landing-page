'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const trulyFreeChecklist = [
  { item: 'No watermark on exported files', free: true },
  { item: 'No resolution cap on exports', free: true },
  { item: 'No time limit on projects', free: true },
  { item: 'No mandatory account creation to preview', free: true },
  { item: 'No forced upgrade prompts blocking core workflow', free: true },
  { item: 'Full-quality MP4 export at 1080p', free: true },
];

const commonTricks = [
  { trick: 'Watermark burned into every export', example: 'CapCut desktop free tier' },
  { trick: 'Resolution capped at 720p for free users', example: 'Canva free video export' },
  { trick: 'Core effects hidden behind a paywall', example: 'Most "free" editors' },
  { trick: '"Free trial" that expires after 7 days', example: 'Adobe Premiere Pro' },
  { trick: 'Feature advertised as free, requires upgrade at export', example: 'Canva Pro elements' },
];

export function WhatMakesSoftwareFree() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            What Makes Software Truly Free?
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            "Free" is one of the most abused words in software marketing. Most tools described as free motion graphics software are free in name only — they restrict output quality, add persistent watermarks, or lock essential features behind a subscription. Here is what genuine free access looks like.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-bold text-fx-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              FlashFX Free Tier — What You Actually Get
            </h3>
            <div className="space-y-3">
              {trulyFreeChecklist.map(({ item, free }) => (
                <div key={item} className="flex items-start gap-3 px-4 py-3 border border-fx-border rounded-card bg-fx-bg-base">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" aria-hidden="true" />
                  <span className="text-sm text-fx-text-primary">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-display text-xl font-bold text-fx-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              Common "Free" Tricks to Watch Out For
            </h3>
            <div className="space-y-3">
              {commonTricks.map(({ trick, example }) => (
                <div key={trick} className="flex items-start gap-3 px-4 py-3 border border-fx-border rounded-card bg-fx-bg-base">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-fx-text-primary">{trick}</p>
                    <p className="text-xs text-fx-text-secondary mt-0.5">{example}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-fx-text-secondary leading-relaxed max-w-3xl"
        >
          FlashFX was built from the ground up to be genuinely free for individual creators. The paid tier adds advanced templates, additional export formats, and priority rendering — but the core workflow, including full-quality export, is and will remain free.
        </motion.p>
      </div>
    </section>
  );
}
