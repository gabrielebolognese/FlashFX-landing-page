'use client';

import { motion } from 'framer-motion';
import { SplineScene } from '@/components/ui/spline-scene';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { Box, Sparkles, Zap } from 'lucide-react';

export function ThreeDSupport() {
  return (
    <section id="3d-support" className="relative w-full min-h-screen flex items-center justify-center bg-fx-bg-base overflow-hidden">
      <SpotlightAceternity
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(245,197,24,0.4)"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-fx-accent-yellow/[0.04] via-transparent to-orange-500/[0.04]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
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

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
            >
              <span className="text-white">Bring Your Designs Into </span>
              <span style={{ color: '#f5c842' }}>3D Space</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-fx-text-secondary leading-relaxed max-w-xl"
            >
              Create stunning 3D motion graphics that captivate your audience. Import 3D models,
              animate in real-time, and export with lighting and effects that make your content stand out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fx-accent-yellow/15 to-orange-500/15 blur-3xl rounded-full"></div>

            <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-2xl overflow-hidden border border-fx-accent-yellow/[0.15] bg-gradient-to-br from-fx-bg-surface to-fx-bg-raised backdrop-blur-sm shadow-2xl">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base via-transparent to-fx-bg-base/80 pointer-events-none" />
    </section>
  );
}
