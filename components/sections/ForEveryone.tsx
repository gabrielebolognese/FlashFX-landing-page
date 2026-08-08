'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAmbient } from '@/lib/motion';
import { CtaButton } from '@/components/ui/cta-button';
import { EDITOR_URL } from '@/lib/editor';

/*
 * "Both for beginners and experts" — the two-audience card.
 *
 * Sits immediately before "Edit in plain English", because the beginner card
 * promises *describe and go* and the very next section is the demonstration of
 * exactly that. The order is the argument.
 *
 * ── One governor slot for both cards ────────────────────────────────────────
 *
 * The section registers with `useAmbient` once and hands `active` to both
 * scenes. Registering each card separately would let one desk keep moving while
 * the other froze, which reads as a bug rather than as a budget being spent —
 * and one section holding one slot is the accounting the governor is built for.
 */
const LaptopScene = dynamic(() => import('@/components/demos/Workstations').then((m) => m.LaptopScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
const TowerScene = dynamic(() => import('@/components/demos/Workstations').then((m) => m.TowerScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

const CARDS = [
  {
    tag: 'Beginners',
    copy: 'Make your first animations in seconds. Describe and go!',
    /* Warm against the cool one, so the pair reads as two doors rather than two
       of the same thing. */
    tint: 'rgba(245, 197, 24, 0.13)',
    edge: 'rgba(245, 197, 24, 0.34)',
    glow: 'rgba(245, 197, 24, 0.16)',
    accent: '#F5C518',
  },
  {
    tag: 'Experts',
    copy: 'Total technical depth and personalisation, to unleash your full creative potential.',
    tint: 'rgba(124, 92, 191, 0.15)',
    edge: 'rgba(124, 92, 191, 0.4)',
    glow: 'rgba(124, 92, 191, 0.2)',
    accent: '#A98BE8',
  },
] as const;

export function ForEveryone() {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: 2 });

  return (
    <section id="for-everyone" className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Both for beginners{' '}
          <span style={{ color: '#f5c842' }}>and experts</span>
        </motion.h2>

        <div ref={ref} className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border overflow-hidden flex flex-col"
              style={{
                background: `linear-gradient(160deg, ${card.tint} 0%, rgba(18, 27, 58, 0.86) 62%)`,
                borderColor: card.edge,
                boxShadow: `0 24px 70px -30px ${card.glow}`,
              }}
            >
              <span
                className="absolute top-5 left-6 z-10 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
                style={{ background: 'rgba(8, 13, 30, 0.6)', color: card.accent }}
              >
                {card.tag}
              </span>

              {/* The desk. Given real height, because a 3D rig needs room to
                  turn without its far corners leaving the card. */}
              <div className="relative w-full h-[300px] sm:h-[360px]">
                {i === 0 ? <LaptopScene active={active} /> : <TowerScene active={active} />}
              </div>

              <p
                className="px-6 sm:px-8 pb-8 pt-2 text-2xl sm:text-3xl leading-snug text-white"
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '-0.025em' }}
              >
                {card.copy}
              </p>
            </motion.div>
          ))}
        </div>

        {/* One button under both cards rather than one each: the two are the same
            product from two directions, and a button on each would ask the
            visitor to pick a side before they have tried anything. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex justify-center"
        >
          <CtaButton href={EDITOR_URL} size="lg">
            Let&rsquo;s try
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
