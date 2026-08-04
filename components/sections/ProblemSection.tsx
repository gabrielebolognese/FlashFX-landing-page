'use client';

import { motion } from 'framer-motion';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

const problems = [
  {
    title: 'Too Complex',
    description: 'Professional tools have steep learning curves. You spend more time learning than creating.',
  },
  {
    title: 'Too Expensive',
    description: 'Monthly subscriptions add up. Quality motion graphics should not break the bank.',
  },
  {
    title: 'Too Slow',
    description: 'Heavy software demands powerful hardware. Rendering takes forever on most machines.',
  },
];

export function ProblemSection() {
  return (
    <section className="relative w-full">
      <HeroGeometric
        badge="The Problem"
        title1="Studio Tools"
        title2="Hold You Back"
        description="Traditional motion graphics software wasn't designed for modern creators"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: "easeOut"
              }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  className="mb-3"
                >
                  <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors">
                    {problem.title}
                  </h3>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                  className="text-white/50 leading-relaxed text-sm"
                >
                  {problem.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </HeroGeometric>
    </section>
  );
}
