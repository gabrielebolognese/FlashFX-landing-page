'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/fx-card';

export function PricingComparison() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12 md:mb-16"
        >
          Pricing: FlashFX vs After Effects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card variant="highlighted">
              <h3 className="font-display text-2xl font-bold text-fx-text-primary mb-4">FlashFX</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-4xl font-bold text-fx-accent-yellow">$0</span>
                  <span className="text-fx-text-secondary">/month</span>
                </div>
                <p className="text-sm font-mono text-fx-text-secondary uppercase tracking-wide">Free Tier</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="text-fx-text-secondary">
                  <span className="text-fx-text-primary font-medium">No watermark</span> on exports
                </li>
                <li className="text-fx-text-secondary">
                  <span className="text-fx-text-primary font-medium">Core motion graphics</span> features
                </li>
                <li className="text-fx-text-secondary">
                  <span className="text-fx-text-primary font-medium">Built-in template</span> library
                </li>
                <li className="text-fx-text-secondary">
                  <span className="text-fx-text-primary font-medium">MP4 and WebM</span> export formats
                </li>
                <li className="text-fx-text-secondary">
                  <span className="text-fx-text-primary font-medium">Browser-based</span>, no installation
                </li>
              </ul>
              <p className="text-sm text-fx-text-secondary">
                Paid tier with advanced templates and additional export options available.{' '}
                <Link href="/pricing" className="text-fx-accent-blue hover:underline">
                  Compare pricing
                </Link>
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <h3 className="font-display text-2xl font-bold text-fx-text-primary mb-4">After Effects</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-4xl font-bold text-fx-text-primary">$55.99</span>
                  <span className="text-fx-text-secondary">/month</span>
                </div>
                <p className="text-sm font-mono text-fx-text-secondary uppercase tracking-wide">Standalone</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="text-fx-text-secondary">
                  Creative Cloud subscription required
                </li>
                <li className="text-fx-text-secondary">
                  $59.99/month for All Apps bundle
                </li>
                <li className="text-fx-text-secondary">
                  No free tier or trial without payment details
                </li>
                <li className="text-fx-text-secondary">
                  Requires macOS or Windows installation
                </li>
                <li className="text-fx-text-secondary">
                  16GB RAM and dedicated GPU recommended
                </li>
              </ul>
              <div className="bg-fx-bg-raised border border-fx-border rounded-button px-4 py-3">
                <p className="text-sm text-fx-text-secondary">
                  Annual cost:{' '}
                  <span className="font-mono font-bold text-fx-text-primary">$671/year minimum</span>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-fx-text-secondary leading-relaxed mt-8 text-center"
        >
          For independent creators, the subscription model can be prohibitive. FlashFX provides professional-grade motion graphics capabilities without the recurring financial commitment, making it accessible to students, hobbyists, and emerging content creators who are building their audience and cannot justify enterprise-level software costs.
        </motion.p>
      </div>
    </section>
  );
}
