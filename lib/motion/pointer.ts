/*
 * One pointer, read once per frame (immersionmilestones.md I6).
 *
 * Every pointer-reactive thing on the site subscribes here rather than adding
 * its own `mousemove` listener. Two reasons, and the second is the important
 * one:
 *
 *   One listener instead of N. Four call-to-action buttons, a backdrop and a
 *   179-card grid would otherwise be six-plus listeners on the same events.
 *
 *   **Coalesced into requestAnimationFrame.** `mousemove` fires far more often
 *   than the screen refreshes — a 1000 Hz mouse delivers sixteen events per
 *   frame — and anything that writes a style inside the handler pays a style
 *   recalculation for every one of them. Subscribers here are called at most
 *   once per frame, with the latest position.
 *
 * Nothing runs on a coarse pointer or on the reduced tier: a touch device has
 * no hover to react to, and a machine that has told us it is weak should not be
 * spending frames on parallax.
 */

import { isReducedTier } from './device-tier';

type Listener = (x: number, y: number) => void;

const listeners = new Set<Listener>();
let attached = false;
let frame = 0;
let px = 0;
let py = 0;
let dirty = false;

/** True only where a real pointer can hover. */
export function pointerIsFine(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(hover: hover)').matches &&
    !isReducedTier()
  );
}

function flush() {
  frame = 0;
  if (!dirty) return;
  dirty = false;
  listeners.forEach((fn) => fn(px, py));
}

function onMove(e: PointerEvent) {
  px = e.clientX;
  py = e.clientY;
  dirty = true;
  // One frame is scheduled no matter how many events arrive inside it.
  if (!frame) frame = requestAnimationFrame(flush);
}

/**
 * Receive the pointer position, in client coordinates, at most once per frame.
 * Returns an unsubscribe function. A no-op where the pointer is not fine.
 */
export function subscribePointer(fn: Listener): () => void {
  if (!pointerIsFine()) return () => {};

  listeners.add(fn);
  if (!attached) {
    attached = true;
    window.addEventListener('pointermove', onMove, { passive: true });
  }

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && attached) {
      attached = false;
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
