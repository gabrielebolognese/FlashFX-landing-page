'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAmbient } from '@/lib/motion';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * "All on web", with the browsers it runs in scattered around it
 * (immersionmilestones.md I8).
 *
 * The icons start small at the centre, behind the words, and shoot outward to
 * their places — so the claim and the proof arrive as one movement rather than
 * the text saying it and a row of logos sitting there agreeing.
 *
 * ── Second pass ────────────────────────────────────────────────────────────
 *
 * The arrival was the only thing that ever happened here; afterwards it was a
 * still picture. Each icon now drifts on its own slow ellipse, the light behind
 * the title breathes, and hovering one pulls it upright, scales it and lights a
 * glow behind it — see `.fx-browser` in globals.css for why the rotation has to
 * be a custom property.
 *
 * Every value is fixed, never `Math.random()`: random during render differs
 * between the server and client passes and would rescatter on every revisit —
 * the trap P6 pulled out of `background-paths`.
 *
 * Icons are public/browsers/*.webp, converted and squared to 192px from the
 * originals (1060 kB of PNGs down to 55 kB). That source folder is untracked
 * and gitignored.
 */

interface Browser {
  slug: string;
  name: string;
  x: number;
  y: number;
  /** Degrees, within the ±40 the brief asked for. Hover returns it to 0. */
  rotate: number;
  size: number;
  delay: number;
  /** Idle drift: radius in px and seconds per lap. */
  driftX: number;
  driftY: number;
  period: number;
}

/*
 * Placed by hand, not on a circle — an even ring reads as a clock face. Nothing
 * sits in the central column between roughly 30 and 70 percent horizontally
 * across the middle band, which is where the title and button live.
 */
const BROWSERS: Browser[] = [
  { slug: 'chrome', name: 'Chrome', x: 10, y: 22, rotate: -22, size: 88, delay: 0, driftX: 9, driftY: 12, period: 11 },
  { slug: 'firefox', name: 'Firefox', x: 26, y: 11, rotate: 31, size: 74, delay: 0.06, driftX: -11, driftY: 9, period: 13 },
  { slug: 'safari', name: 'Safari', x: 48, y: 13, rotate: -12, size: 68, delay: 0.12, driftX: 8, driftY: -10, period: 9.5 },
  { slug: 'edge', name: 'Edge', x: 70, y: 11, rotate: 24, size: 78, delay: 0.05, driftX: -9, driftY: -12, period: 12 },
  { slug: 'opera', name: 'Opera', x: 88, y: 24, rotate: -35, size: 82, delay: 0.11, driftX: 10, driftY: 8, period: 10.5 },
  { slug: 'brave', name: 'Brave', x: 12, y: 72, rotate: 38, size: 80, delay: 0.09, driftX: -8, driftY: -11, period: 12.5 },
  { slug: 'duckduckgo', name: 'DuckDuckGo', x: 33, y: 86, rotate: -28, size: 72, delay: 0.15, driftX: 11, driftY: -8, period: 10 },
  { slug: 'tor', name: 'Tor Browser', x: 66, y: 85, rotate: 17, size: 76, delay: 0.03, driftX: -10, driftY: 10, period: 14 },
  { slug: 'perplexity', name: 'Perplexity', x: 88, y: 70, rotate: -40, size: 70, delay: 0.17, driftX: 9, driftY: -9, period: 11.5 },
];

export function AllOnWeb() {
  /*
   * The drift is a continuous loop, so it goes through the governor like every
   * other one. Without a grant the icons simply hold their places — which is
   * the composed still frame, not a blank section.
   */
  const { ref, active } = useAmbient<HTMLDivElement>();

  return (
    <section
      id="all-on-web"
      ref={ref}
      className="relative w-full h-[82vh] min-h-[540px] overflow-hidden flex items-center justify-center"
    >
      {/* Light behind the words, breathing. */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[70%] h-[60%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,197,24,0.13) 0%, rgba(45,107,228,0.09) 45%, transparent 72%)',
        }}
        animate={active ? { opacity: [0.65, 1, 0.65], scale: [0.97, 1.04, 0.97] } : { opacity: 0.85, scale: 1 }}
        transition={active ? { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
      />

      {BROWSERS.map((b) => (
        <motion.div
          key={b.slug}
          className="absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, delay: b.delay }}
        >
          {/*
            Flight in. The offset that starts it at the centre is a percentage
            of the *section* — a percentage translate resolves against the
            element's own box, so an 88px icon translated by 40% would move 35px
            rather than across the frame. Hence the outer wrapper.
          */}
          <motion.div
            initial={{ x: `${(50 - b.x) * 8}%`, y: `${(50 - b.y) * 8}%`, scale: 0.15 }}
            whileInView={{ x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, delay: b.delay, ease: [0.16, 1, 0.3, 1] }}
            className="-translate-x-1/2 -translate-y-1/2"
          >
            {/* Idle drift, kept on its own layer so it never fights the
                rotation or the hover scale below it. */}
            <motion.div
              animate={
                active
                  ? { x: [0, b.driftX, 0, -b.driftX * 0.6, 0], y: [0, b.driftY, 0, -b.driftY * 0.7, 0] }
                  : { x: 0, y: 0 }
              }
              transition={
                active
                  ? { duration: b.period, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                  : { duration: 0 }
              }
            >
              <div className="fx-browser-host relative cursor-pointer" title={b.name}>
                <div className="fx-browser-glow absolute -inset-8 rounded-full pointer-events-none" />
                <div
                  className="fx-browser relative"
                  style={{ ['--fx-rot' as string]: `${b.rotate}deg` }}
                >
                  <Image
                    src={`/browsers/${b.slug}.webp`}
                    alt={b.name}
                    width={b.size}
                    height={b.size}
                    className="w-[48px] sm:w-[64px] md:w-auto h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    style={{ maxWidth: b.size }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10 px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          All on <span style={{ color: '#f5c842' }}>web</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          <CtaButton href="https://editor.flashfx.app" size="md">
            Don&rsquo;t believe me?
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
