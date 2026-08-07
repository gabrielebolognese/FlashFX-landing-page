'use client';

import { useCallback, useEffect, useRef } from 'react';
import { DemoShell, useDemo } from './demo-kit';

/*
 * Three people building the FlashFX lockup together, then handing you a way in
 * (immersionmilestones.md I8).
 *
 * ── What the second pass fixed ─────────────────────────────────────────────
 *
 * Cursors are three times the size, the whole thing runs at roughly half speed,
 * the canvas grid is gone, and the logo is built rather than dropped in.
 *
 * **Motion is splined, not eased per segment.** The first version interpolated
 * each leg of a cursor's path with an ease-in-out, which brings the cursor to a
 * dead stop at every waypoint and starts it again — precisely what made it look
 * robotic. Positions now run through a Catmull-Rom spline, which is continuous
 * in velocity through the waypoints, so a cursor sweeps a turn the way a hand
 * does.
 *
 * **The logo is geometry.** It was an <img> of the favicon, which arrived small
 * and sat wherever the square happened to be. It is now three polygons — top
 * arm, middle arm, tail — that fly in one at a time as the square dissolves
 * under them, and it lives *inside* the lockup, so it is beside the word by
 * construction rather than by coincidence.
 *
 * One clock, one `frame(t)`, every element a pure function of t. No setTimeout
 * chains and no React state, so the choreography stays a single table of cues
 * and replaying is `t = 0`.
 */

const DISCORD_INVITE = 'https://discord.gg/VkSrB55HWg';

const HEADLINE = 'FlashFX';
const SUBLINE = 'is a community';

/*
 * The score, in milliseconds. Roughly double the first pass, which was over
 * before a visitor had worked out what they were watching.
 */
const T = {
  c1Arrive: 900,
  squarePop: [900, 1500],
  c2Grab: 2300,
  stretch: [2300, 3900],
  barIn: [2100, 2500],
  barSlide: [2500, 4200],
  barOut: [4300, 4800],
  c3Click: 5200,
  headline: [5300, 7300],
  logo: [5300, 7400],
  subline: [6600, 8800],
  lineUp: [9600, 10600],
  exit: [10600, 11300],
  ret: [11800, 12900],
  button: [12000, 13000],
  END: 14200,
} as const;

/*
 * Where the lockup sits, in percent of the stage. The square starts here too,
 * so the morph happens in place rather than jumping across the canvas.
 */
const LOGO = { x: 33, y: 45 };
const BAR = { x0: 58, x1: 78, y: 15 };

interface Point { t: number; x: number; y: number; o: number; r?: number }

const CURSORS = [
  {
    id: 'GB',
    colour: '#F5C518',
    path: [
      { t: 0, x: 20, y: 62, o: 0 },
      { t: 320, x: 26, y: 55, o: 1 },
      { t: T.c1Arrive, x: LOGO.x, y: LOGO.y, o: 1 },
      { t: 2100, x: BAR.x0, y: BAR.y + 5, o: 1 },
      { t: T.barSlide[1], x: BAR.x1, y: BAR.y + 5, o: 1 },
      { t: 5400, x: 30, y: 66, o: 1 },
      { t: T.subline[0], x: 30, y: 70, o: 1 },
      { t: T.lineUp[0], x: 30, y: 70, o: 1 },
      { t: T.lineUp[1], x: 35, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 35, y: 135, o: 0, r: 180 },
      { t: T.ret[0], x: 35, y: 135, o: 0, r: 180 },
      { t: T.ret[1], x: 35, y: 92, o: 1, r: 180 },
      { t: T.END, x: 35, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
  {
    id: 'MR',
    colour: '#7C5CBF',
    path: [
      { t: 0, x: 82, y: 48, o: 0 },
      { t: 1300, x: 72, y: 40, o: 0 },
      { t: 1800, x: 56, y: 38, o: 1 },
      { t: T.c2Grab, x: LOGO.x + 9, y: LOGO.y, o: 1 },
      { t: T.stretch[1], x: LOGO.x + 20, y: LOGO.y, o: 1 },
      { t: T.logo[1], x: LOGO.x + 13, y: LOGO.y + 4, o: 1 },
      { t: T.lineUp[0], x: LOGO.x + 13, y: LOGO.y + 4, o: 1 },
      { t: T.lineUp[1], x: 50, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 50, y: 135, o: 0, r: 180 },
      { t: T.ret[0], x: 50, y: 135, o: 0, r: 180 },
      { t: T.ret[1], x: 50, y: 92, o: 1, r: 180 },
      { t: T.END, x: 50, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
  {
    id: 'AK',
    colour: '#4ADE80',
    path: [
      { t: 0, x: 70, y: 84, o: 0 },
      { t: 4500, x: 66, y: 76, o: 0 },
      { t: T.c3Click, x: 58, y: 52, o: 1 },
      { t: 7600, x: 62, y: 50, o: 1 },
      { t: T.lineUp[0], x: 62, y: 50, o: 1 },
      { t: T.lineUp[1], x: 65, y: 76, o: 1, r: 180 },
      { t: T.exit[1], x: 65, y: 135, o: 0, r: 180 },
      { t: T.ret[0], x: 65, y: 135, o: 0, r: 180 },
      { t: T.ret[1], x: 65, y: 92, o: 1, r: 180 },
      { t: T.END, x: 65, y: 92, o: 0, r: 180 },
    ] as Point[],
  },
];

const SWATCH = ['#2D6BE4', '#7C5CBF', '#F97362', '#F5C518'];

/*
 * The logo as three pieces rather than an image: top arm, middle arm, tail.
 * Splitting it is what lets it be *built* on screen — each piece flies in on
 * its own beat while the square dissolves underneath.
 */
const LOGO_PARTS = [
  { points: '26,2 90,2 70,30 6,30', fill: '#FFC93C' },
  { points: '18,36 68,36 50,64 0,64', fill: '#FBA525' },
  { points: '28,70 48,70 12,110', fill: '#F5891C' },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

/**
 * Catmull-Rom through four control values.
 *
 * This is what removes the robot. Interpolating each leg independently with an
 * ease drives velocity to zero at every waypoint; a spline carries momentum
 * through them.
 */
function spline(p0: number, p1: number, p2: number, p3: number, u: number): number {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
}

function sample(path: Point[], t: number) {
  if (t <= path[0].t) return { ...path[0], r: path[0].r ?? 0 };
  const last = path[path.length - 1];
  if (t >= last.t) return { ...last, r: last.r ?? 0 };

  let i = 1;
  while (i < path.length - 1 && t > path[i].t) i++;

  const a = path[i - 1];
  const b = path[i];
  const u = clamp01((t - a.t) / (b.t - a.t));
  const p0 = path[Math.max(0, i - 2)];
  const p3 = path[Math.min(path.length - 1, i + 1)];

  return {
    x: spline(p0.x, a.x, b.x, p3.x, u),
    y: spline(p0.y, a.y, b.y, p3.y, u),
    /*
     * Opacity and rotation stay eased rather than splined: a spline overshoots
     * its control values, and an opacity above 1 or a cursor swinging past 180°
     * reads as a fault rather than as momentum.
     */
    o: mix(a.o, b.o, ease(u)),
    r: mix(a.r ?? 0, b.r ?? 0, ease(u)),
  };
}

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
  const parts = useRef<(SVGGElement | null)[]>([]);
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
    CURSORS.forEach((c, i) => {
      const node = cursors.current[i];
      if (!node) return;
      const s = sample(c.path, t);
      // `node` spans the stage, so a percentage translate is a percentage OF
      // THE STAGE. Translating the glyph itself would move it a fraction of its
      // own width.
      node.style.transform = `translate3d(${s.x}%, ${s.y}%, 0)`;
      node.style.opacity = String(s.o);
      const glyph = node.firstElementChild as HTMLElement | null;
      if (glyph) glyph.style.transform = `rotate(${s.r}deg)`;
    });

    if (square.current) {
      const pop = ease(seg(t, T.squarePop));
      const stretch = ease(seg(t, T.stretch));
      const gone = ease(seg(t, [T.logo[0], T.logo[0] + 700] as const));
      square.current.style.opacity = String(pop * (1 - gone));
      square.current.style.transform = `scale(${mix(0.35, 1, pop) * mix(1, 1.75, stretch)}, ${mix(0.35, 1, pop)})`;
      square.current.style.backgroundColor = swatchAt(seg(t, T.barSlide));
    }

    // Each piece of the logo arrives on its own beat.
    parts.current.forEach((node, i) => {
      if (!node) return;
      const span = T.logo[1] - T.logo[0];
      const from = T.logo[0] + (i * span) / 5;
      const u = ease(seg(t, [from, from + span * 0.55] as const));
      node.style.opacity = String(u);
      node.style.transform = `translate(${mix(-22, 0, u)}px, ${mix(-16 + i * 16, 0, u)}px) scale(${mix(0.55, 1, u)})`;
    });

    if (bar.current) {
      bar.current.style.opacity = String(ease(seg(t, T.barIn)) * (1 - ease(seg(t, T.barOut))));
    }
    if (knob.current) {
      knob.current.style.transform = `translateX(${ease(seg(t, T.barSlide)) * 100}%)`;
    }

    const typed = (
      el: HTMLSpanElement | null,
      caret: HTMLSpanElement | null,
      text: string,
      span: readonly [number, number]
    ) => {
      if (!el) return;
      const u = seg(t, span);
      el.textContent = text.slice(0, Math.round(u * text.length));
      if (caret) caret.style.opacity = u > 0 && u < 1 ? (Math.floor(t / 200) % 2 ? '1' : '0.15') : '0';
    };
    typed(head.current, headCaret.current, HEADLINE, T.headline);
    typed(sub.current, subCaret.current, SUBLINE, T.subline);

    if (cta.current) {
      const u = ease(seg(t, T.button));
      cta.current.style.opacity = String(u);
      cta.current.style.transform = `translateY(${mix(30, 0, u)}px) scale(${mix(0.94, 1, u)})`;
      cta.current.style.pointerEvents = u > 0.9 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      if (!last.current) last.current = now;
      clock.current += Math.min(50, now - last.current);
      last.current = now;
      frame(clock.current);
      if (activeRef.current && clock.current < T.END) {
        raf.current = requestAnimationFrame(tick);
      } else {
        running.current = false;
        last.current = 0;
      }
    };

    const start = () => {
      if (running.current || clock.current >= T.END) return;
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
      {/*
        A plain surface. This used to draw a canvas grid, and the section behind
        it drew another at a different pitch — the two clashed everywhere they
        overlapped. Neutral now, with one soft pool of light.
      */}
      <div ref={stage} className="relative flex-1 min-h-0 w-full">
        <div
          className="absolute left-1/2 top-1/2 w-[80%] h-[70%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(245,197,24,0.07) 0%, rgba(124,92,191,0.05) 45%, transparent 72%)',
          }}
        />

        {/* The lockup: logo and word side by side, laid out once so neither
            moves as the other arrives. */}
        <div className="absolute inset-x-0 top-[34%] flex flex-col items-center pointer-events-none px-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative w-[46px] h-[56px] sm:w-[68px] sm:h-[83px] md:w-[86px] md:h-[105px] flex-shrink-0">
              {/* The square the cursors draw, in the slot the logo will fill. */}
              <div
                ref={square}
                className="absolute left-1/2 top-1/2 w-[70%] h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[8px]"
                style={{ opacity: 0 }}
              />
              <svg viewBox="0 0 92 112" className="absolute inset-0 w-full h-full overflow-visible">
                {LOGO_PARTS.map((p, i) => (
                  <g
                    key={i}
                    ref={(node) => {
                      parts.current[i] = node;
                    }}
                    style={{ opacity: 0 }}
                  >
                    <polygon points={p.points} fill={p.fill} />
                  </g>
                ))}
              </svg>
            </div>

            {/* The full word rendered invisibly reserves the width, so the logo
                does not slide left as the letters type themselves in. */}
            <div className="relative">
              <span
                className="invisible font-bold leading-none text-4xl sm:text-6xl md:text-8xl"
                style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
              >
                {HEADLINE}
              </span>
              <div
                className="absolute inset-0 flex items-center font-bold leading-none text-white text-4xl sm:text-6xl md:text-8xl"
                style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
              >
                <span ref={head} />
                <span ref={headCaret} className="text-fx-accent-yellow" style={{ opacity: 0 }}>
                  |
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6 text-fx-text-secondary text-base sm:text-xl md:text-2xl">
            <span ref={sub} />
            <span ref={subCaret} className="text-fx-accent-yellow" style={{ opacity: 0 }}>
              |
            </span>
          </div>
        </div>

        <div
          ref={bar}
          className="absolute pointer-events-none"
          style={{ left: `${BAR.x0}%`, top: `${BAR.y}%`, width: `${BAR.x1 - BAR.x0}%`, opacity: 0 }}
        >
          <div
            className="relative h-3 rounded-full border border-white/15"
            style={{ background: `linear-gradient(90deg, ${SWATCH.join(',')})` }}
          >
            <div ref={knob} className="absolute inset-y-0 left-0 right-0">
              <div className="absolute -top-1 -left-2 w-4 h-5 rounded-[3px] bg-white shadow-lg" />
            </div>
          </div>
        </div>

        <div
          ref={cta}
          className="absolute left-1/2 -translate-x-1/2 w-[40%] min-w-[230px]"
          style={{ top: '80%', opacity: 0 }}
        >
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 rounded-full bg-fx-accent-yellow text-fx-bg-base font-semibold text-lg tracking-wide shadow-[0_10px_40px_rgba(245,197,24,0.35)] hover:brightness-110 transition-[filter] duration-200"
          >
            Join now
          </a>
        </div>

        {CURSORS.map((c, i) => (
          <div
            key={c.id}
            ref={(node) => {
              cursors.current[i] = node;
            }}
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          >
            {/* Three times the size of the first pass. */}
            <div className="absolute top-0 left-0 flex items-start gap-2 origin-top-left">
              <svg
                width="44"
                height="44"
                viewBox="0 0 16 16"
                fill={c.colour}
                aria-hidden="true"
                className="flex-shrink-0 drop-shadow-lg"
              >
                <path d="M1 1l5.5 13.5 2-5.5 5.5-2z" />
              </svg>
              <span
                className="font-mono text-[15px] px-2.5 py-1 rounded-md whitespace-nowrap mt-3"
                style={{ backgroundColor: `${c.colour}2e`, color: c.colour }}
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
