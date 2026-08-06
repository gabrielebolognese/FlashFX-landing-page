'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/fx-card';

/*
 * Every factual statement in the boilerplate below comes from FIX.md's
 * Canonical facts: the founding date, the founder and his role, and the product
 * description. Do not add user counts, funding, awards, or metrics here — if a
 * number is not in Canonical facts, it does not go on this page.
 */
const correct = ['FlashFX'];
const incorrect = ['Flash FX', 'FlashFx', 'Flashfx', 'FLASHFX', 'Flash-FX'];

export function BrandNaming() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12"
        >
          Name and boilerplate
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">
                Writing the name
              </h3>
              <p className="text-sm text-fx-text-secondary leading-relaxed mb-6">
                One word. Capital F, capital F and X at the end. No space, no hyphen, and not
                in all caps.
              </p>
              <div className="space-y-2 mb-6">
                {correct.map((form) => (
                  <div key={form} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span className="font-mono text-sm text-fx-text-primary">{form}</span>
                  </div>
                ))}
                {incorrect.map((form) => (
                  <div key={form} className="flex items-center gap-3">
                    <X className="w-4 h-4 text-fx-text-secondary flex-shrink-0" aria-hidden="true" />
                    <span className="font-mono text-sm text-fx-text-secondary line-through">
                      {form}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">
                Boilerplate
              </h3>
              <p className="text-sm text-fx-text-secondary leading-relaxed mb-6">
                Copy this verbatim if you need a standard description:
              </p>
              <blockquote className="border-l-2 border-fx-accent-yellow pl-5 py-1">
                <p className="text-sm text-fx-text-primary leading-relaxed">
                  FlashFX is a browser-based motion graphics and video editing platform, an
                  alternative to After Effects and Premiere Pro. It runs in a tab with no
                  install, and has a free tier. FlashFX was founded on 1 January 2024 by
                  Gabriele Bolognese, its founder and CEO.
                </p>
              </blockquote>
              <p className="text-sm text-fx-text-secondary leading-relaxed mt-6 pt-6 border-t border-fx-border">
                For press enquiries or anything not covered here, reach us on{' '}
                <a
                  href="https://x.com/FlashFXeditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fx-accent-blue hover:underline"
                >
                  X
                </a>
                .
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
