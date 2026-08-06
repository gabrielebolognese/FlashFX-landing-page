'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';

/*
 * This section is the reason the rest of the page is credible. Do not remove it
 * to make room for benchmark numbers — if numbers are ever added, this is where
 * the method goes, not where it disappears from.
 */
export function MeasurementNote() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-8"
        >
          Why there are no speed numbers here
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <p className="text-fx-text-secondary leading-relaxed mb-5">
              We have an internal benchmark framework for exactly this comparison. It predicts
              how FlashFX should perform against both tools across export throughput, playback
              frame rate, seek latency and time-to-result.
            </p>
            <p className="text-fx-text-secondary leading-relaxed mb-5">
              Those are predictions derived from architecture. They have not been measured. So
              they are not on this page, and they will not be until they have been run properly
              — three passes on one machine, median reported, cold GPU, thermals settled, with
              the method published next to the result.
            </p>
            <p className="text-fx-text-secondary leading-relaxed mb-5">
              Benchmarks written by the vendor of one of the products are worth exactly as much
              as their method, and FlashFX being ours makes that standard higher rather than
              lower. Everything above is either how the software is built or a specification
              its publisher has stated — both of which you can check without taking our word
              for it.
            </p>
            <p className="text-fx-text-secondary leading-relaxed">
              When the numbers exist, they will appear here, including the ones we lose. On raw
              codec throughput — long timelines of straight cuts, especially at 4K — a native
              application with direct hardware encoder access should beat a browser tab, and we
              expect it to.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
