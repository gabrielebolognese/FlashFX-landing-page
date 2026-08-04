'use client';

import { motion } from 'framer-motion';

const useCases = [
  {
    creatorType: 'YouTubers, social media creators, students',
    bestChoice: 'FlashFX',
    reason: 'Free, fast, no installation required, templates built-in for common use cases like intros, outros, and lower thirds',
    highlighted: true,
  },
  {
    creatorType: 'Professional motion designers, studio freelancers',
    bestChoice: 'After Effects',
    reason: 'Industry-standard tool with deep plugin ecosystem, advanced compositing features, and client deliverables compatibility',
    highlighted: false,
  },
  {
    creatorType: 'Beginners learning motion graphics',
    bestChoice: 'FlashFX',
    reason: 'Lower barrier to entry, immediate results without weeks of tutorial watching, no subscription risk while learning',
    highlighted: true,
  },
];

export function UseCaseMatrix() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-8 md:mb-12"
        >
          Which Tool Is Right for You?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary mb-12 max-w-4xl leading-relaxed"
        >
          Choosing between FlashFX and After Effects depends on your specific needs, budget, and skill level. Both tools have legitimate use cases, and the right choice varies based on your creative goals and professional requirements. Here is an honest breakdown to help you make an informed decision.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-fx-bg-base border border-fx-border rounded-card">
            <thead>
              <tr className="border-b border-fx-border">
                <th scope="col" className="px-4 md:px-6 py-4 text-left font-mono text-sm md:text-base text-fx-text-primary">
                  Creator Type
                </th>
                <th scope="col" className="px-4 md:px-6 py-4 text-left font-mono text-sm md:text-base text-fx-text-primary">
                  Best Choice
                </th>
                <th scope="col" className="px-4 md:px-6 py-4 text-left font-mono text-sm md:text-base text-fx-text-primary">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {useCases.map((useCase, index) => (
                <tr
                  key={useCase.creatorType}
                  className={index !== useCases.length - 1 ? 'border-b border-fx-border' : ''}
                >
                  <td className="px-4 md:px-6 py-4 text-sm md:text-base text-fx-text-primary font-medium">
                    {useCase.creatorType}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm md:text-base">
                    <span
                      className={`font-bold ${
                        useCase.highlighted ? 'text-fx-accent-yellow' : 'text-fx-text-primary'
                      }`}
                    >
                      {useCase.bestChoice}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm md:text-base text-fx-text-secondary leading-relaxed">
                    {useCase.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-fx-text-secondary leading-relaxed mt-8"
        >
          This recommendation matrix is based on real-world feedback from creators who have used both tools. FlashFX is not trying to replace After Effects for every use case. Professional studios and VFX artists working on complex commercial projects will still benefit from After Effects advanced feature set. However, for the majority of creators who need fast, accessible{' '}
          <a href="/free-motion-graphics-software" className="text-fx-accent-blue hover:underline">
            free motion graphics tools
          </a>{' '}
          for YouTube content, social media videos, and personal projects, FlashFX delivers the essential features without the complexity, cost, or system requirements.
        </motion.p>
      </div>
    </section>
  );
}
