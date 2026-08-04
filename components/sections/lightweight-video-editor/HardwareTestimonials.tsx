'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I have a 2015 Acer laptop with 4 GB RAM and a Celeron processor. After Effects laughed at me. DaVinci Resolve wouldn't install. FlashFX just opened in Chrome and I was editing my first YouTube intro in 10 minutes.",
    author: 'Marcus T.',
    context: 'YouTube creator · Acer Aspire E15 (2015) · 4 GB RAM',
  },
  {
    quote: "I'm a teacher in a rural school and our computer lab runs Windows 7 machines with 2 GB RAM. FlashFX is the only motion graphics tool I could find that ran on every single computer without any installation or IT help.",
    author: 'Sandra K.',
    context: 'High school teacher · Windows 7 lab machines · 2 GB RAM',
  },
  {
    quote: "I was using CapCut until it started crashing on my old Dell Inspiron. FlashFX uses half the memory and I've never had it crash mid-project. For someone on a budget laptop this is the real deal.",
    author: 'Priya M.',
    context: 'Freelance content creator · Dell Inspiron 3000 · 4 GB RAM',
  },
  {
    quote: "My Chromebook is my only computer. I tried three 'browser-based editors' that all required downloading native apps or wouldn't export without premium accounts. FlashFX actually works. No tricks.",
    author: 'Leo R.',
    context: 'Student creator · Lenovo Chromebook Duet · 4 GB RAM',
  },
  {
    quote: "I do social media for small businesses on a side hustle. The machines my clients use are ancient. Being able to create and share a FlashFX project link that they can review from any browser is a complete game changer.",
    author: 'Daniella W.',
    context: 'Social media manager · Various client hardware',
  },
  {
    quote: "I edit on a 2013 MacBook Pro with 4 GB RAM that Apple has officially abandoned. FlashFX runs great in Safari. Most modern editors won't even install on this OS version.",
    author: 'Oliver C.',
    context: 'Independent filmmaker · MacBook Pro 2013 · 4 GB RAM · macOS High Sierra',
  },
];

export function HardwareTestimonials() {
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
            Creators Using FlashFX on Low-Spec Hardware
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            These are real accounts from FlashFX users creating professional content on hardware that mainstream video editing software cannot run on.
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
