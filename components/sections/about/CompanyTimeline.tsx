'use client';

import { motion } from 'framer-motion';

const milestones = [
  {
    date: '1 January 2024',
    title: 'FlashFX is founded',
    description:
      'Gabriele Bolognese founds FlashFX and begins building it in Rovigo, in the Veneto region of Italy. He is fifteen.',
  },
  {
    date: 'January 2026',
    title: 'Aziz joins as co-founder',
    description:
      'Two years in, FlashFX stops being a one-person project.',
  },
  {
    date: 'Today',
    title: '8,000 users and a 3,400-member Discord',
    description:
      'FlashFX is used by 8,000 people, and 3,400 of them are in the community Discord.',
  },
];

export function CompanyTimeline() {
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
          How It Has Gone So Far
        </motion.h2>

        <ol className="space-y-8">
          {milestones.map((milestone, index) => (
            <motion.li
              key={milestone.date}
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
                <p className="mono-accent text-sm mb-1">{milestone.date}</p>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">
                  {milestone.title}
                </h3>
                <p className="text-fx-text-secondary leading-relaxed">{milestone.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
