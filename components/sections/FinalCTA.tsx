'use client';

import { motion } from 'framer-motion';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * The closing call to action.
 *
 * The button is the hero's, exactly — same component, same `lg` size, same
 * words. The page opens and closes on the same invitation, which is why this
 * uses `CtaButton` rather than a copy of it: two hand-written copies of a
 * gradient, three shadows and a sheen drift apart within a commit or two.
 *
 * The old copy — "Join thousands of creators who have switched to FlashFX" —
 * is gone with the rest. Worth noting it was also an unverifiable claim about
 * user numbers, of the kind FIX.md's *Canonical facts* exists to keep off the
 * site; the same sentence was removed from `CreatorStories` earlier.
 */
export function FinalCTA() {
  return (
    <section className="relative w-full px-6 py-28 md:py-36 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Now it&rsquo;s your turn,{' '}
          <span style={{ color: '#f5c842' }}>make something beautiful</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-lg md:text-2xl text-fx-text-secondary"
        >
          with FlashFX
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <CtaButton href="https://editor.flashfx.app" size="lg">
            Open the editor, it&rsquo;s free
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
