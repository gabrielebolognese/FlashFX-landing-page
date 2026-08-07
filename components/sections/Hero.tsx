'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ShimmerButton from '@/components/ui/shimmer-button';

/*
 * The hero opens on the cube animation, not on a headline
 * (immersionmilestones.md I8, 2026-08-07).
 *
 * Cubes stream past the camera and settle into the FlashFX lockup over three
 * and a half seconds. Only once they have landed do the light rays come up
 * behind them — the shader is not mounted at all until then, so it cannot
 * compete with the thing the eye should be following, and three.js is not
 * fetched twice at once during the most load-sensitive moment on the site.
 *
 * `ssr: false` on both is right twice over: WebGL needs a browser, and neither
 * carries content a crawler wants — see the note on the <h1> below.
 */

const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-animation').then((m) => m.ShaderAnimation),
  { ssr: false, loading: () => null }
);

const LogoAssembly = dynamic(
  () => import('@/components/demos/LogoAssembly').then((m) => m.LogoAssembly),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
);

export function Hero() {
  const [landed, setLanded] = useState(false);

  /*
   * Safety net. The rays are gated on the animation finishing, and the
   * animation can decline to start — a failed font load, a blocked image, no
   * WebGL at all. None of those should cost the hero its background, so hand it
   * over on a timer regardless. Generous enough never to fire on a normal run.
   */
  useEffect(() => {
    if (landed) return;
    const id = window.setTimeout(() => setLanded(true), 7000);
    return () => window.clearTimeout(id);
  }, [landed]);

  return (
    /*
     * The base colour matches the shader's own clear colour, so the hero is
     * never a hole in the page during the seconds before the rays mount, and
     * nothing shifts in tone when they arrive.
     */
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#06091C' }}
    >
      {landed && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <ShaderAnimation active />
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full">
        {/*
          The headline is drawn in cubes now, so it is no longer text on screen.
          It is still the page's <h1>: deleting it would take the primary
          heading off the homepage of a site whose entire FIX.md programme is
          about how search engines read this page. It stays in the markup,
          server-rendered, and out of the way visually.

          Note this also moves LCP off the headline and onto the sub-heading
          below, which is server-rendered and paints immediately — the hero is
          not gated on the animation (performancemilestones.md P1, which exists
          because a gate here once kept the LCP element out of the DOM entirely).
        */}
        <h1 className="sr-only">Make Animations with FlashFX</h1>

        <LogoAssembly
          className="relative w-full h-[34vh] min-h-[190px] md:h-[40vh]"
          duration={3.5}
          onDone={() => setLanded(true)}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="text-xl md:text-2xl text-white/80 mt-4 mb-10 max-w-3xl"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          Professional motion graphics in your browser. No installation, no complexity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
            <ShimmerButton>Get Started</ShimmerButton>
          </a>
          <a href="#demo">
            <ShimmerButton>Watch Demo</ShimmerButton>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
