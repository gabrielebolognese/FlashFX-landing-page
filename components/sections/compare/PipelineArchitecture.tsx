'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/fx-card';
import { pipelines } from './comparisonData';

export function PipelineArchitecture() {
  return (
    <section id="architecture" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          How each one renders
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Most of the differences below follow from these three pipelines. Where a tool is
          strong or weak is usually predictable from its architecture rather than from how
          hard anyone worked on it.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pipelines.map((pipeline, i) => (
            <motion.div
              key={pipeline.product}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                variant={pipeline.product === 'FlashFX' ? 'highlighted' : 'default'}
                className="h-full"
              >
                <h3 className="font-display text-xl font-bold text-fx-text-primary mb-1">
                  {pipeline.product}
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider mb-5" style={{ color: '#f5c842' }}>
                  {pipeline.kind}
                </p>

                <ol className="mb-6">
                  {pipeline.stages.map((stage, stageIndex) => (
                    <li key={stage}>
                      <span className="block font-mono text-xs text-fx-text-secondary leading-relaxed">
                        {stage}
                      </span>
                      {stageIndex < pipeline.stages.length - 1 && (
                        <ArrowDown
                          className="w-3 h-3 my-1 text-fx-text-secondary opacity-40"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  ))}
                </ol>

                <ul className="space-y-3 pt-5 border-t border-fx-border">
                  {pipeline.consequences.map((consequence) => (
                    <li
                      key={consequence}
                      className="text-sm text-fx-text-secondary leading-relaxed pl-4 relative"
                    >
                      <span
                        className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                      />
                      {consequence}
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
