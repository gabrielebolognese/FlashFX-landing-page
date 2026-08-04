'use client';

import { motion } from 'framer-motion';
import { Youtube, Instagram, Presentation, Play } from 'lucide-react';
import Link from 'next/link';

const useCases = [
  {
    icon: Youtube,
    title: 'YouTube Intros & Outros',
    description: 'Create branded channel intros, animated name plates, subscribe CTAs, and end screens. FlashFX includes pre-built YouTube-specific templates that you can customize to match your channel branding in minutes.',
    details: [
      'Animated logo reveals',
      'Lower thirds with custom typography',
      'Subscribe button animations',
      'End screen countdown timers',
    ],
    link: '/motion-graphics-software-for-youtube',
    linkText: 'YouTube motion graphics guide',
  },
  {
    icon: Instagram,
    title: 'Social Media Reels & Stories',
    description: 'Export 9:16 vertical animations for Instagram Reels, TikTok, and YouTube Shorts. Motion text overlays, kinetic typography, and transition animations export as clean MP4 files ready for direct upload.',
    details: [
      'Vertical (9:16) project templates',
      'Kinetic text animations',
      'Transition wipes and zooms',
      'Looping background animations',
    ],
    link: '/features',
    linkText: 'Explore all features',
  },
  {
    icon: Presentation,
    title: 'Presentation Animations',
    description: 'Add motion to pitch decks and explainer videos without PowerPoint limitations. Export animated sequences as MP4 for embedding in Keynote, Google Slides, or Notion — or present directly via the browser.',
    details: [
      'Animated chart reveals',
      'Text entrance animations',
      'Icon motion sequences',
      'Section transition animations',
    ],
    link: '/features',
    linkText: 'View feature list',
  },
  {
    icon: Play,
    title: 'Explainer Videos',
    description: 'Build short-form explainer animations for product demos, onboarding sequences, and tutorial intros. The timeline editor gives frame-accurate control over timing without the complexity of After Effects.',
    details: [
      'Character and icon animations',
      'Screen recording overlays',
      'Callout and pointer animations',
      'Text-driven narrative sequences',
    ],
    link: '/after-effects-alternative',
    linkText: 'Compare with After Effects',
  },
];

export function FMGUseCases() {
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
            Use Cases: What You Can Build for Free
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            Free motion graphics software is only valuable if it handles the work you actually need to do. Here is how FlashFX performs across the most common creator use cases.
          </p>
        </motion.div>

        <div className="space-y-6">
          {useCases.map(({ icon: Icon, title, description, details, link, linkText }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid md:grid-cols-[auto_1fr] gap-6 px-6 py-6 border border-fx-border rounded-card bg-fx-bg-base"
            >
              <div className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 bg-fx-bg-raised border border-fx-border">
                <Icon className="w-5 h-5" style={{ color: '#f5c842' }} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">{title}</h3>
                <p className="text-sm text-fx-text-secondary leading-relaxed mb-4">{description}</p>
                <ul className="grid sm:grid-cols-2 gap-1.5 mb-4">
                  {details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-fx-text-secondary">
                      <span className="w-1 h-1 rounded-full bg-fx-text-secondary flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <Link href={link} className="text-xs font-mono underline underline-offset-4 text-fx-text-secondary hover:text-fx-text-primary transition-colors">
                  {linkText} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
