'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * "Can it do procedural animations too? Say less!"
 *
 * Sits under the particle generator, because the two make the same argument from
 * opposite ends: particles are many things behaving by one rule, and this is one
 * thing becoming many by another. Both are animation you describe rather than
 * draw.
 *
 * The claim that FlashFX does procedural animation is owner-confirmed and
 * recorded in FIX.md under *Canonical facts* (2026-08-07). Do not extend it
 * past what is written there.
 */
const ProceduralMorph = dynamic(() => import('@/components/demos/ProceduralMorph').then((m) => m.ProceduralMorph), {
  ssr: false,
  // The section below sizes the slot, so there is nothing to reserve here and
  // nothing shifts when the chunk lands.
  loading: () => <div className="absolute inset-0" />,
});

export function ProceduralAnimation() {
  return (
    <section id="procedural" className="relative w-full py-20 md:py-28 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white max-w-5xl mx-auto"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Can it do procedural animations too?{' '}
        <span style={{ color: '#f5c842' }}>Say less!</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 px-6 text-center text-base md:text-lg text-fx-text-secondary max-w-2xl mx-auto"
      >
        One cube, then four, then a hundred &mdash; and then whatever you point them at.
        Nothing here is keyframed: every shape is a rule, and the animation is what
        happens between them.
      </motion.p>

      {/* Tall and wide: the cloud needs room to turn, and a shape that fills the
          frame at one moment has to survive becoming a wider one at the next. */}
      <div className="relative mt-10 md:mt-14 w-full h-[62vh] min-h-[420px] md:min-h-[560px]">
        <ProceduralMorph />
      </div>

      <div className="mt-10 flex justify-center px-6">
        <CtaButton href="https://editor.flashfx.app" size="md">
          Build one yourself
        </CtaButton>
      </div>
    </section>
  );
}
