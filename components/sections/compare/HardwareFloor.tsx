'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';
import { hardwareFloor } from './comparisonData';

export function HardwareFloor() {
  return (
    <section id="hardware" className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          What each one demands of your machine
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          These are published requirements, not our measurements. It is the largest and
          least arguable difference between the three.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hardwareFloor.map((spec, i) => (
            <motion.div
              key={spec.product}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                variant={spec.product === 'FlashFX' ? 'highlighted' : 'default'}
                className="h-full"
              >
                <h3 className="font-display text-lg font-bold text-fx-text-primary mb-3">
                  {spec.product}
                </h3>
                <p
                  className="font-mono text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: '#f5c842' }}
                >
                  {spec.floor}
                </p>
                <p className="text-sm text-fx-text-secondary leading-relaxed mb-5">
                  {spec.detail}
                </p>
                <p className="font-mono text-[0.7rem] text-fx-text-secondary uppercase tracking-wider pt-4 border-t border-fx-border">
                  {spec.source}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
