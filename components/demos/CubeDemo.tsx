'use client';

import { motion } from 'framer-motion';
import { DemoShell, useDemo } from './demo-kit';

/*
 * A rotating cube for the 3D Support section (immersionmilestones.md I3).
 *
 * That section rendered a "Video Coming Soon" box over a full viewport — one of
 * the two dead rectangles on the homepage. There is no video to lose here, so
 * it was the safest place to prove the pattern.
 *
 * CSS 3D transforms rather than three.js, deliberately. The budget allows one
 * WebGL context and I4 wants it for the page-wide backdrop; spending it on a
 * cube would be a poor trade when `preserve-3d` and six rotated faces give the
 * same result on the compositor for nothing.
 */

const SIZE = 120;
const HALF = SIZE / 2;

const faces = [
  { transform: `rotateY(0deg) translateZ(${HALF}px)`, tint: 'rgba(245,197,24,0.20)', edge: 'rgba(245,197,24,0.55)' },
  { transform: `rotateY(90deg) translateZ(${HALF}px)`, tint: 'rgba(124,92,191,0.20)', edge: 'rgba(124,92,191,0.55)' },
  { transform: `rotateY(180deg) translateZ(${HALF}px)`, tint: 'rgba(45,107,228,0.20)', edge: 'rgba(45,107,228,0.55)' },
  { transform: `rotateY(-90deg) translateZ(${HALF}px)`, tint: 'rgba(74,222,128,0.16)', edge: 'rgba(74,222,128,0.5)' },
  { transform: `rotateX(90deg) translateZ(${HALF}px)`, tint: 'rgba(230,237,243,0.10)', edge: 'rgba(230,237,243,0.35)' },
  { transform: `rotateX(-90deg) translateZ(${HALF}px)`, tint: 'rgba(230,237,243,0.06)', edge: 'rgba(230,237,243,0.25)' },
];

/** The angle the cube parks at without a loop slot — three faces visible. */
const RESTING = { rotateX: -22, rotateY: 38 };

export function CubeDemo() {
  const { ref, active } = useDemo();

  return (
    /*
     * `bare`: no panel, no border, no header. The cube sits directly on the
     * section's own background so it reads as part of the page rather than a
     * screenshot of a viewport shown inside a window.
     *
     * The section already supplies a grid (`gridBackground` on the
     * VideoPlaceholder), so this no longer draws its own — two grids at
     * different pitches would moiré against each other, and the section's is
     * what makes the blend seamless. What remains is a soft pool of light under
     * the cube, so it is grounded rather than floating in nothing.
     */
    <DemoShell innerRef={ref} label="3D viewport" bare>
      <div
        className="absolute left-1/2 top-1/2 w-[62%] h-[44%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,197,24,0.10) 0%, rgba(124,92,191,0.06) 42%, transparent 72%)',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 900 }}>
        <motion.div
          className="relative"
          style={{ width: SIZE, height: SIZE, transformStyle: 'preserve-3d' }}
          animate={
            active
              ? { rotateX: [-22, -22], rotateY: [0, 360] }
              : { rotateX: RESTING.rotateX, rotateY: RESTING.rotateY }
          }
          transition={
            active
              ? { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }
              : { duration: 0 }
          }
        >
          {faces.map((face, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform: face.transform,
                background: face.tint,
                border: `1px solid ${face.edge}`,
                backdropFilter: 'blur(2px)',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Axis readout, bottom-left — an editor detail rather than decoration. */}
      <div className="absolute bottom-3 left-3 flex gap-3 font-mono text-[9px]">
        {[
          { axis: 'X', colour: '#F5C518' },
          { axis: 'Y', colour: '#4ADE80' },
          { axis: 'Z', colour: '#2D6BE4' },
        ].map(({ axis, colour }) => (
          <span key={axis} className="flex items-center gap-1">
            <span className="w-2 h-px" style={{ backgroundColor: colour }} />
            <span style={{ color: colour }}>{axis}</span>
          </span>
        ))}
      </div>
    </DemoShell>
  );
}
