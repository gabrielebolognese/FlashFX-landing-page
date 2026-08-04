'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Open FlashFX in Any Browser',
    description: 'Go to editor.flashfx.app. No account required, no download, no plugin to install. The editor loads in approximately 4 seconds on any device with an internet connection.',
    tip: 'Works on Chrome, Firefox, Safari, and Edge. No account needed to try it.',
  },
  {
    number: '02',
    title: 'Choose a Template or Start Blank',
    description: 'Select from the template library to begin with a pre-built animation — YouTube intro, lower third, social media reel, or presentation graphic — or start with a blank canvas at your preferred resolution.',
    tip: 'For your first project, pick a template. Blank canvas comes later once you know the timeline.',
  },
  {
    number: '03',
    title: 'Edit Text, Colors, and Timing',
    description: 'Click any element on the canvas to select it. Change text content in the properties panel on the right. Adjust colors using the color picker. Drag the timeline handles to change when elements appear and disappear.',
    tip: 'You do not need to touch keyframes on your first project. Text and color changes are all you need.',
  },
  {
    number: '04',
    title: 'Preview Your Animation',
    description: 'Press the spacebar or click the play button in the timeline to preview your animation in real time. What you see in the preview is exactly what will be exported.',
    tip: 'Preview renders at full quality — no separate render step required before export.',
  },
  {
    number: '05',
    title: 'Adjust with Motion Presets',
    description: 'To change how elements enter or exit the screen, click an element and open the Animation tab. Select from presets like Fade In, Slide Up, Scale Pop, or Bounce. The preset applies to that element immediately.',
    tip: 'Each preset can be adjusted — change the duration, delay, and easing curve without writing a single expression.',
  },
  {
    number: '06',
    title: 'Export as MP4',
    description: 'Click the Export button in the top right, select MP4, choose your resolution (720p or 1080p), and click Render. The file downloads directly to your computer. No watermark, no upload queue, no paid plan required.',
    tip: "Your first export will take approximately as long as your animation's duration. A 15-second clip takes about 15 seconds to render.",
  },
];

export function BeginnerWalkthrough() {
  return (
    <section id="beginner-walkthrough" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Your First Animation: Step-by-Step
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            Follow these six steps to create and export your first motion graphic. No prior experience required. This walkthrough takes approximately 15 minutes from start to finished export.
          </p>
        </motion.div>

        <div className="space-y-4">
          {steps.map(({ number, title, description, tip }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid md:grid-cols-[80px_1fr] gap-5 px-6 py-6 border border-fx-border rounded-card bg-fx-bg-surface"
            >
              <div className="flex items-start">
                <span className="font-mono text-4xl font-bold leading-none" style={{ color: '#f5c842', opacity: 0.6 }}>{number}</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">{title}</h3>
                <p className="text-sm text-fx-text-secondary leading-relaxed mb-3">{description}</p>
                <div className="px-4 py-2.5 border border-fx-border rounded-card bg-fx-bg-base">
                  <p className="text-xs font-mono text-fx-text-secondary">
                    <span style={{ color: '#f5c842' }}>Tip:</span> {tip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
