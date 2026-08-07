'use client';

import { useEffect, useRef, useState } from 'react';
import { useAmbient, loop } from '@/lib/motion';
import { cn } from '@/lib/utils';

/*
 * A light that travels an element's edge (immersionmilestones.md I2).
 *
 * All the animation is CSS — see `.fx-beam` in globals.css. This file only
 * decides which variant renders and, for the continuous variants, holds the
 * governor slot that permits them to run.
 *
 * Drop it inside any element that is `relative` and has a border radius; the
 * ring inherits the radius and sits inset-0 over the host's own border.
 *
 *   <div className="group relative rounded-card border border-fx-border">
 *     <BeamBorder />
 *     …
 *   </div>
 *
 * `trace` needs `group` on the host, since the hover selector keys off it.
 */

export type BeamVariant =
  /** Idle until hover, then one lap. The default, and the only one safe to put on every card in a grid. */
  | 'trace'
  /** A light circling continuously. Governed. Reserve for the two or three elements that deserve the attention. */
  | 'ambient'
  /** A breathing edge glow rather than a travelling light. Governed. For status and highlight states. */
  | 'pulse';

interface BeamBorderProps {
  variant?: BeamVariant;
  /** Seconds for one lap. Defaults per variant. */
  duration?: number;
  /** The bright head of the beam. Defaults to the accent yellow. */
  color?: string;
  /** The faint tail behind it. */
  tint?: string;
  /** Ring thickness in px. */
  width?: number;
  className?: string;
  /** Governed variants only — higher wins a contested loop slot. */
  priority?: number;
}

const DEFAULT_DURATION: Record<BeamVariant, number> = {
  // Fast: this is a response to a gesture, and should finish while the pointer
  // is still there rather than crawling round after the visitor has moved on.
  trace: 2.4,
  ambient: loop.sweep,
  pulse: loop.breathe,
};

function beamStyle({ variant, duration, color, tint, width }: BeamBorderProps & { variant: BeamVariant }) {
  return {
    '--fx-beam-dur': `${duration ?? DEFAULT_DURATION[variant]}s`,
    ...(color ? { '--fx-beam-core': color } : null),
    ...(tint ? { '--fx-beam-tint': tint } : null),
    ...(width ? { padding: `${width}px` } : null),
  } as React.CSSProperties;
}

/** Hover-driven. No slot, no observer, no JavaScript beyond rendering a span. */
function TraceBeam(props: BeamBorderProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('fx-beam fx-beam--trace', props.className)}
      style={beamStyle({ ...props, variant: 'trace' })}
    >
      <span className="fx-beam-spin" />
    </span>
  );
}

/** Continuous, so it runs only while the I1 governor grants it a slot. */
function GovernedBeam({ variant, ...props }: BeamBorderProps & { variant: BeamVariant }) {
  const { ref, active } = useAmbient<HTMLSpanElement>({ priority: props.priority ?? 0 });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('fx-beam', `fx-beam--${variant}`, active && 'is-live', props.className)}
      style={beamStyle({ ...props, variant })}
    >
      <span className="fx-beam-spin" />
    </span>
  );
}

export function BeamBorder({ variant = 'trace', ...props }: BeamBorderProps) {
  // Two components rather than a conditional hook: `trace` must not register
  // with the governor at all, or a grid of twenty cards would exhaust the cap
  // on borders nobody is looking at.
  return variant === 'trace' ? (
    <TraceBeam {...props} />
  ) : (
    <GovernedBeam variant={variant} {...props} />
  );
}

/**
 * A divider with a light that sweeps across it once, when it arrives.
 *
 * Deliberately not a CSS animation on mount: sections near the bottom of a long
 * page would play and finish while still far below the fold. Same failure P6
 * found in `CreatorStories`.
 */
export function SectionSeam({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;

    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [seen]);

  return <div ref={ref} aria-hidden="true" className={cn('fx-seam', seen && 'is-in', className)} />;
}
