'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/*
 * Two desks, built in CSS 3D.
 *
 * A laptop that opens for the beginner card, and a three-monitor rig for the
 * expert one. Both are real 3D: a `perspective` on the frame, `preserve-3d` on
 * the rig, and every panel placed with `rotateY`/`rotateX`/`translateZ` rather
 * than drawn to look angled. The side monitors genuinely turn inward, so the rig
 * has parallax as it yaws and the far edges foreshorten on their own.
 *
 * ── Why DOM and not canvas ──────────────────────────────────────────────────
 *
 * There are perhaps twenty panels between the two scenes. The compositor
 * transforms them for free, and none of it costs a frame of JavaScript — the
 * yaw, the lid and the scrolling content are all framer animations on transform
 * and opacity. A canvas would mean writing a projection by hand to draw a dozen
 * rectangles.
 *
 * ── Governed from above ─────────────────────────────────────────────────────
 *
 * Neither scene registers with the governor. The section owns one slot and
 * passes `active` to both, because two cards side by side that stop and start
 * independently look broken — and one slot for one section is the accounting
 * `useAmbient` is built around.
 */

/*
 * ── Fitting a fixed-size scene into a fluid card (mobile pass, phase 5) ─────
 *
 * Both scenes are drawn at real pixel sizes, and they have to be: `perspective`
 * and `translateZ` are absolute lengths, and there is no percentage `translateZ`
 * to rebuild them with. Depth in CSS 3D is measured in pixels or it is not
 * measured at all.
 *
 * That holds up until the card is narrower than the scene, which is every
 * phone. The cards stack below `lg`, so a 360px screen less the section padding
 * leaves about 312px for a monitor rig that spans 428px wing to wing, and the
 * card's `overflow-hidden` simply removed both outer monitors — the expert desk
 * lost the two screens that made it an expert desk.
 *
 * So the scene is scaled to fit rather than rebuilt fluid. A plain 2D scale on
 * an ancestor of the `perspective` element scales the finished projection as one
 * image, which keeps every depth relationship exactly as authored. Converting
 * the layout to percentages would not: the Z offsets would stay at their pixel
 * values while everything around them shrank, and the rig would flatten as the
 * screen narrowed.
 */

/*
 * One design width for both scenes, not one each.
 *
 * Fitting each scene to its own extents would leave the laptop untouched at
 * full size while the rig shrank to fit — drawing the beginner's laptop larger
 * than the expert's three-monitor desk, which is the opposite of what the
 * section is saying. A shared divisor keeps them in proportion, so the rig is
 * the one that sets the scale and the laptop follows it down.
 *
 * 450 is the rig's ±214px half-span plus a little for the glow around it.
 */
const DESIGN_WIDTH = 450;

function Fit({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      // Never scale up: the scene is authored at its intended size and a wide
      // card should show it at that size, not stretch it.
      setScale(width >= DESIGN_WIDTH ? 1 : Math.max(0.4, width / DESIGN_WIDTH));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="relative w-full h-full">
      {/* Anchored bottom-centre because both scenes stand on the floor of the
          card. Scaling about the centre would lift them off it as they shrank. */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
      >
        {children}
      </div>
    </div>
  );
}

const loop = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut' as const,
});

/** A person at the desk, from behind. Enough to read as somebody, no more. */
function Figure({ colour, wide }: { colour: string; wide?: boolean }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center"
      style={{ transform: 'translateX(-50%) translateZ(90px)' }}
    >
      <div
        className="rounded-full"
        style={{ width: 58, height: 58, background: colour, boxShadow: `0 0 34px ${colour}77` }}
      />
      <div
        className="rounded-t-[40px] -mt-2"
        style={{ width: wide ? 152 : 126, height: 82, background: colour, opacity: 0.92 }}
      />
    </div>
  );
}

/** Bars that shuffle, standing in for content on a screen. */
function ScreenContent({ active, seed, rows = 5 }: { active: boolean; seed: number; rows?: number }) {
  return (
    <div className="absolute inset-[7%] flex flex-col gap-[6%]">
      {Array.from({ length: rows }, (_, i) => {
        // Index-derived so the server and client agree — Math.random() here
        // would be a hydration mismatch.
        const base = 34 + ((seed * 17 + i * 29) % 52);
        return (
          <motion.span
            key={i}
            className="block rounded-full"
            style={{ height: `${100 / rows - 6}%`, background: 'rgba(255,255,255,0.32)' }}
            animate={active ? { width: [`${base}%`, `${Math.min(96, base + 34)}%`, `${base}%`] } : { width: `${base}%` }}
            transition={active ? loop(2.4 + (i % 3) * 0.6, i * 0.18) : { duration: 0 }}
          />
        );
      })}
    </div>
  );
}

export function LaptopScene({ active }: { active: boolean }) {
  return (
    <Fit>
      <div className="relative w-full h-full flex items-end justify-center pb-[8%]" style={{ perspective: 900 }}>
        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={active ? { rotateY: [-9, 9, -9], rotateX: [-14, -10, -14] } : { rotateY: -4, rotateX: -12 }}
          transition={active ? loop(9) : { duration: 0.6 }}
        >
          {/* The lid. Hinged along its bottom edge, so it swings up off the deck
              exactly as a real one does rather than sliding into place. */}
          <motion.div
            className="relative rounded-t-md rounded-b-sm"
            style={{
              width: 196,
              height: 126,
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(160deg, #2b3a70 0%, #1b2650 100%)',
              border: '2px solid #46579B',
              boxShadow: '0 0 40px rgba(245,197,24,0.16)',
            }}
            animate={active ? { rotateX: [-90, -12, -12, -90] } : { rotateX: -12 }}
            transition={
              active
                ? { duration: 7, times: [0, 0.22, 0.86, 1], repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                : { duration: 0.6 }
            }
          >
            <div
              className="absolute inset-[6px] rounded-sm overflow-hidden"
              style={{ background: 'linear-gradient(150deg, #F5C518 0%, #E86A9B 100%)', opacity: 0.9 }}
            >
              <ScreenContent active={active} seed={3} rows={4} />
            </div>
          </motion.div>

          {/* The deck, laid flat toward the viewer from the same hinge. */}
          <div
            className="rounded-b-lg"
            style={{
              width: 196,
              height: 112,
              transformOrigin: 'top center',
              transform: 'rotateX(76deg)',
              background: 'linear-gradient(180deg, #35447e 0%, #222d5c 100%)',
              border: '2px solid #46579B',
              borderTop: 'none',
            }}
          >
            <div className="absolute inset-x-[12%] top-[14%] grid grid-cols-8 gap-[3px]">
              {Array.from({ length: 32 }, (_, i) => (
                <span key={i} className="rounded-[2px]" style={{ height: 5, background: 'rgba(230,237,243,0.16)' }} />
              ))}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[10%] rounded-md"
              style={{ width: 56, height: 25, background: 'rgba(230,237,243,0.1)' }}
            />
          </div>

          <Figure colour="#F5C518" />
        </motion.div>
      </div>
    </Fit>
  );
}

export function TowerScene({ active }: { active: boolean }) {
  /* Centre flat, wings turned in. The turn is a real rotateY, so the outer
     edges foreshorten and the rig reads as curved around the desk. */
  const monitors = [
    { rotate: 34, x: -148, z: -42, seed: 1 },
    { rotate: 0, x: 0, z: 0, seed: 5 },
    { rotate: -34, x: 148, z: -42, seed: 9 },
  ];

  return (
    <Fit>
      <div className="relative w-full h-full flex items-end justify-center pb-[8%]" style={{ perspective: 1000 }}>
        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d', width: 260, height: 160 }}
          animate={active ? { rotateY: [-7, 7, -7], rotateX: [-11, -8, -11] } : { rotateY: -3, rotateX: -10 }}
          transition={active ? loop(11) : { duration: 0.6 }}
        >
          {monitors.map((m, i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 rounded-md"
              style={{
                width: 132,
                height: 84,
                marginLeft: -66,
                transform: `translateX(${m.x}px) translateZ(${m.z}px) rotateY(${m.rotate}deg)`,
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(160deg, #2b3a70 0%, #17204a 100%)',
                border: '2px solid #5B6BB5',
                boxShadow: '0 0 34px rgba(124,92,191,0.28)',
              }}
            >
              <div
                className="absolute inset-[5px] rounded-sm overflow-hidden"
                style={{
                  background:
                    i === 1
                      ? 'linear-gradient(150deg, #7C5CBF 0%, #2D6BE4 100%)'
                      : 'linear-gradient(150deg, #2D6BE4 0%, #4ADE80 100%)',
                  opacity: 0.88,
                }}
              >
                <ScreenContent active={active} seed={m.seed} rows={i === 1 ? 6 : 4} />
              </div>

              {/* Stand, angled with its screen because it is on the same panel. */}
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-[20px] rounded-b-sm"
                style={{ width: 12, height: 20, background: '#3A4880' }}
              />
            </div>
          ))}

          {/* The tower, stood off to one side and pushed back in Z. */}
          <div
            className="absolute rounded-md"
            style={{
              width: 34,
              height: 88,
              left: '50%',
              marginLeft: 120,
              top: 80,
              transform: 'translateZ(52px) rotateY(-16deg)',
              background: 'linear-gradient(165deg, #26315f 0%, #151d42 100%)',
              border: '2px solid #4A5C9F',
            }}
          >
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 top-3 rounded-full"
              style={{ width: 16, height: 3, background: '#4ADE80' }}
              animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.7 }}
              transition={active ? loop(2.2) : { duration: 0 }}
            />
            <div className="absolute inset-x-2 bottom-3 flex flex-col gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="rounded-full" style={{ height: 2, background: 'rgba(230,237,243,0.2)' }} />
              ))}
            </div>
          </div>

          <Figure colour="#7C5CBF" wide />
        </motion.div>
      </div>
    </Fit>
  );
}
