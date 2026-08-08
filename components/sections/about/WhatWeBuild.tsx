'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function WhatWeBuild() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-8 md:mb-12"
        >
          What FlashFX Is
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 text-lg text-fx-text-secondary leading-relaxed"
        >
          <p>
            Professional motion graphics has historically meant a multi-gigabyte desktop
            install, a monthly subscription, and hardware to match. FlashFX takes the opposite
            approach. You open a browser tab and start animating. Nothing to download, no
            licence to activate, no render queue to sit through.
          </p>
          <p>
            The editor covers the work most creators actually do: a keyframe timeline with
            custom easing, a library of animation presets, text and shape animation, 3D
            support, project sharing, and export to MP4, WebM, and GIF. There is a free tier,
            and it exports without a watermark.
          </p>
          <p>
            FlashFX is positioned as an alternative to After Effects and Premiere Pro, not a
            clone of every feature they have. Studio-grade compositing and plugin-dependent
            pipelines still belong in those tools. Everything else is the work FlashFX is
            built for: channel intros, lower thirds, social clips, explainer animation,
            presentation graphics. And it does that work on hardware those tools would
            refuse to run on.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 bg-fx-bg-surface border border-fx-border rounded-card p-6"
        >
          <p className="text-fx-text-secondary leading-relaxed">
            If you are weighing it against what you already use, we keep a detailed{' '}
            <Link href="/after-effects-alternative" className="text-fx-accent-blue hover:underline">
              comparison with After Effects
            </Link>{' '}
            and a breakdown of{' '}
            <Link href="/free-motion-graphics-software" className="text-fx-accent-blue hover:underline">
              what the free tier actually includes
            </Link>
            . The editor itself is at{' '}
            <a
              href="https://editor.flashfx.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fx-accent-blue hover:underline"
            >
              editor.flashfx.app
            </a>
            , and the documentation is at{' '}
            <a
              href="https://documentation.flashfx.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fx-accent-blue hover:underline"
            >
              documentation.flashfx.app
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
