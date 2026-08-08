'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';

/*
 * Preset families and their counts come from
 * components/sections/feature-highlights/animationPresets.ts (90 entries across
 * 17 categories). If that file changes, re-derive these numbers from it.
 *
 * This section owns the `#templates` anchor that the footer links to
 * (/features#templates) — renaming the id breaks that link.
 */
const presetFamilies = [
  { name: 'Position & Movement', count: 13 },
  { name: 'Text Premium', count: 6 },
  { name: 'Text Motion In', count: 6 },
  { name: 'Text Animator', count: 6 },
  { name: 'Scale & Visibility', count: 6 },
  { name: 'Attention & Shake', count: 6 },
  { name: 'Text Reveal', count: 5 },
  { name: 'Text Motion Out', count: 5 },
  { name: 'Text Emphasis', count: 5 },
  { name: 'Rotation', count: 5 },
  { name: 'Killer Buttons', count: 5 },
  { name: 'Timing Macros', count: 4 },
  { name: 'Text Transform', count: 4 },
  { name: 'Shape-Specific', count: 4 },
  { name: 'Overshoot & Energy', count: 4 },
  { name: 'Opacity', count: 4 },
  { name: 'Camera & Global', count: 2 },
];

export function TemplatesSection() {
  return (
    <section id="templates" className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Templates &amp; presets
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Most motion you need already exists as a preset. Drop one onto an element, then
          adjust the keyframes it generates. Nothing is locked, and every preset is a
          starting point rather than a black box.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="flex flex-wrap gap-3">
              {presetFamilies.map((family) => (
                <div
                  key={family.name}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-fx-border rounded-card bg-fx-bg-base"
                >
                  <span className="text-sm text-fx-text-primary">{family.name}</span>
                  <span className="font-mono text-xs" style={{ color: '#f5c842' }}>
                    {family.count}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-fx-text-secondary mt-6">
              90 presets in total, across 17 families.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
