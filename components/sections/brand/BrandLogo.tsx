'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/fx-card';

/*
 * Only the two marks that actually exist in public/ are offered here. There is
 * no SVG, no wordmark, and no lockup — do not add a download link for an asset
 * that is not in the repo. When a vector logo exists, add it to public/ first,
 * then link it.
 */
export function BrandLogo() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12"
        >
          Logo
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full flex flex-col items-center justify-center py-14">
              <Image
                src="/android-chrome-192x192.png"
                alt="The FlashFX logo"
                width={128}
                height={128}
                className="rounded-sm"
              />
              <p className="font-mono text-xs text-fx-text-secondary mt-6 uppercase tracking-wider">
                192 x 192 PNG
              </p>
              <a
                href="/android-chrome-192x192.png"
                download
                className="text-sm font-medium text-fx-accent-blue hover:underline mt-3"
              >
                Download PNG
              </a>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <h3 className="font-display text-xl font-bold text-fx-text-primary mb-4">
                Using it
              </h3>
              <ul className="space-y-3">
                {[
                  'Leave clear space around the mark on all sides — roughly a quarter of its width.',
                  'Place it on the base navy, on white, or on a plain background with enough contrast.',
                  'Do not recolour it, stretch it, rotate it, or add effects.',
                  'Do not place it on a busy image where the mark stops reading.',
                ].map((rule) => (
                  <li
                    key={rule}
                    className="text-sm text-fx-text-secondary leading-relaxed pl-4 relative"
                  >
                    <span
                      className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                    />
                    {rule}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-fx-text-secondary leading-relaxed mt-6 pt-6 border-t border-fx-border">
                A vector version is not available yet. For print or any use above 192 pixels,
                ask us on{' '}
                <a
                  href="https://x.com/FlashFXeditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fx-accent-blue hover:underline"
                >
                  X
                </a>{' '}
                rather than upscaling the PNG.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
