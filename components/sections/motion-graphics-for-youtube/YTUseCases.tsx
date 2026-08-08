'use client';

import { motion } from 'framer-motion';
import { Play, Radio, Type, Scissors, Smartphone, Clapperboard } from 'lucide-react';
import { Card } from '@/components/ui/fx-card';

/*
 * Each entry maps a YouTube deliverable onto capabilities the site already
 * documents (editorFeatures.ts, animationPresets.ts, PricingSection). Nothing
 * here asserts a YouTube-specific template or preset pack — those do not exist,
 * and claiming them would be the same class of invention M4 removed.
 */
const useCases = [
  {
    title: 'Channel intros',
    description:
      'A three to six second logo animation you reuse on every upload. Build it once from a preset, adjust the keyframes, and export a clean MP4.',
    Icon: Play,
  },
  {
    title: 'End screens',
    description:
      'Animated outros sized to leave room for YouTube subscribe and next-video elements, with your own timing rather than a fixed template.',
    Icon: Clapperboard,
  },
  {
    title: 'Lower thirds',
    description:
      'Name plates and captions that animate in and out. Export as PNG sequence with transparency and drop straight onto your footage.',
    Icon: Type,
  },
  {
    title: 'Shorts',
    description:
      'Vertical 1080x1920 without a separate tool. Text animators reveal by character, word, or line: the pacing short-form needs.',
    Icon: Smartphone,
  },
  {
    title: 'Transitions and stingers',
    description:
      'Short animated wipes between segments, built with masks and easing curves rather than the same three presets every editor uses.',
    Icon: Scissors,
  },
  {
    title: 'Channel trailers',
    description:
      'Longer sequences with imported footage, multi-track audio, and filters: cut against the beat using waveform display on the timeline.',
    Icon: Radio,
  },
];

export function YTUseCases() {
  return (
    <section id="yt-use-cases" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12 md:mb-16"
        >
          What YouTube creators build with it
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => {
            const { Icon } = useCase;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="h-full">
                  <Icon className="w-6 h-6 mb-4 text-fx-accent-yellow" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold text-fx-text-primary mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-fx-text-secondary leading-relaxed">
                    {useCase.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
