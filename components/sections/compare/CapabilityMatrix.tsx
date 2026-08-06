'use client';

import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { capabilities } from './comparisonData';

/*
 * Presence, not performance. An absent capability is rendered as a visibly
 * empty cell rather than omitted — per the source document, "a capability
 * matrix with empty cells left visibly empty" is the honest artifact, and that
 * cuts in every direction here: FlashFX has empty cells too.
 */
function Cell({ has }: { has: boolean }) {
  return (
    <td className="px-4 py-3 text-center">
      {has ? (
        <>
          <Check className="w-4 h-4 inline-block text-green-400" aria-hidden="true" />
          <span className="sr-only">Yes</span>
        </>
      ) : (
        <>
          <Minus className="w-4 h-4 inline-block text-fx-text-secondary opacity-40" aria-hidden="true" />
          <span className="sr-only">No</span>
        </>
      )}
    </td>
  );
}

export function CapabilityMatrix() {
  return (
    <section id="capability-matrix" className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-6"
        >
          What exists in which
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed mb-12"
        >
          Presence or absence of a feature, not how fast it runs. The empty cells are the
          point, and all three columns have them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto border border-fx-border rounded-card bg-fx-bg-surface"
        >
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Feature availability across FlashFX, CapCut and DaVinci Resolve
            </caption>
            <thead>
              <tr className="border-b border-fx-border">
                <th scope="col" className="px-4 py-4 text-left font-medium text-fx-text-secondary uppercase tracking-wider text-xs">
                  Capability
                </th>
                <th scope="col" className="px-4 py-4 text-center font-display text-base" style={{ color: '#f5c842' }}>
                  FlashFX
                </th>
                <th scope="col" className="px-4 py-4 text-center font-display text-base text-fx-text-primary">
                  CapCut
                </th>
                <th scope="col" className="px-4 py-4 text-center font-display text-base text-fx-text-primary">
                  Resolve
                </th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((row) => (
                <tr key={row.capability} className="border-b border-fx-border last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="block text-fx-text-primary">{row.capability}</span>
                    {row.note && (
                      <span className="block text-xs text-fx-text-secondary mt-0.5">{row.note}</span>
                    )}
                  </th>
                  <Cell has={row.flashfx} />
                  <Cell has={row.capcut} />
                  <Cell has={row.resolve} />
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
