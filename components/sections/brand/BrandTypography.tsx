'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';
import { brandFonts } from './brandAssets';

export function BrandTypography() {
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
          Type
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Three families, all available on Google Fonts. Inter sets every heading, a geometric
          sans carries reading and UI, and a monospace handles anything numeric.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandFonts.map((font, i) => (
            <motion.div
              key={font.variable}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="h-full">
                <p
                  className="text-4xl md:text-5xl text-fx-text-primary mb-5"
                  style={{ fontFamily: `var(${font.variable}), sans-serif` }}
                >
                  Aa Bb Cc 123
                </p>
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-2">
                  {font.name}
                </h3>
                <p className="text-sm text-fx-text-secondary leading-relaxed mb-3">{font.role}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-fx-text-secondary">
                  <span>Weights: {font.weights}</span>
                  <span className="break-all">{font.variable}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
