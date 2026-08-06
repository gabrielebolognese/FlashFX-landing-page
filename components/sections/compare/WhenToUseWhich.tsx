'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';
import { whenToUse } from './comparisonData';

export function WhenToUseWhich() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Which one to reach for
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          These are three different jobs. Picking by benchmark score would be the wrong way
          to choose between them.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {whenToUse.map((verdict, i) => (
            <motion.div
              key={verdict.product}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                variant={verdict.product === 'FlashFX' ? 'highlighted' : 'default'}
                className="h-full"
              >
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">
                  {verdict.product}
                </h3>
                <ul className="space-y-3">
                  {verdict.useWhen.map((reason) => (
                    <li
                      key={reason}
                      className="text-sm text-fx-text-secondary leading-relaxed pl-4 relative"
                    >
                      <span
                        className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                      />
                      {reason}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
