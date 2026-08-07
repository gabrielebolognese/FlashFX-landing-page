'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { Box, Sparkles, Zap } from 'lucide-react';

/*
 * Copy on the left, a rotatable A380 on the right (immersionmilestones.md I8).
 *
 * Two things used to be wrong here. The right column held a `SplineScene`
 * pointing at a prod.spline.design URL, and that component is a stub which
 * renders the words "3D scene unavailable" on a black square — so the section
 * shipped with a large empty box. And the 3D itself lived in a separate
 * full-width section below, which made the page a screen longer for one object.
 *
 * Both fixed on 2026-08-07: the stub is gone and the model has moved into the
 * space it left, which removed a whole section from the homepage.
 */
const PlaneViewer = dynamic(
  () => import('@/components/demos/PlaneViewer').then((m) => m.PlaneViewer),
  {
    ssr: false,
    // Sized placeholder so nothing shifts when the chunk lands. `ssr: false` is
    // right twice over: WebGL needs a browser, and there is nothing here a
    // crawler wants that the copy beside it does not already say.
    loading: () => <div className="absolute inset-0" />,
  }
);

export function ThreeDSupport() {
  return (
    <section
      id="3d-support"
      className="relative w-full py-20 md:py-28 flex items-center justify-center bg-fx-bg-base overflow-hidden"
    >
      <SpotlightAceternity
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(245,197,24,0.4)"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-fx-accent-yellow/[0.04] via-transparent to-orange-500/[0.04]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fx-accent-yellow/[0.08] border border-fx-accent-yellow/[0.2] backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-fx-accent-yellow" />
              <span className="text-sm text-fx-text-primary/80 font-medium">
                Interactive 3D Graphics
              </span>
            </div>

            {/*
              An <h2>, not an <h1>. The page's h1 is the hero, and `globals.css`
              gives every h1 a gradient with `-webkit-text-fill-color:
              transparent` which inherits into child spans and silently swallows
              any colour set on them — hence the explicit `WebkitTextFillColor`,
              as insurance if this ever becomes an h1 again.
            */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08]"
              style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
            >
              <span style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                FlashFX has 3 dimensions,{' '}
              </span>
              <span style={{ color: '#f5c842', WebkitTextFillColor: '#f5c842' }}>on the web!</span>
            </h2>

            <p className="text-lg md:text-xl text-fx-text-secondary leading-relaxed max-w-xl">
              Import 3D models, animate them in real time, and export with lighting and effects —
              all in a browser tab, with nothing to install.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-fx-bg-surface border border-fx-border backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-fx-accent-yellow/10 border border-fx-accent-yellow/20 flex-shrink-0">
                  <Box className="w-5 h-5 text-fx-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-fx-text-primary font-semibold mb-1">3D Models</h3>
                  <p className="text-sm text-fx-text-secondary">Import and animate any 3D object</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-fx-bg-surface border border-fx-border backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-fx-text-primary font-semibold mb-1">Real-time</h3>
                  <p className="text-sm text-fx-text-secondary">See changes instantly as you create</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full"
          >
            {/*
              No panel, no border. The viewer blends into the section rather
              than sitting in a box — the same call made when the 3D lived in
              its own section.
            */}
            <div
              className="absolute left-1/2 top-1/2 w-[78%] h-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(245,197,24,0.11) 0%, rgba(124,92,191,0.07) 42%, transparent 72%)',
              }}
            />
            <PlaneViewer className="relative w-full aspect-[4/3] lg:aspect-square" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base via-transparent to-fx-bg-base/80 pointer-events-none" />
    </section>
  );
}
