'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DemoShell, useDemo } from './demo-kit';

/*
 * Three people building the FlashFX lockup together, then handing you a way in
 * (immersionmilestones.md I8).
 *
 * Replaced a static arrangement of cursors and a "Copied" chip on 2026-08-07.
 *
 * ── How it is driven ────────────────────────────────────────────────────────
 *
 * One clock, one `frame(t)`, and every element's state is a pure function of
 * `t`. Nothing is a chain of `setTimeout`s and nothing is React state, which
 * matters for two reasons: the choreography stays legible as a single table of
 * times rather than scattered across callbacks, and scrubbing back to zero on
 * replay is just `t = 0` rather than unwinding a pile of pending timers.
 *
 * Cursors follow waypoint tracks — position, opacity and rotation sampled and
 * eased between keyframes. Overlapping their timings is what stops this reading
 * as a slideshow: at almost every instant more than one thing is happening, but
 * nothing starts at the same moment as anything else.
 *
 * Plays once and holds the finished state. It ends on a call to action, so it
 * must not blink out and rebuild while someone is reaching for it; the replay
 * is driven by leaving and re-entering the viewport.
 */

/** Provided by the owner elsewhere on the site — AboutCTA and SplitHero use it. */
const DISCORD_INVITE = 'https://discord.gg/VkSrB55HWg';

const HEADLINE = 'flashfx';
const SUBLINE = 'is a community';

/*
 * The score, in milliseconds. Every value below is a cue; nothing else in the
 * file carries timing. Adjust the choreography here.
 */
const T = {
  c1Arrive: 420,          // cursor one reaches the canvas and clicks
  squarePop: [420, 700],
  c2Grab: 1150,           // cursor two takes the right edge
  stretch: [1150, 2000],
  barIn: [900, 1080],     // colour picker fades up while the stretch runs
  barSlide: [1080, 1760],
  barOut: [1780, 2060],
  c3Click: 2280,          // cursor three arrives and clicks near cursor two
  headline: [2280, 3280], // typewriter, one second exactly
  morph: [2300, 3140],    // square becomes the logo, under the typing
  subline: [2780, 3780],  // starts at the headline's halfway point
  lineUp: [3980, 4520],   // all three turn to face down and line up
  exit: [4520, 4880],     // and drop out of view
  ret: [5180, 5820],      // back 300 ms later, carrying the button
  button: [5300, 5860],
} as const;

/** Where things live, in percent of the frame. */
const ART = { x: 42, y: 30 };
const BAR = { x0: 56, x1: 73, y: 16 };

interface Point { t: number; x: number; y: number; o: number; r?: number }

/*
 * Cursor paths. Deliberately staggered — cursor one is already colouring while
 * cursor two is still stretching, and cursor three interrupts both.
 */
const CURSORS = [
  {
    id: 'GB',
    colour: '#F5C518',
    path: [
      { t: 0, x: 26, y: 58, o: 0 },
      { t: 180, x: 32, y: 46, o: 1 },
      { t: T.c1Arrive, x: ART.x, y: ART.y, o: 1 },
      { t: 980, x: BAR.x0, y: BAR.y + 4, o: 1 },
      { t: T.barSlide[1], x: BAR.x1, y: BAR.y + 4, o: 1 },
      { t: 2420, x: 33, y: 60, o: 1 },
      { t: T.subline[0], x: 33, y: 65, o: 1 },
      { t: T.lineUp[0], x: 33, y: 65, o: 1 },
      { t: T.lineUp[1], x: 35, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 35, y: 132, o: 0, r: 180 },
      { t: T.ret[0], x: 35, y: 132, o: 0, r: 180 },
      { t: T.ret[1], x: 35, y: 92, o: 1, r: 180 },
      { t: 6500, x: 35, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
  {
    id: 'MR',
    colour: '#7C5CBF',
    path: [
      { t: 0, x: 78, y: 44, o: 0 },
      { t: 640, x: 70, y: 38, o: 0 },
      { t: 900, x: 58, y: 33, o: 1 },
      { t: T.c2Grab, x: 49, y: ART.y, o: 1 },
      { t: T.stretch[1], x: 57, y: ART.y, o: 1 },
      { t: T.morph[1], x: 52, y: ART.y + 2, o: 1 },
      { t: T.lineUp[0], x: 52, y: ART.y + 2, o: 1 },
      { t: T.lineUp[1], x: 50, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 50, y: 132, o: 0, r: 180 },
      { t: T.ret[0], x: 50, y: 132, o: 0, r: 180 },
      { t: T.ret[1], x: 50, y: 92, o: 1, r: 180 },
      { t: 6500, x: 50, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
  {
    id: 'AK',
    colour: '#4ADE80',
    path: [
      { t: 0, x: 66, y: 78, o: 0 },
      { t: 1980, x: 64, y: 70, o: 0 },
      { t: T.c3Click, x: 55, y: 47, o: 1 },
      { t: 3500, x: 59, y: 45, o: 1 },
      { t: T.lineUp[0], x: 59, y: 45, o: 1 },
      { t: T.lineUp[1], x: 65, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 65, y: 132, o: 0, r: 180 },
      { t: T.ret[0], x: 65, y: 132, o: 0, r: 180 },
      { t: T.ret[1], x: 65, y: 92, o: 1, r: 180 },
      { t: 6500, x: 65, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
];

/** Colours the picker slides through. The last is where the logo lives. */
const SWATCH = ['#2D6BE4', '#7C5CBF', '#F97362', '#F5C518'];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

/** Sample a cursor track at `t`, easing between waypoints. */
function sample(path: Point[], t: number): Required<Point> {
  const fill = (p: Point) => ({ ...p, r: p.r ?? 0 }) as Required<Point>;
  if (t <= path[0].t) return fill(path[0]);
  for (let i = 1; i < path.length; i++) {
    if (t <= path[i].t) {
      const a = path[i - 1], b = path[i];
      const u = ease(clamp01((t - a.t) / (b.t - a.t)));
      return {
        t,
        x: mix(a.x, b.x, u),
        y: mix(a.y, b.y, u),
        o: mix(a.o, b.o, u),
        r: mix(a.r ?? 0, b.r ?? 0, u),
      };
    }
  }
  return fill(path[path.length - 1]);
}

/** Blend the swatch as a single ramp, so the picker reads as continuous. */
function swatchAt(u: number): string {
  const span = (SWATCH.length - 1) * clamp01(u);
  const i = Math.min(SWATCH.length - 2, Math.floor(span));
  const f = span - i;
  const parse = (hex: string) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
  const [r1, g1, b1] = parse(SWATCH[i]);
  const [r2, g2, b2] = parse(SWATCH[i + 1]);
  return `rgb(${Math.round(mix(r1, r2, f))},${Math.round(mix(g1, g2, f))},${Math.round(mix(b1, b2, f))})`;
}

export function ShareDemo() {
  const { ref, active } = useDemo();

  const stage = useRef<HTMLDivElement>(null);
  const cursors = useRef<(HTMLDivElement | null)[]>([]);
  const square = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const headCaret = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLSpanElement>(null);
  const subCaret = useRef<HTMLSpanElement>(null);
  const cta = useRef<HTMLDivElement>(null);

  const clock = useRef(0);
  const raf = useRef(0);
  const running = useRef(false);
  const last = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const frame = useCallback((t: number) => {
    // ── Cursors ──────────────────────────────────────────────────────────
    CURSORS.forEach((c, i) => {
      const node = cursors.current[i];
      if (!node) return;
      const s = sample(c.path, t);
      // `node` spans the whole stage, so a percentage translate is a percentage
      // OF THE STAGE. Translating the glyph itself would move it by a fraction
      // of its own 15px width.
      node.style.transform = `translate3d(${s.x}%, ${s.y}%, 0)`;
      node.style.opacity = String(s.o);
      const glyph = node.firstElementChild as HTMLElement | null;
      if (glyph) glyph.style.transform = `rotate(${s.r}deg)`;
    });

    // ── The square: pops, stretches, takes colour, then hands over ────────
    if (square.current) {
      const pop = ease(seg(t, T.squarePop));
      const stretch = ease(seg(t, T.stretch));
      const gone = ease(seg(t, T.morph));
      square.current.style.opacity = String(pop * (1 - gone));
      square.current.style.transform = `scale(${mix(0.4, 1, pop) * mix(1, 1.85, stretch)}, ${mix(0.4, 1, pop)})`;
      square.current.style.backgroundColor = swatchAt(seg(t, T.barSlide));
    }

    if (logo.current) {
      const u = ease(seg(t, T.morph));
      logo.current.style.opacity = String(u);
      logo.current.style.transform = `scale(${mix(0.72, 1, u)})`;
    }

    // ── Colour picker ────────────────────────────────────────────────────
    if (bar.current) {
      bar.current.style.opacity = String(ease(seg(t, T.barIn)) * (1 - ease(seg(t, T.barOut))));
    }
    if (knob.current) {
      knob.current.style.transform = `translateX(${ease(seg(t, T.barSlide)) * 100}%)`;
    }

    // ── Typewriters ──────────────────────────────────────────────────────
    const typed = (el: HTMLSpanElement | null, caret: HTMLSpanElement | null, text: string, span: readonly [number, number]) => {
      if (!el) return;
      const u = seg(t, span);
      el.textContent = text.slice(0, Math.round(u * text.length));
      if (caret) caret.style.opacity = u > 0 && u < 1 ? (Math.floor(t / 160) % 2 ? '1' : '0.15') : '0';
    };
    typed(head.current, headCaret.current, HEADLINE, T.headline);
    typed(sub.current, subCaret.current, SUBLINE, T.subline);

    // ── The button the three of them bring back ──────────────────────────
    if (cta.current) {
      const u = ease(seg(t, T.button));
      cta.current.style.opacity = String(u);
      cta.current.style.transform = `translateY(${mix(26, 0, u)}px) scale(${mix(0.94, 1, u)})`;
      cta.current.style.pointerEvents = u > 0.9 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      if (!last.current) last.current = now;
      clock.current += Math.min(50, now - last.current);
      last.current = now;
      frame(clock.current);
      // Runs only while there is animation left; the finished state is static.
      if (activeRef.current && clock.current < 6800) {
        raf.current = requestAnimationFrame(tick);
      } else {
        running.current = false;
        last.current = 0;
      }
    };

    const start = () => {
      if (running.current || clock.current >= 6800) return;
      running.current = true;
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    };

    frame(clock.current);
    if (active) start();

    /*
     * Replay only after the section has properly left the viewport. Its own
     * observer, not the governor's grant: losing a loop slot to another section
     * is not a reason to restart, and this ends on a call to action that must
     * not blink out while someone is reaching for it.
     */
    const el = stage.current;
    const reset = new IntersectionObserver(
      (records) => {
        if (records.some((r) => !r.isIntersecting)) {
          clock.current = 0;
          frame(0);
        }
      },
      { threshold: 0 }
    );
    if (el) reset.observe(el);

    return () => {
      cancelAnimationFrame(raf.current);
      running.current = false;
      reset.disconnect();
    };
  }, [active, frame]);

  return (
    <DemoShell innerRef={ref} label="Share" bare>
      <div ref={stage} className="relative flex-1 min-h-0 w-full">
        {/* Canvas grid, so the cursors have a surface to work on. */}
        <div
          className="absolute inset-0 opacity-[0.13] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '34px 34px',
          }}
        />

        {/* The artwork: a square that becomes the logo. */}
        <div
          className="absolute pointer-events-none"
          style={{ left: `${ART.x}%`, top: `${ART.y}%`, transform: 'translate(-50%,-50%)' }}
        >
          <div className="relative w-[72px] h-[72px] md:w-[92px] md:h-[92px]">
            <div ref={square} className="absolute inset-0 rounded-[10px]" style={{ opacity: 0 }} />
            <div ref={logo} className="absolute inset-0" style={{ opacity: 0 }}>
              <Image
                src="/android-chrome-192x192.png"
                alt=""
                width={92}
                height={92}
                className="w-full h-full object-contain rounded-[10px]"
              />
            </div>
          </div>
        </div>

        {/* Colour picker — appears, is used, and gets out of the way. */}
        <div
          ref={bar}
          className="absolute pointer-events-none"
          style={{ left: `${BAR.x0}%`, top: `${BAR.y}%`, width: `${BAR.x1 - BAR.x0}%`, opacity: 0 }}
        >
          <div
            className="relative h-2.5 rounded-full border border-white/15"
            style={{ background: `linear-gradient(90deg, ${SWATCH.join(',')})` }}
          >
            {/* Full-width layer, so translateX(100%) spans the bar rather than
                the handle's own 14px. */}
            <div ref={knob} className="absolute inset-y-0 left-0 right-0">
              <div className="absolute -top-[3px] -left-[7px] w-3.5 h-[18px] rounded-[3px] bg-white shadow-lg" />
            </div>
          </div>
        </div>

        {/* The lockup the three of them are writing. */}
        <div className="absolute inset-x-0 top-[46%] flex flex-col items-center pointer-events-none px-4">
          <div
            className="font-bold leading-none text-white text-5xl sm:text-7xl md:text-8xl"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span ref={head} />
            <span ref={headCaret} className="text-fx-accent-yellow" style={{ opacity: 0 }}>|</span>
          </div>

          <div className="mt-3 md:mt-4 text-fx-text-secondary text-base sm:text-xl md:text-2xl">
            <span ref={sub} />
            <span ref={subCaret} className="text-fx-accent-yellow" style={{ opacity: 0 }}>|</span>
          </div>
        </div>

        {/* Delivered by all three at once. */}
        <div
          ref={cta}
          className="absolute left-1/2 -translate-x-1/2 w-[40%] min-w-[220px]"
          style={{ top: '80%', opacity: 0 }}
        >
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3.5 rounded-full bg-fx-accent-yellow text-fx-bg-base font-semibold tracking-wide shadow-[0_10px_40px_rgba(245,197,24,0.35)] hover:brightness-110 transition-[filter] duration-200"
          >
            Join now
          </a>
        </div>

        {/* Cursors last, so they are above everything they touch. */}
        {CURSORS.map((c, i) => (
          <div
            key={c.id}
            ref={(node) => {
              cursors.current[i] = node;
            }}
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className="absolute top-0 left-0 flex items-start gap-1.5 origin-top-left">
              <svg width="15" height="15" viewBox="0 0 16 16" fill={c.colour} aria-hidden="true" className="flex-shrink-0">
                <path d="M1 1l5.5 13.5 2-5.5 5.5-2z" />
              </svg>
              <span
                className="font-mono text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{ backgroundColor: `${c.colour}26`, color: c.colour }}
              >
                {c.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}
