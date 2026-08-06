'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/fx-card';
import { installGuides } from './installSteps';

export function InstallGuide() {
  return (
    <section id="install" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6">
            Installing it
          </h2>
          <p className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed">
            Install{' '}
            <a
              href="https://editor.flashfx.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fx-accent-blue hover:underline font-mono"
            >
              editor.flashfx.app
            </a>{' '}
            rather than this page — the editor is the part worth having in its own window.
            The steps below work on any URL.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {installGuides.map((guide, i) => {
            const { Icon } = guide;
            return (
              <motion.div
                key={guide.browser}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className="w-5 h-5 text-fx-accent-yellow flex-shrink-0" aria-hidden="true" />
                    <h3 className="font-display text-xl font-bold text-fx-text-primary">
                      {guide.browser}
                    </h3>
                  </div>

                  <ol className="space-y-3">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-3">
                        <span
                          className="font-mono text-xs flex-shrink-0 pt-1"
                          style={{ color: '#f5c842' }}
                          aria-hidden="true"
                        >
                          {String(stepIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm text-fx-text-secondary leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>

                  {guide.note && (
                    <p className="text-xs text-fx-text-secondary leading-relaxed mt-5 pt-5 border-t border-fx-border">
                      {guide.note}
                    </p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-fx-text-secondary leading-relaxed mt-10 max-w-3xl"
        >
          An installed page is still the same web app — it updates when we ship, with nothing
          to patch on your side. Removing it is the same as removing any other app, and
          nothing is left behind on disk.
        </motion.p>
      </div>
    </section>
  );
}
