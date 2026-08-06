'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Open a tab',
    detail:
      'No installer and no account needed to start. The editor loads and you are on a canvas.',
  },
  {
    title: 'Set the canvas',
    detail:
      'Pick your resolution and frame rate. 1920x1080 for a standard upload, 1080x1920 for Shorts — both are just numbers you type, not locked presets.',
  },
  {
    title: 'Build the elements',
    detail:
      'Shapes, text, your logo, imported footage. Text takes per-segment styling and custom fonts, so a single title can mix weights and colours.',
  },
  {
    title: 'Apply a preset, then edit it',
    detail:
      'Drop one of 90 presets onto an element. It generates real keyframes with bezier handles — reshape the motion instead of accepting the default.',
  },
  {
    title: 'Cut to the audio',
    detail:
      'Load your track on its own audio layer and time the animation against the waveform. Fades and per-clip volume are on the same timeline.',
  },
  {
    title: 'Export clean',
    detail:
      'MP4 for the upload, PNG sequence with transparency if the element needs compositing into an edit elsewhere. No watermark either way.',
  },
];

export function YTWorkflow() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12 md:mb-16"
        >
          Building an intro, start to finish
        </motion.h2>

        <ol className="space-y-8">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-5"
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full border border-fx-border bg-fx-bg-surface flex items-center justify-center font-mono text-sm"
                style={{ color: '#f5c842' }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-fx-text-secondary leading-relaxed">{step.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
