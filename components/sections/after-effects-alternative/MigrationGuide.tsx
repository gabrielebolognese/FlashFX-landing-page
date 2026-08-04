'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    title: 'Export your existing AE project assets',
    description: 'Begin by exporting all reusable assets from your After Effects projects as individual files. This includes background plates, audio tracks, static graphics, logos, and any other media elements you want to continue using. Save these files in a well-organized folder structure on your local drive so you can easily locate them during the import process.',
  },
  {
    title: 'Open FlashFX in your browser',
    description: 'Navigate to the FlashFX web application using any modern browser. No account creation is required to start exploring the interface and testing basic features. You can begin working immediately without downloading installers, configuring preferences, or managing license activations. FlashFX works on Chrome, Firefox, Safari, and Edge.',
  },
  {
    title: 'Import your assets via drag-and-drop',
    description: 'Once you have opened a new project in FlashFX, simply drag your exported assets from your file manager directly into the FlashFX timeline or media library panel. The application supports common image formats (PNG, JPG, SVG), video formats (MP4, WebM), and audio formats (MP3, WAV). Imports happen instantly with no transcoding delays.',
  },
  {
    title: 'Apply motion presets or build keyframe animations',
    description: 'FlashFX provides a library of pre-built motion presets for common animation patterns like fade-ins, slide transitions, zoom effects, and text reveals. For custom animations, use the visual keyframe editor to define position, scale, rotation, and opacity changes over time. The interface is designed to be intuitive for users familiar with timeline-based editing, so the transition from After Effects feels natural.',
  },
  {
    title: 'Export as MP4 or WebM',
    description: 'When your animation is complete, click the export button and select your preferred format and resolution. FlashFX processes renders in the background without requiring a separate render queue or media encoder application. Exports complete in a fraction of the time compared to After Effects on equivalent hardware. Download your finished file directly to your device or share via a generated link.',
  },
];

export function MigrationGuide() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-8 md:mb-12"
        >
          How to Switch from After Effects to FlashFX
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-12 leading-relaxed"
        >
          Migrating from After Effects to FlashFX is straightforward and does not require abandoning your existing creative assets. Follow these steps to make the transition smoothly and start leveraging FlashFX performance advantages while preserving your previous work.
        </motion.p>
        <ol className="space-y-8">
          {steps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-button bg-fx-accent-yellow flex items-center justify-center">
                  <span className="font-mono font-bold text-fx-bg-base">{index + 1}</span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">{step.title}</h3>
                <p className="text-fx-text-secondary leading-relaxed">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-fx-bg-surface border border-fx-border rounded-card p-6"
        >
          <p className="text-fx-text-secondary leading-relaxed">
            For users who need more advanced capabilities beyond basic motion graphics, explore{' '}
            <Link href="/features" className="text-fx-accent-blue hover:underline">
              all FlashFX features
            </Link>{' '}
            including advanced timeline controls, effect stacking, and collaborative editing. If you are working on a{' '}
            <Link href="/lightweight-video-editor" className="text-fx-accent-blue hover:underline">
              low-end system that struggles with After Effects
            </Link>
            , FlashFX offers a viable path forward without requiring expensive hardware upgrades.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
