'use client';

import { motion } from 'framer-motion';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { Box, Sparkles, Zap } from 'lucide-react';

/*
 * The right-hand column used to hold a `SplineScene` pointing at a
 * prod.spline.design URL. That component is a stub — it renders the words
 * "3D scene unavailable" on a black square — so the section shipped with a
 * large empty box beside the copy. Removed 2026-08-07, and the layout is now a
 * single centred column: the live 3D is the `MorphDemo` in the section
 * immediately below, which is the real answer to what that box was for.
 */
export function ThreeDSupport() {
  return (
    <section id="3d-support" className="relative w-full py-24 md:py-32 flex items-center justify-center bg-fx-bg-base overflow-hidden">
      <SpotlightAceternity
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(245,197,24,0.4)"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-fx-accent-yellow/[0.04] via-transparent to-orange-500/[0.04]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fx-accent-yellow/[0.08] border border-fx-accent-yellow/[0.2] backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-fx-accent-yellow" />
              <span className="text-sm text-fx-text-primary/80 font-medium">Interactive 3D Graphics</span>
            </motion.div>

            {/*
              An <h2>, not an <h1>. The page's h1 is the hero — a second one is
              an SEO problem, and `globals.css` gives every h1 a gradient with
              `-webkit-text-fill-color: transparent`, which inherits into child
              spans and silently swallows any colour set on them. Hence the
              explicit `WebkitTextFillColor` below: belt and braces if this ever
              becomes an h1 again.
            */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
            >
              <span style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                FlashFX has 3 dimensions,{' '}
              </span>
              <span style={{ color: '#f5c842', WebkitTextFillColor: '#f5c842' }}>on the web!</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-fx-text-secondary leading-relaxed max-w-2xl"
            >
              Import 3D models, animate them in real time, and export with lighting and effects —
              all in a browser tab, with nothing to install.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 w-full max-w-2xl text-left"
            >
              <div className="flex items-start gap-3 p-4 rounded-lg bg-fx-bg-surface border border-fx-border backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-fx-accent-yellow/10 border border-fx-accent-yellow/20">
                  <Box className="w-5 h-5 text-fx-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-fx-text-primary font-semibold mb-1">3D Models</h3>
                  <p className="text-sm text-fx-text-secondary">Import and animate any 3D object</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-fx-bg-surface border border-fx-border backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-fx-text-primary font-semibold mb-1">Real-time</h3>
                  <p className="text-sm text-fx-text-secondary">See changes instantly as you create</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base via-transparent to-fx-bg-base/80 pointer-events-none" />
    </section>
  );
}
