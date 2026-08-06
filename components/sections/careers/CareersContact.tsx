'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/fx-card';

/*
 * Deliberately no JobPosting schema on this page. There are no open roles, and
 * JobPosting markup describing a vacancy that does not exist is exactly the
 * class of fabrication FIX.md M4 removed. Add it when a real role opens.
 */
export function CareersContact() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <h2 className="font-display text-2xl font-bold text-fx-text-primary mb-4">
                Get in touch anyway
              </h2>
              <p className="text-fx-text-secondary leading-relaxed mb-6">
                If you use FlashFX and have thought hard about how it should work, that is
                worth more to us than a CV. Tell us what you would change and why.
              </p>
              <a
                href="mailto:careers@flashfx.app"
                className="font-mono text-lg text-fx-accent-blue hover:underline break-all"
              >
                careers@flashfx.app
              </a>
              <p className="text-sm text-fx-text-secondary leading-relaxed mt-6">
                We read everything. We cannot promise a reply to every message while there is
                nothing open.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <h2 className="font-display text-2xl font-bold text-fx-text-primary mb-4">
                Who is already here
              </h2>
              <p className="text-fx-text-secondary leading-relaxed mb-6">
                Three people, working on a browser-based alternative to After Effects and
                Premiere Pro since 1 January 2024.
              </p>
              <Link href="/about" className="text-fx-accent-blue hover:underline">
                Meet the team
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
