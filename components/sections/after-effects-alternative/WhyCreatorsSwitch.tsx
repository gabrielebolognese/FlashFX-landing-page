'use client';

import { motion } from 'framer-motion';

const reasons = [
  {
    stat: '$660+',
    title: 'Cost',
    description: 'After Effects requires a Creative Cloud subscription starting at approximately $55 per month. For independent creators, YouTubers, and students, that translates to an annual commitment of $660 or more before you have exported a single frame. Many creators cannot justify this recurring expense when they only need basic motion graphics capabilities for YouTube intros, social media content, or personal projects.',
  },
  {
    stat: '16GB',
    title: 'System Load',
    description: 'Adobe After Effects officially recommends 16GB of RAM and a dedicated GPU for optimal performance. On mid-range laptops and budget desktop systems, this creates serious workflow problems. Renders stall during playback, previews lag behind real-time editing, and the application frequently crashes when handling complex compositions with multiple layers and effects. For creators working on Chromebooks, older MacBooks, or Windows laptops with integrated graphics, After Effects is simply not a viable option.',
  },
  {
    stat: '40–80 hrs',
    title: 'Learning Curve',
    description: 'The average creator spends between 40 and 80 hours reaching basic proficiency in Adobe After Effects. This includes understanding the interface, learning keyframe animation principles, mastering expression syntax, and navigating the render queue. For someone who needs to create a ten-second YouTube intro or a simple animated logo reveal, this time investment makes no practical sense. FlashFX reduces that timeline to minutes by providing an intuitive interface and pre-built motion templates.',
  },
];

export function WhyCreatorsSwitch() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12 md:mb-16"
        >
          Why Creators Are Leaving After Effects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="mb-4">
                <span className="font-mono text-3xl md:text-4xl font-bold text-fx-accent-yellow">
                  {reason.stat}
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-fx-text-primary mb-3">
                {reason.title}
              </h3>
              <p className="text-fx-text-secondary leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
