'use client';

import { motion } from 'framer-motion';
import { usePageLoaded } from '@/lib/loading-context';

const shorts = [
  { id: 'm0-8jXv6rLU' },
  { id: 'vY80hpTR38I' },
  { id: 'l6YV4xrIhB4' },
  { id: 'WhWVSZ11kuw' },
  { id: 'H6amhANnAPQ' },
];

function ShortEmbed({ id, index, onLoad }: { id: string; index: number; onLoad: () => void }) {
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&fs=0&cc_load_policy=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
      style={{ width: '18vw', height: 'calc(18vw * 16 / 9)' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <iframe
          src={src}
          title={`FlashFX short ${index + 1}`}
          allow="autoplay; encrypted-media"
          onLoad={onLoad}
          style={{
            position: 'absolute',
            top: '-2%',
            left: '-2%',
            width: '104%',
            height: '104%',
            border: 'none',
            pointerEvents: 'none',
            display: 'block',
          }}
        />
      </div>
    </motion.div>
  );
}

export function WhatIsFlashFX() {
  const { markVideoReady } = usePageLoaded();

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#0b1a35' }}>
      <div className="max-w-4xl mx-auto px-6 text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
        >
          <span className="text-white">What is </span>
          <span style={{ color: '#f5c842' }}>FlashFX</span>
          <span className="text-white">?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl font-bold text-white leading-snug"
        >
          FlashFX is a browser based motion graphics tool for social media animations
        </motion.p>
      </div>

      <div className="w-full px-6">
        <div className="flex justify-center gap-4 lg:gap-5">
          {shorts.map((short, i) => (
            <ShortEmbed key={short.id} id={short.id} index={i} onLoad={markVideoReady} />
          ))}
        </div>
      </div>
    </section>
  );
}
