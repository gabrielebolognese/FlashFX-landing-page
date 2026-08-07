'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type Curve = {
  id: string;
  label: string;
  easingFn: (t: number) => number;
};

const bounceOut = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

const CURVES: Curve[] = [
  { id: 'linear', label: 'Linear', easingFn: (t) => t },

  { id: 'ease-in', label: 'Ease In', easingFn: (t) => t * t },
  { id: 'ease-in-cubic', label: 'Ease In Cubic', easingFn: (t) => t * t * t },
  { id: 'ease-in-quart', label: 'Ease In Quart', easingFn: (t) => t * t * t * t },
  { id: 'ease-in-quint', label: 'Ease In Quint', easingFn: (t) => t * t * t * t * t },
  { id: 'ease-in-expo', label: 'Ease In Expo', easingFn: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)) },
  { id: 'ease-in-circ', label: 'Ease In Circ', easingFn: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)) },
  { id: 'ease-in-back', label: 'Ease In Back', easingFn: (t) => 2.70158 * t * t * t - 1.70158 * t * t },
  {
    id: 'elastic-in',
    label: 'Ease In Elastic',
    easingFn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / 4) * (2 * Math.PI)) / p);
    },
  },
  { id: 'bounce-in', label: 'Ease In Bounce', easingFn: (t) => 1 - bounceOut(1 - t) },

  { id: 'ease-out', label: 'Ease Out', easingFn: (t) => t * (2 - t) },
  { id: 'ease-out-cubic', label: 'Ease Out Cubic', easingFn: (t) => --t * t * t + 1 },
  { id: 'ease-out-quart', label: 'Ease Out Quart', easingFn: (t) => 1 - --t * t * t * t },
  { id: 'ease-out-quint', label: 'Ease Out Quint', easingFn: (t) => 1 + --t * t * t * t * t },
  { id: 'ease-out-expo', label: 'Ease Out Expo', easingFn: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) },
  { id: 'ease-out-circ', label: 'Ease Out Circ', easingFn: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)) },
  {
    id: 'ease-out-back',
    label: 'Ease Out Back',
    easingFn: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
  },
  {
    id: 'elastic-out',
    label: 'Ease Out Elastic',
    easingFn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    },
  },
  { id: 'bounce-out', label: 'Ease Out Bounce', easingFn: bounceOut },

  { id: 'ease-in-out', label: 'Ease In Out', easingFn: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) },
  {
    id: 'ease-in-out-cubic',
    label: 'Ease In Out Cubic',
    easingFn: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  },
  {
    id: 'ease-in-out-quart',
    label: 'Ease In Out Quart',
    easingFn: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  },
  {
    id: 'elastic-in-out',
    label: 'Ease In Out Elastic',
    easingFn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.45;
      if (t < 0.5) {
        return -0.5 * Math.pow(2, 20 * t - 10) * Math.sin(((20 * t - 11.125) * (2 * Math.PI)) / p);
      }
      return 0.5 * Math.pow(2, -20 * t + 10) * Math.sin(((20 * t - 11.125) * (2 * Math.PI)) / p) + 1;
    },
  },

  {
    id: 'spring',
    label: 'Spring',
    easingFn: (t) => 1 - Math.cos(t * Math.PI * 4.5) * Math.exp(-t * 6),
  },
];

function generateMiniCurvePath(easingFn: (t: number) => number): string {
  const points: [number, number][] = [];
  const samples = 60;
  const width = 80;
  const height = 48;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = t * width;
    const y = height - easingFn(t) * height;
    points.push([x, y]);
  }

  return points.map((p) => p.join(',')).join(' ');
}

function generateSmoothCurvePath(
  easingFn: (t: number) => number,
  width: number,
  height: number,
  padding: { left: number; right: number; top: number; bottom: number }
): string {
  const samples = 120;
  const points: [number, number][] = [];

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const value = easingFn(t);
    const x = padding.left + t * graphWidth;
    const y = padding.top + (1 - value) * graphHeight;
    points.push([x, y]);
  }

  if (points.length === 0) return '';

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    if (i === 1) {
      d += ` L ${curr[0]} ${curr[1]}`;
    } else {
      const tension = 0.3;
      const cp1x = prev[0] + (curr[0] - (points[i - 2]?.[0] ?? prev[0])) * tension;
      const cp1y = prev[1] + (curr[1] - (points[i - 2]?.[1] ?? prev[1])) * tension;
      const cp2x = curr[0] - (next ? next[0] - prev[0] : curr[0] - prev[0]) * tension;
      const cp2y = curr[1] - (next ? next[1] - prev[1] : curr[1] - prev[1]) * tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr[0]} ${curr[1]}`;
    }
  }

  return d;
}

const GRAPH_VIEWPORT_W = 440;
const GRAPH_VIEWPORT_H = 440;
const PADDING = { left: 36, right: 36, top: 36, bottom: 36 };
const GRAPH_INNER_W = GRAPH_VIEWPORT_W - PADDING.left - PADDING.right;
const GRAPH_INNER_H = GRAPH_VIEWPORT_H - PADDING.top - PADDING.bottom;

export function KeyframeInterpolation() {
  const [selectedId, setSelectedId] = useState('ease-in-quart');
  const cardRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedCurve = CURVES.find((c) => c.id === selectedId) || CURVES[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = CURVES.findIndex((c) => c.id === selectedId);
      let newIndex = currentIndex;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, CURVES.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
      }

      if (newIndex !== currentIndex) {
        const newId = CURVES[newIndex].id;
        setSelectedId(newId);
        cardRefs.current[newId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  return (
    <section id="keyframe-interpolation" className="relative w-full py-12 md:py-16 bg-fx-bg-base">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          {/*
            An <h3> in the subheading style, not the huge gradient <h2> this
            used to carry: it now sits under "Everything you need to animate"
            and should read as part of it rather than as a rival title.
          */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl leading-[1.06] text-white mb-4"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
          >
            Keyframe interpolation
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-fx-text-secondary text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Click any curve to preview its shape
          </motion.p>
        </div>

        <div className="flex gap-6 justify-center items-start">
          <div
            ref={scrollContainerRef}
            className="relative h-[520px] overflow-y-scroll flex-shrink-0"
            style={{
              width: '200px',
              scrollbarWidth: 'none',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex flex-col gap-[8px] py-5 px-1">
              {CURVES.map((curve) => {
                const isSelected = curve.id === selectedId;
                return (
                  <motion.button
                    key={curve.id}
                    ref={(el) => {
                      cardRefs.current[curve.id] = el;
                    }}
                    onClick={() => setSelectedId(curve.id)}
                    aria-label={curve.label}
                    aria-pressed={isSelected}
                    className="relative w-full h-[80px] rounded-xl cursor-pointer transition-all duration-150 flex flex-col items-center justify-center"
                    style={{
                      background: isSelected ? 'rgba(245, 197, 24, 0.12)' : '#1c2952',
                      border: isSelected
                        ? '1px solid rgba(245, 197, 24, 0.5)'
                        : '1px solid #243060',
                    }}
                    whileHover={{
                      background: isSelected ? 'rgba(245, 197, 24, 0.12)' : '#1c2e63',
                      borderColor: isSelected ? 'rgba(245, 197, 24, 0.5)' : 'rgba(245, 197, 24, 0.2)',
                    }}
                  >
                    <svg width="80" height="42" className="mb-1">
                      <polyline
                        points={generateMiniCurvePath(curve.easingFn)}
                        fill="none"
                        stroke={isSelected ? '#F5C518' : 'rgba(245, 197, 24, 0.7)'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.65rem',
                        color: isSelected ? '#F5C518' : '#8B949E',
                      }}
                    >
                      {curve.label}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: '#1c2952',
                border: '1px solid #243060',
                height: '520px',
                width: '520px',
              }}
            >
              <svg
                viewBox={`0 0 ${GRAPH_VIEWPORT_W} ${GRAPH_VIEWPORT_H}`}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={`${selectedCurve.label} easing curve graph`}
                style={{ display: 'block' }}
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F5C518" />
                    <stop offset="100%" stopColor="#F5C518" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`h-${i}`}
                    x1={PADDING.left}
                    y1={PADDING.top + (i * GRAPH_INNER_H) / 4}
                    x2={GRAPH_VIEWPORT_W - PADDING.right}
                    y2={PADDING.top + (i * GRAPH_INNER_H) / 4}
                    stroke="rgba(245,197,24,0.08)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`v-${i}`}
                    x1={PADDING.left + (i * GRAPH_INNER_W) / 4}
                    y1={PADDING.top}
                    x2={PADDING.left + (i * GRAPH_INNER_W) / 4}
                    y2={GRAPH_VIEWPORT_H - PADDING.bottom}
                    stroke="rgba(245,197,24,0.08)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                <line
                  x1={PADDING.left}
                  y1={GRAPH_VIEWPORT_H - PADDING.bottom}
                  x2={GRAPH_VIEWPORT_W - PADDING.right}
                  y2={GRAPH_VIEWPORT_H - PADDING.bottom}
                  stroke="rgba(245,197,24,0.2)"
                  strokeWidth="1"
                />
                <line
                  x1={PADDING.left}
                  y1={PADDING.top}
                  x2={PADDING.left}
                  y2={GRAPH_VIEWPORT_H - PADDING.bottom}
                  stroke="rgba(245,197,24,0.2)"
                  strokeWidth="1"
                />

                <motion.path
                  d={generateSmoothCurvePath(selectedCurve.easingFn, GRAPH_VIEWPORT_W, GRAPH_VIEWPORT_H, PADDING)}
                  fill="none"
                  stroke="#F5C518"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ d: generateSmoothCurvePath(selectedCurve.easingFn, GRAPH_VIEWPORT_W, GRAPH_VIEWPORT_H, PADDING) }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />

                <circle cx={PADDING.left} cy={GRAPH_VIEWPORT_H - PADDING.bottom} r="6" fill="#F5C518" />
                <circle cx={GRAPH_VIEWPORT_W - PADDING.right} cy={PADDING.top} r="6" fill="#F5C518" />
              </svg>
            </div>

            <div className="text-center mt-4">
              <p
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#F5C518',
                }}
              >
                {selectedCurve.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
