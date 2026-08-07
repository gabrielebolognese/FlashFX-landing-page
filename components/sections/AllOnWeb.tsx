'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/*
 * "All on web", with the browsers it runs in scattered around it
 * (immersionmilestones.md I8, 2026-08-07).
 *
 * The icons start small at the centre, behind the words, and shoot outward to
 * their places — so the claim and the proof arrive as one movement rather than
 * the text saying it and a row of logos sitting there agreeing.
 *
 * Every value below is fixed, never `Math.random()`. Random during render
 * differs between the server and client passes, and would also give a different
 * scatter each time the section is revisited — the exact trap P6 pulled out of
 * `background-paths`.
 *
 * Icons are served from public/browsers/*.webp, converted and squared to 192px
 * from the originals in "public/browser icons" (1060 kB of PNGs down to 55 kB).
 * That source folder is untracked and gitignored: it would never reach Netlify,
 * and it is twenty times the weight of what actually ships.
 */

interface Browser {
  slug: string;
  name: string;
  /** Position, in percent of the section. */
  x: number;
  y: number;
  /** Degrees, within the ±40 the brief asked for. */
  rotate: number;
  /** Rendered size in px at the large breakpoint. */
  size: number;
  delay: number;
}

/*
 * Placed by hand rather than on a circle. An even ring reads as a clock face;
 * uneven radii and a gap either side of the words read as scatter. Nothing sits
 * between roughly 34–66% horizontally at mid height, which is where the text
 * is.
 */
const BROWSERS: Browser[] = [
  { slug: 'chrome', name: 'Chrome', x: 11, y: 24, rotate: -22, size: 84, delay: 0 },
  { slug: 'firefox', name: 'Firefox', x: 27, y: 12, rotate: 31, size: 72, delay: 0.06 },
  { slug: 'safari', name: 'Safari', x: 46, y: 17, rotate: -12, size: 66, delay: 0.12 },
  { slug: 'edge', name: 'Edge', x: 68, y: 13, rotate: 24, size: 76, delay: 0.05 },
  { slug: 'opera', name: 'Opera', x: 87, y: 27, rotate: -35, size: 80, delay: 0.11 },
  { slug: 'brave', name: 'Brave', x: 14, y: 71, rotate: 38, size: 78, delay: 0.09 },
  { slug: 'duckduckgo', name: 'DuckDuckGo', x: 36, y: 82, rotate: -28, size: 70, delay: 0.15 },
  { slug: 'tor', name: 'Tor Browser', x: 62, y: 80, rotate: 17, size: 74, delay: 0.03 },
  { slug: 'perplexity', name: 'Perplexity', x: 85, y: 68, rotate: -40, size: 68, delay: 0.17 },
];

export function AllOnWeb() {
  return (
    <section
      id="all-on-web"
      className="relative w-full h-[60vh] min-h-[380px] overflow-hidden flex items-center justify-center"
    >
      {BROWSERS.map((b) => (
        <motion.div
          key={b.slug}
          className="absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          /*
            Starts at the centre and small, then flies to its place. The offset
            that carries it back to the middle is expressed in percent of the
            *section* — hence the wrapper below: a percentage translate resolves
            against the element's own box, and translating an 84px icon by 39%
            would move it 33px, not across the section.
          */
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: b.delay }}
        >
          <motion.div
            initial={{ x: `${(50 - b.x) * 8}%`, y: `${(50 - b.y) * 8}%`, scale: 0.15, rotate: 0 }}
            whileInView={{ x: 0, y: 0, scale: 1, rotate: b.rotate }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, delay: b.delay, ease: [0.16, 1, 0.3, 1] }}
            className="-translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src={`/browsers/${b.slug}.webp`}
              alt={b.name}
              width={b.size}
              height={b.size}
              className="w-[46px] sm:w-[62px] md:w-auto h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              style={{ maxWidth: b.size }}
            />
          </motion.div>
        </motion.div>
      ))}

      <motion.h2
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] text-white px-6"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.04em' }}
      >
        All on <span style={{ color: '#f5c842' }}>web</span>
      </motion.h2>
    </section>
  );
}
