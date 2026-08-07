'use client';

import { motion } from 'framer-motion';
import { Check, Link2 } from 'lucide-react';
import { DemoShell, useDemo } from './demo-kit';

/*
 * A project link being shared, with collaborators arriving on the canvas
 * (immersionmilestones.md I3). Replaces the "Share Projects" embed.
 *
 * The section's claim is "collaborate and share your work with anyone,
 * instantly". Cursors appearing on a canvas demonstrates that in about two
 * seconds; a video of it takes a megabyte and a half and still has to be
 * watched.
 */

const CYCLE = 6;

const peers = [
  { initials: 'GB', colour: '#F5C518', at: { left: '22%', top: '34%' }, delay: 0.9 },
  { initials: 'MR', colour: '#7C5CBF', at: { left: '63%', top: '52%' }, delay: 1.8 },
  { initials: 'AK', colour: '#4ADE80', at: { left: '41%', top: '68%' }, delay: 2.7 },
];

export function ShareDemo() {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Share">
      {/* The canvas the peers land on. */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />

      {peers.map((peer) => (
        <motion.div
          key={peer.initials}
          className="absolute flex items-center gap-1.5"
          style={peer.at}
          animate={active ? { opacity: [0, 0, 1, 1, 0], scale: [0.7, 0.7, 1, 1, 0.9] } : { opacity: 1, scale: 1 }}
          transition={
            active
              ? {
                  duration: CYCLE,
                  times: [0, peer.delay / CYCLE, (peer.delay + 0.4) / CYCLE, 0.86, 1],
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeOut',
                }
              : { duration: 0 }
          }
        >
          {/* Pointer */}
          <svg width="13" height="13" viewBox="0 0 16 16" fill={peer.colour} aria-hidden="true">
            <path d="M1 1l5.5 13.5 2-5.5 5.5-2z" />
          </svg>
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${peer.colour}26`, color: peer.colour }}
          >
            {peer.initials}
          </span>
        </motion.div>
      ))}

      {/* The link bar, flipping to a confirmed state mid-cycle. */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-fx-border bg-fx-bg-surface/90 backdrop-blur-sm">
          <Link2 className="w-3.5 h-3.5 text-fx-text-secondary flex-shrink-0" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-fx-text-secondary truncate flex-1 min-w-0">
            flashfx.app/p/kd8f2a
          </span>

          <motion.span
            className="flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded-full flex-shrink-0 border"
            animate={
              active
                ? {
                    backgroundColor: [
                      'rgba(245,197,24,0.10)',
                      'rgba(245,197,24,0.10)',
                      'rgba(74,222,128,0.16)',
                      'rgba(74,222,128,0.16)',
                      'rgba(245,197,24,0.10)',
                    ],
                    borderColor: [
                      'rgba(245,197,24,0.4)',
                      'rgba(245,197,24,0.4)',
                      'rgba(74,222,128,0.5)',
                      'rgba(74,222,128,0.5)',
                      'rgba(245,197,24,0.4)',
                    ],
                    color: ['#F5C518', '#F5C518', '#4ADE80', '#4ADE80', '#F5C518'],
                  }
                : { backgroundColor: 'rgba(245,197,24,0.10)', borderColor: 'rgba(245,197,24,0.4)', color: '#F5C518' }
            }
            transition={
              active
                ? { duration: CYCLE, times: [0, 0.1, 0.2, 0.8, 1], repeat: Number.POSITIVE_INFINITY }
                : { duration: 0 }
            }
          >
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
            Copied
          </motion.span>
        </div>
      </div>
    </DemoShell>
  );
}
