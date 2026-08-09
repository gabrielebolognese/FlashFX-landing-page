'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAmbient } from '@/lib/motion';

/*
 * "Inspired from the best" — four tools cabled into FlashFX.
 *
 * Built on `AllOnWeb`'s shape: a full-bleed section with a heading over a field
 * of logos rather than a card in a column. Four here instead of nine, each much
 * larger, and each wired to the centre.
 *
 * ── The cables ──────────────────────────────────────────────────────────────
 *
 * Not straight lines. Each is a cubic whose control points hang below its own
 * endpoints, so the cable sags the way a real one does and arrives at the centre
 * from underneath. A straight line between two logos reads as a diagram of a
 * relationship; a cable that droops and plugs in reads as these tools being
 * *wired into* the thing in the middle, which is the claim.
 *
 * ── Why every logo is wrapped twice ─────────────────────────────────────────
 *
 * This is the one thing in the file that must not be simplified.
 *
 * The outer div does the centring, with a plain inline transform. The inner
 * `motion.div` does the reveal and the float. They cannot be the same element:
 * framer-motion writes `transform` inline, so animating `y` or `scale` on the
 * element that also carries `-translate-x-1/2 -translate-y-1/2` silently
 * discards the centring and positions the logo by its top-left corner instead.
 *
 * That is exactly why these sat off the cable ends — not by a few pixels, but by
 * half a logo in each direction. Splitting the two jobs across two elements is
 * the fix, and merging them back reintroduces it.
 *
 * ── The logos are placeholders ──────────────────────────────────────────────
 *
 * Premiere Pro, CapCut, Figma and Rive are the four. Their marks are not in the
 * repo, so browser icons stand in — `SOURCES` is the only thing to edit when the
 * real ones land.
 */

const SOURCES = [
  { name: 'Premiere Pro', trait: 'depth', placeholder: 'edge' },
  { name: 'CapCut', trait: 'speed', placeholder: 'chrome' },
  { name: 'Figma', trait: 'the canvas', placeholder: 'firefox' },
  { name: 'Rive', trait: 'interaction', placeholder: 'opera' },
];

const VB = { w: 1000, h: 460 };
const CENTRE = { x: VB.w / 2, y: VB.h * 0.72 };

/** Where each logo sits, spread across the top of the frame. */
function seatOf(i: number, total: number) {
  const spread = 0.86;
  const x = VB.w * (0.5 - spread / 2 + (spread * i) / (total - 1));
  // Outer two sit slightly higher, so the row arcs rather than ruling a line.
  const lift = Math.abs(i - (total - 1) / 2) / ((total - 1) / 2);
  return { x, y: VB.h * (0.2 - lift * 0.06) };
}

function cablePath(from: { x: number; y: number }) {
  const dx = CENTRE.x - from.x;
  const sag = 90 + Math.abs(dx) * 0.16;
  return `M${from.x},${from.y} C${from.x + dx * 0.15},${from.y + sag} ${CENTRE.x - dx * 0.22},${CENTRE.y + sag * 0.5} ${CENTRE.x},${CENTRE.y}`;
}

export function InspiredFrom() {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: 1 });
  /* Hovering a source lights its cable and dims the rest, so four feeds into one
     socket can be read one at a time rather than only as a bundle. */
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
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="fx-cable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245,197,24,0.18)" />
                <stop offset="100%" stopColor="rgba(245,197,24,0.8)" />
              </linearGradient>
            </defs>

            {SOURCES.map((s, i) => {
              const d = cablePath(seatOf(i, SOURCES.length));
              const lit = focus === null || focus === i;
              return (
                <g key={s.name}>
                  <path d={d} fill="none" stroke="#0b1230" strokeWidth={9} strokeLinecap="round" opacity={lit ? 0.9 : 0.2} />
                  <path
                    d={d}
                    fill="none"
                    stroke={focus === i ? '#F5C518' : 'url(#fx-cable)'}
                    strokeWidth={focus === i ? 5 : 3.5}
                    strokeLinecap="round"
                    opacity={lit ? 1 : 0.18}
                    style={{ transition: 'stroke-width 200ms, opacity 200ms' }}
                  />
                  {/* Pulses travel the path itself, so they follow every bend
                      with no second copy of the curve to keep in step. */}
                  {active &&
                    (focus === i ? [0, 1, 2] : [0]).map((k) => (
                      <circle key={k} r={focus === i ? 6 : 4.5} fill="#F5C518" opacity={lit ? 1 : 0.12}>
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

            {/* A faint halo where the cables converge, so the plug point reads
                even before the mark loads. */}
            <circle cx={CENTRE.x} cy={CENTRE.y} r={54} fill="rgba(245,197,24,0.07)" />
          </svg>

          {/* ── The four sources: bare logos, no tiles ─────────────────────
              Outer div centres. Inner motion.div animates. See the note at the
              top of the file before combining them. */}
          {SOURCES.map((s, i) => {
            const seat = seatOf(i, SOURCES.length);
            return (
              <div
                key={s.name}
                className="absolute"
                style={{
                  left: `${(seat.x / VB.w) * 100}%`,
                  top: `${(seat.y / VB.h) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setFocus(i)}
                onMouseLeave={() => setFocus(null)}
              >
                <motion.div
                  className="relative cursor-pointer"
                  style={{ width: 'clamp(58px, 9.5vw, 112px)', height: 'clamp(58px, 9.5vw, 112px)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ scale: focus === i ? 1.12 : 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={`/browsers/${s.placeholder}.webp`}
                    alt={`${s.name} logo`}
                    width={140}
                    height={140}
                    className="w-full h-full object-contain"
                    style={{
                      // The glow replaces the tile that used to be here: it
                      // separates the mark from the field without drawing a box
                      // around something that is already a shape.
                      filter:
                        focus === i
                          ? 'drop-shadow(0 0 26px rgba(245,197,24,0.75))'
                          : 'drop-shadow(0 8px 22px rgba(0,0,0,0.55))',
                      transition: 'filter 220ms',
                    }}
                  />
                </motion.div>

                {/* Out of flow, so the caption never enters the box being
                    centred and its length cannot move the logo. */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center pointer-events-none">
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
              </div>
            );
          })}

          {/* ── FlashFX, where every cable ends ───────────────────────────── */}
          <div
            className="absolute"
            style={{ left: '50%', top: `${(CENTRE.y / VB.h) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="relative"
              style={{ width: 'clamp(76px, 12.5vw, 148px)', height: 'clamp(76px, 12.5vw, 148px)' }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={
                  active
                    ? { boxShadow: ['0 0 34px rgba(245,197,24,0.35)', '0 0 72px rgba(245,197,24,0.65)', '0 0 34px rgba(245,197,24,0.35)'] }
                    : { boxShadow: '0 0 40px rgba(245,197,24,0.4)' }
                }
                transition={active ? { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
              />
              <Image
                src="/android-chrome-192x192.png"
                alt="FlashFX"
                width={160}
                height={160}
                className="relative w-full h-full object-contain rounded-2xl"
              />
            </motion.div>

            <span
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 text-lg sm:text-2xl whitespace-nowrap pointer-events-none"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.02em', color: '#f5c842' }}
            >
              FlashFX
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
