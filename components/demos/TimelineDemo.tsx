'use client';

import { useCallback, useRef, useState } from 'react';
import { DemoShell, useDemo } from './demo-kit';
import { usePlayhead } from './use-playhead';

/*
 * The keyframe timeline, for "Intuitive Timeline Editing"
 * (immersionmilestones.md I8).
 *
 * Rebuilt 2026-08-07 to be interactive and full-bleed. Previously it was a
 * framer-motion animation in a bordered card: it looked cornered, and nothing
 * on it could be touched.
 *
 *   - **Drag the playhead** anywhere along the ruler or the track area.
 *   - **Drag a keyframe** to move it. Position persists.
 *   - Auto-play resumes a couple of seconds after you stop.
 *
 * The **track-name gutter is gone**. The section is now full width with the
 * outer 30% on each side faded out, and a left-hand gutter would sit exactly in
 * the invisible zone. Track colour carries the identity instead, and losing the
 * gutter means the playhead's range is the full width of the page, which is
 * also what makes scrubbing feel right.
 *
 * The sibling in "All Web Editing" is `ClipTimelineDemo` — clips in a sequence,
 * where this is keyframes on property tracks. **Do not converge them.**
 */

const CYCLE = 9;

/** How close, in track percent, a keyframe reacts to the playhead. */
const REACH = 5;

interface Track {
  name: string;
  colour: string;
  bar: [number, number];
  keys: number[];
}

const initialTracks: Track[] = [
  { name: 'Logo', colour: '#F5C518', bar: [4, 96], keys: [8, 34, 62, 90] },
  { name: 'Title', colour: '#7C5CBF', bar: [14, 88], keys: [18, 47, 82] },
  { name: 'Shape', colour: '#2D6BE4', bar: [8, 74], keys: [12, 40, 68] },
  { name: 'Glow', colour: '#4ADE80', bar: [26, 100], keys: [30, 58, 88] },
  { name: 'Subtitle', colour: '#F97362', bar: [10, 62], keys: [14, 36, 56] },
  { name: 'Mask', colour: '#38BDF8', bar: [30, 92], keys: [34, 60, 86] },
  { name: 'Camera', colour: '#E879F9', bar: [0, 80], keys: [10, 44, 74] },
  { name: 'Particles', colour: '#FBBF24', bar: [20, 100], keys: [26, 52, 78, 94] },
  { name: 'Blur', colour: '#34D399', bar: [6, 54], keys: [16, 38, 50] },
  { name: 'Overlay', colour: '#A78BFA', bar: [44, 98], keys: [48, 70, 92] },
  { name: 'Lower 3rd', colour: '#60A5FA', bar: [12, 70], keys: [20, 42, 64] },
  { name: 'Flash', colour: '#FB7185', bar: [56, 100], keys: [60, 80, 94] },
  { name: 'Grade', colour: '#2DD4BF', bar: [0, 100], keys: [8, 50, 88] },
  { name: 'Vignette', colour: '#C084FC', bar: [18, 86], keys: [24, 54, 80] },
];

export function TimelineDemo() {
  const { ref, active } = useDemo();
  const [tracks, setTracks] = useState(initialTracks);
  const [touched, setTouched] = useState(false);

  const playhead = useRef<HTMLDivElement>(null);
  /** `${trackIndex}:${keyIndex}` → element, for per-frame styling without React. */
  const keyNodes = useRef(new Map<string, HTMLSpanElement>());
  const dragging = useRef<{ track: number; key: number; node: HTMLSpanElement } | null>(null);

  /*
   * Runs on every animation frame and on every scrub. Writes styles straight to
   * the DOM: a `setState` here would reconcile 14 tracks and ~45 keyframes 60
   * times a second.
   */
  const onFrame = useCallback((p: number) => {
    if (playhead.current) playhead.current.style.transform = `translateX(${p}%)`;

    keyNodes.current.forEach((node, id) => {
      const at = Number(node.dataset.at);
      const near = Math.max(0, 1 - Math.abs(at - p) / REACH);
      node.style.transform = `rotate(45deg) scale(${1 + near * 0.95})`;
      node.style.opacity = String(0.5 + near * 0.5);
    });
  }, []);

  const bar = usePlayhead({ cycle: CYCLE, active, onFrame });

  const registerKey = useCallback((id: string) => (node: HTMLSpanElement | null) => {
    if (node) keyNodes.current.set(id, node);
    else keyNodes.current.delete(id);
  }, []);

  const onKeyDown = (track: number, key: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    // Stop the track underneath from treating this as a scrub.
    e.stopPropagation();
    e.preventDefault();
    const node = e.currentTarget;
    node.setPointerCapture(e.pointerId);
    dragging.current = { track, key, node };
    bar.touch();
    setTouched(true);
  };

  const onKeyMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragging.current;
    if (!drag) return;
    e.stopPropagation();
    const at = bar.percentAt(e.clientX);
    // Move it in the DOM now and commit to state on release — a state update
    // per pointermove would re-render the whole timeline mid-drag.
    drag.node.dataset.at = String(at);
    drag.node.style.left = `${at}%`;
    bar.touch();
    bar.emit();
  };

  const onKeyUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragging.current;
    if (!drag) return;
    e.stopPropagation();
    drag.node.releasePointerCapture(e.pointerId);
    const at = Number(drag.node.dataset.at);
    setTracks((prev) =>
      prev.map((t, ti) =>
        ti === drag.track ? { ...t, keys: t.keys.map((k, ki) => (ki === drag.key ? at : k)) } : t
      )
    );
    dragging.current = null;
    bar.touch();
  };

  const scrub = {
    onPointerDown: (e: React.PointerEvent) => {
      bar.beginScrub(e);
      setTouched(true);
    },
    onPointerMove: bar.moveScrub,
    onPointerUp: bar.endScrub,
    onPointerCancel: bar.endScrub,
  };

  return (
    <DemoShell innerRef={ref} label="Timeline" bare>
      {/* Ruler — also the primary scrub surface, as in any editor. */}
      <div
        className="relative flex items-stretch h-5 flex-shrink-0 border-b border-fx-border/60 cursor-ew-resize touch-none"
        {...scrub}
      >
        {Array.from({ length: 32 }, (_, i) => (
          <div key={i} className="flex-1 border-r border-fx-border/30 last:border-r-0" />
        ))}
      </div>

      <div
        ref={bar.trackRef}
        className="relative flex-1 min-h-0 flex flex-col gap-[2px] py-[3px] cursor-ew-resize touch-none"
        {...scrub}
      >
        {tracks.map((track, ti) => (
          <div key={track.name} className="relative flex items-center flex-1 min-h-0">
            <div
              className="absolute h-[58%] rounded-[2px] top-1/2 -translate-y-1/2"
              style={{
                left: `${track.bar[0]}%`,
                width: `${track.bar[1] - track.bar[0]}%`,
                backgroundColor: `${track.colour}1c`,
                border: `1px solid ${track.colour}3a`,
              }}
            />
            {track.keys.map((at, ki) => (
              <span
                key={ki}
                ref={registerKey(`${ti}:${ki}`)}
                data-at={at}
                onPointerDown={onKeyDown(ti, ki)}
                onPointerMove={onKeyMove}
                onPointerUp={onKeyUp}
                onPointerCancel={onKeyUp}
                className="absolute top-1/2 w-[9px] h-[9px] -mt-[4.5px] -ml-[4.5px] rounded-[1px] cursor-grab active:cursor-grabbing touch-none"
                style={{ left: `${at}%`, backgroundColor: track.colour, transform: 'rotate(45deg)' }}
              />
            ))}
          </div>
        ))}

        {/*
          Pinned to the left of a full-width wrapper; the wrapper is what
          translates, so the playhead crosses the track without animating
          `left` and forcing layout across fourteen rows every frame.
        */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
          <div ref={playhead} className="absolute inset-y-0 left-0 right-0">
            <div className="absolute inset-y-0 -left-px w-[2px] bg-fx-accent-yellow shadow-[0_0_12px_2px_rgba(245,197,24,0.55)]" />
            <div className="absolute -top-[3px] -left-[6px] w-3.5 h-2 rounded-sm bg-fx-accent-yellow" />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-6 flex items-center justify-center">
        <span
          className={`font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 transition-opacity duration-500 ${
            touched ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Drag the playhead · drag a keyframe
        </span>
      </div>
    </DemoShell>
  );
}
