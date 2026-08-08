'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAmbient } from '@/lib/motion';

/*
 * "Inspired from the best" — four tools cabled into FlashFX.
 *
 * Built on `AllOnWeb`'s shape, as asked: a full-bleed section with a heading
 * over a field of logos rather than a card in a column. Four here instead of
 * nine, each much larger, and each wired to the centre.
 *
 * ── The cables ──────────────────────────────────────────────────────────────
 *
 * Not straight lines. Each is a cubic whose control points hang below its own
 * endpoints, so the cable sags the way a real one does and arrives at the centre
 * from underneath. A straight line between two logos reads as a diagram of a
 * relationship; a cable that droops and plugs in reads as these tools being
 * *wired into* the thing in the middle, which is the claim.
 *
 * A pulse runs each cable inward on `animateMotion`, so the direction is
 * unmistakable: everything flows toward FlashFX, never out of it.
 *
 * ── The logos are placeholders ──────────────────────────────────────────────
 *
 * Premiere Pro, CapCut, Figma and Rive are the four. Their marks are not in the
 * repo, so browser icons stand in for now — `SOURCES` is the only thing to edit
 * when the real ones land, and nothing else in this file needs to change.
 */

const SOURCES = [
  { name: 'Premiere Pro', trait: 'depth', placeholder: 'edge', angle: 200 },
  { name: 'CapCut', trait: 'speed', placeholder: 'chrome', angle: 250 },
  { name: 'Figma', trait: 'the canvas', placeholder: 'firefox', angle: 290 },
  { name: 'Rive', trait: 'interaction', placeholder: 'opera', angle: 340 },
];

/* The viewBox the cables are drawn in. Kept square-ish so the sag reads the
   same however the section is proportioned. */
const VB = { w: 1000, h: 460 };
const CENTRE = { x: VB.w / 2, y: VB.h * 0.72 };

/** Where each logo sits, spread across the top of the frame. */
function seatOf(i: number, total: number) {
  const spread = 0.86;
  const x = VB.w * ((0.5 - spread / 2) + (spread * i) / (total - 1));
  // Outer two sit slightly higher, so the row arcs rather than ruling a line.
  const lift = Math.abs(i - (total - 1) / 2) / ((total - 1) / 2);
  return { x, y: VB.h * (0.2 - lift * 0.06) };
}

/**
 * A sagging cable from a logo down into the centre.
 *
 * Both control points hang *below* the straight line between the two ends —
 * that is what produces the droop. The second is pulled under the centre so the
 * cable turns upward as it arrives and plugs in from beneath.
 */
function cablePath(from: { x: number; y: number }) {
  const dx = CENTRE.x - from.x;
  const sag = 90 + Math.abs(dx) * 0.16;
  return `M${from.x},${from.y} C${from.x + dx * 0.15},${from.y + sag} ${CENTRE.x - dx * 0.22},${CENTRE.y + sag * 0.5} ${CENTRE.x},${CENTRE.y}`;
}

export function InspiredFrom() {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: 1 });
  /* Hovering a source lights its cable and dims the rest, so four feeds into one
     socket can be read one at a time instead of only as a bundle. */
  const [focus, setFocus] = useState<number | null>(null);

  return (
    <section id="inspired" className="relative w-full py-20 md:py-28 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Inspired from <span style={{ color: '#f5c842' }}>the best</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 px-6 text-center text-base md:text-lg text-fx-text-secondary max-w-2xl mx-auto"
      >
        The speed of CapCut, the depth of Premiere Pro, the way Figma treats a canvas,
        and what Rive does with interaction. All of it wired into one editor.
      </motion.p>

      <div ref={ref} className="relative w-full mt-10 md:mt-14 max-w-6xl mx-auto px-4">
        <div className="relative w-full" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          {/* Cables sit behind everything; the logos and the mark are DOM on
              top, so their images stay crisp. */}
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="fx-cable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245,197,24,0.15)" />
                <stop offset="100%" stopColor="rgba(245,197,24,0.75)" />
              </linearGradient>
            </defs>

            {SOURCES.map((s, i) => {
              const seat = seatOf(i, SOURCES.length);
              const d = cablePath(seat);
              return (
                <g key={s.name}>
                  {/* Casing under the lit core: two strokes make a cable read as
                      a cable rather than a drawn line. */}
                  <path
                    d={d}
                    fill="none"
                    stroke="#0b1230"
                    strokeWidth={9}
                    strokeLinecap="round"
                    opacity={focus === null || focus === i ? 0.9 : 0.25}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={focus === i ? '#F5C518' : 'url(#fx-cable)'}
                    strokeWidth={focus === i ? 5 : 3.5}
                    strokeLinecap="round"
                    opacity={focus === null || focus === i ? 1 : 0.2}
                    style={{ transition: 'stroke-width 200ms, opacity 200ms' }}
                  />
                  {/* The pulse. Travelling the path itself means it follows every
                      bend exactly, with no second copy of the curve to keep in
                      step. */}
                  {active &&
                    (focus === i ? [0, 1, 2] : [0]).map((k) => (
                      <circle key={k} r={focus === i ? 6 : 4.5} fill="#F5C518" opacity={focus === null || focus === i ? 1 : 0.15}>
                        <animateMotion
                          dur={focus === i ? '1.5s' : '2.6s'}
                          begin={`${i * 0.55 + k * 0.5}s`}
                          repeatCount="indefinite"
                          path={d}
                        />
                      </circle>
                    ))}
                </g>
              );
            })}

            {/* The socket the cables plug into. */}
            <circle cx={CENTRE.x} cy={CENTRE.y} r={46} fill="rgba(245,197,24,0.10)" />
            <circle cx={CENTRE.x} cy={CENTRE.y} r={46} fill="none" stroke="rgba(245,197,24,0.45)" strokeWidth={2} />
          </svg>

          {/* The four sources. */}
          {SOURCES.map((s, i) => {
            const seat = seatOf(i, SOURCES.length);
            return (
              <motion.div
                key={s.name}
                /*
                  No `flex-col` here, and the labels below are out of flow. With
                  them in it, this box was as tall as the tile *plus* both lines
                  of text, so `-translate-y-1/2` centred that whole column on the
                  cable's endpoint and left the tile floating above it. The box
                  is exactly the tile now, so the tile is what gets centred.
                */
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(seat.x / VB.w) * 100}%`, top: `${(seat.y / VB.h) * 100}%` }}
                initial={{ opacity: 0, y: -14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                onMouseEnter={() => setFocus(i)}
                onMouseLeave={() => setFocus(null)}
              >
                <motion.div
                  className="relative rounded-2xl flex items-center justify-center"
                  style={{
                    width: 'clamp(64px, 11vw, 124px)',
                    height: 'clamp(64px, 11vw, 124px)',
                    background: 'rgba(20, 31, 64, 0.9)',
                    border: `1px solid ${focus === i ? '#F5C518' : 'rgba(245,197,24,0.28)'}`,
                    boxShadow: focus === i
                      ? '0 16px 50px -12px rgba(245,197,24,0.7)'
                      : '0 12px 40px -14px rgba(245,197,24,0.4)',
                    cursor: 'pointer',
                    transition: 'border-color 200ms, box-shadow 200ms',
                  }}
                  animate={active ? { y: [0, -7, 0], scale: focus === i ? 1.07 : 1 } : { y: 0, scale: focus === i ? 1.07 : 1 }}
                  transition={
                    active
                      ? { duration: 4 + i * 0.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: i * 0.3 }
                      : { duration: 0.4 }
                  }
                >
                  <Image
                    src={`/browsers/${s.placeholder}.webp`}
                    alt={`${s.name} logo`}
                    width={120}
                    height={120}
                    className="w-[62%] h-[62%] object-contain"
                  />
                </motion.div>

                {/* Absolute, so the name and trait hang under the tile without
                    adding to the box that gets centred. */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 flex flex-col items-center pointer-events-none">
                  <span
                    className="font-mono text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap"
                    style={{ color: 'rgba(230,237,243,0.72)' }}
                  >
                    {s.name}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] whitespace-nowrap" style={{ color: '#f5c842' }}>
                    {s.trait}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* FlashFX, where every cable ends. */}
          <motion.div
            /* Same correction as the sources: the wordmark below is out of flow
               so the socket lines up with the tile rather than with the tile and
               its caption together. */
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: `${(CENTRE.y / VB.h) * 100}%` }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: 'clamp(72px, 12vw, 140px)',
                height: 'clamp(72px, 12vw, 140px)',
                background: 'rgba(20, 31, 64, 0.96)',
                border: '2px solid #f5c842',
              }}
              animate={active ? { boxShadow: ['0 0 30px rgba(245,197,24,0.3)', '0 0 60px rgba(245,197,24,0.6)', '0 0 30px rgba(245,197,24,0.3)'] } : {}}
              transition={active ? { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
            >
              <Image src="/android-chrome-192x192.png" alt="FlashFX" width={140} height={140} className="w-[64%] h-[64%] object-contain rounded-lg" />
            </motion.div>
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 text-lg sm:text-2xl whitespace-nowrap pointer-events-none"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.02em', color: '#f5c842' }}
            >
              FlashFX
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
