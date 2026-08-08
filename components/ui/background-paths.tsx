"use client";

import { motion } from "framer-motion";
import { AmbientProvider, useAmbient, useAmbientActive, loop } from "@/lib/motion";

/*
 * Was 36 paths per side, 72 in total, each animating pathLength, pathOffset and
 * opacity on an infinite loop that ran whether or not the section was on screen
 * (performancemilestones.md P6).
 *
 * SVG stroke-dash animation is CPU work with no compositor fast path, so 72 of
 * them is the most expensive animation on the site. Three changes:
 *
 *   - 12 per side instead of 36. They are layered translucent curves at 4-45%
 *     opacity; two thirds of them were not separable by eye.
 *   - `whileInView` rather than `animate`, so the loop stops when the section
 *     is off screen instead of running for the whole session.
 *   - a deterministic per-index duration. This used to call Math.random()
 *     during render, which is a fresh value on every re-render and a
 *     server/client divergence waiting to happen.
 */
const PATHS_PER_SIDE = 12;

function FloatingPaths({ position }: { position: number }) {
    /*
     * Both FloatingPaths instances read one grant from the AmbientProvider
     * below, so this whole backdrop — 24 animated paths across two SVGs —
     * costs the governor a single slot rather than 24
     * (immersionmilestones.md I1).
     */
    const active = useAmbientActive();

    const paths = Array.from({ length: PATHS_PER_SIDE }, (_, i) => {
        // Spread the original 36-path geometry across 12 so the spacing reads
        // the same; step 3 keeps the first and last curves where they were.
        const g = i * 3;
        return {
            id: i,
            d: `M-${380 - g * 5 * position} -${189 + g * 6}C-${
                380 - g * 5 * position
            } -${189 + g * 6} -${312 - g * 5 * position} ${216 - g * 6} ${
                152 - g * 5 * position
            } ${343 - g * 6}C${616 - g * 5 * position} ${470 - g * 6} ${
                684 - g * 5 * position
            } ${875 - g * 6} ${684 - g * 5 * position} ${875 - g * 6}`,
            color: `rgba(245,197,24,${0.04 + g * 0.012})`,
            width: 0.5 + g * 0.03,
            // Deterministic stand-in for the old Math.random() spread,
            // scattered around the shared `sweep` period.
            duration: loop.sweep - 4 + ((i * 7) % 10),
        };
    });

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke={path.color}
                        strokeWidth={path.width}
                        strokeOpacity={0.08 + path.id * 0.06}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={
                            active
                                ? {
                                      pathLength: 1,
                                      opacity: [0.3, 0.6, 0.3],
                                      pathOffset: [0, 1, 0],
                                  }
                                : // Not "nothing": a composed still frame. A
                                  // backdrop that vanishes when a slot is
                                  // denied reads as a rendering fault.
                                  { pathLength: 1, opacity: 0.5 }
                        }
                        transition={
                            active
                                ? {
                                      duration: path.duration,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "linear",
                                  }
                                : { duration: 0 }
                        }
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
    description,
    children,
}: {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}) {
    const words = title.split(" ");

    /*
     * One slot for the whole backdrop. `priority: 0` — this is decoration, and
     * should lose its slot to a live product demo without argument.
     */
    const { ref, active } = useAmbient<HTMLDivElement>();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-fx-bg-base">
            <div ref={ref} className="absolute inset-0">
                <AmbientProvider active={active}>
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />
                </AmbientProvider>
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                {/*
                  These used `animate`, which fires on mount. This section sits
                  near the bottom of the homepage, so the whole entrance played
                  out — 2s fade, per-letter spring, staggered children — while
                  the visitor was still looking at the hero, and was over before
                  they arrived. `whileInView` with `once` plays it when they get
                  here, which is also when it stops costing anything up front.
                */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1
                        className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8"
                        style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
                    >
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block"
                                        style={{ color: wordIndex === words.length - 1 ? '#f5c842' : '#ffffff' }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-lg sm:text-xl text-fx-text-secondary max-w-2xl mx-auto"
                        >
                            {description}
                        </motion.p>
                    )}
                </motion.div>

                {/*
                  Children sit outside the max-w-4xl wrapper, and wider than it.
                  That width is right for a headline and a one-line description
                  but too narrow for the two side-by-side columns this section
                  now carries. They are also outside the parent's fade, because
                  the cards run their own staggered reveal.
                */}
                {children && <div className="max-w-5xl mx-auto">{children}</div>}
            </div>
        </div>
    );
}
