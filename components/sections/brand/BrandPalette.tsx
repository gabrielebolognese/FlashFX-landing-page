'use client';

import { motion } from 'framer-motion';
import { brandColors } from './brandAssets';

export function BrandPalette() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          Colour
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          A deep navy base with a single yellow doing the work. Purple and blue are
          supporting accents, not co-primaries.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brandColors.map((color, i) => (
            <motion.div
              key={color.token}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="border border-fx-border rounded-card overflow-hidden bg-fx-bg-surface"
            >
              <div className="h-24 w-full" style={{ backgroundColor: color.hex }} />
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-sm font-medium text-fx-text-primary">{color.name}</span>
                  <span className="font-mono text-xs uppercase" style={{ color: '#f5c842' }}>
                    {color.hex}
                  </span>
                </div>
                <p className="font-mono text-[0.7rem] text-fx-text-secondary mb-2 break-all">
                  {color.token}
                </p>
                <p className="text-xs text-fx-text-secondary leading-relaxed">{color.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
