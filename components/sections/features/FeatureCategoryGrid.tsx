'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/fx-card';
import { featureCategories } from './featureCategories';

export function FeatureCategoryGrid() {
  return (
    <section id="capabilities" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12 md:mb-16"
        >
          What is in the editor
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCategories.map((category, i) => {
            const { Icon } = category;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="h-full flex flex-col">
                  <Icon className="w-6 h-6 mb-4 text-fx-accent-yellow" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold text-fx-text-primary mb-3">
                    {category.title}
                  </h3>
                  <p className="text-sm text-fx-text-secondary leading-relaxed mb-5">
                    {category.description}
                  </p>
                  <ul className="space-y-2 mb-5 flex-1">
                    {category.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="text-sm text-fx-text-secondary leading-relaxed pl-4 relative"
                      >
                        <span
                          className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  {category.anchor && (
                    <Link
                      href={category.anchor}
                      className="text-sm font-medium text-fx-accent-blue hover:underline mt-auto"
                    >
                      See it in action
                    </Link>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
