'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I had never edited a video in my life. I opened FlashFX on a Wednesday afternoon, watched no tutorials, and had a YouTube intro done in 20 minutes. I was genuinely shocked at how simple it was.",
    author: 'Amara J.',
    context: 'First-time creator · YouTube cooking channel',
  },
  {
    quote: "I teach digital media to 9th graders and needed a tool they could learn in a single 45-minute class period. FlashFX is the only tool that reliably works. Students are exporting real projects by the end of class.",
    author: 'Mr. Hendricks',
    context: 'Digital media teacher · High school · 30 students',
  },
  {
    quote: "Every other tool I tried had a moment early on where I hit a wall and gave up. FlashFX was the first where I never hit that wall. Each step made sense.",
    author: 'Reina C.',
    context: 'Small business owner · Social media self-taught',
  },
  {
    quote: "I was terrified of anything with a timeline. FlashFX's timeline is the first one I actually understood. The handles and keyframes just... made visual sense to me immediately.",
    author: 'Tom B.',
    context: 'Podcast creator branching into video content',
  },
  {
    quote: "I tried Premiere, CapCut, and DaVinci. All of them required me to watch hours of YouTube before I could do anything useful. FlashFX is the first tool where I just figured it out by clicking around.",
    author: 'Sasha V.',
    context: 'Freelance photographer expanding into video',
  },
  {
    quote: "My sister set me up with FlashFX because I wanted to make Instagram Reels for my bakery. I had zero experience. Now I make my own branded animations every week and they look great.",
    author: 'Gloria P.',
    context: 'Small business owner · No prior design experience',
  },
];

export function BeginnerTestimonials() {
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
            From First-Timers to Regular Creators
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            These are accounts from users who had never used video editing software before picking up FlashFX.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ quote, author, context }, index) => (
            <motion.div
              key={author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col gap-4 px-5 py-5 border border-fx-border rounded-card bg-fx-bg-base"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xs" style={{ color: '#f5c842' }} aria-hidden="true">★</span>
                ))}
              </div>
              <p className="text-sm text-fx-text-secondary leading-relaxed flex-1">"{quote}"</p>
              <div>
                <p className="text-sm font-semibold text-fx-text-primary">{author}</p>
                <p className="text-xs text-fx-text-secondary mt-0.5">{context}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
