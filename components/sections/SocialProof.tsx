'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    text: 'FlashFX cut my workflow time in half. Finally, a tool that just works.',
  },
  {
    name: 'Marcus Johnson',
    initials: 'MJ',
    text: 'No more render queues. I create and export in real-time now.',
  },
  {
    name: 'Elena Rodriguez',
    initials: 'ER',
    text: 'Perfect for YouTube creators who need quick, professional results.',
  },
];

export function SocialProof() {
  return (
    <section className="relative w-full px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-4xl font-bold text-fx-text-primary text-center mb-16"
        >
          Trusted by Creators
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex gap-4"
            >
              <div
                className="w-12 h-12 rounded-full bg-fx-accent-yellow/15 border border-fx-accent-yellow/30 flex items-center justify-center flex-shrink-0"
                aria-label={`${testimonial.name} avatar`}
              >
                <span className="text-fx-accent-yellow font-mono font-medium">
                  {testimonial.initials}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-fx-text-secondary italic">
                  {testimonial.text}
                </p>
                <p className="text-fx-text-primary font-medium text-sm">
                  {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
