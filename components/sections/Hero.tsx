'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * The hero opens on the cube animation, not on a headline
 * (immersionmilestones.md I8, 2026-08-07).
 *
 * Cubes stream past the camera and settle into the FlashFX lockup over three
 * and a half seconds. The light rays come up behind them at 2.7 s — under the
 * tail of the flight rather than after it, so the two overlap instead of
 * handing over. The shader is not mounted at all before that, which keeps it
 * from competing with the thing the eye should be following and stops three.js
 * being fetched twice at once during the most load-sensitive moment on the
 * site.
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

/** When the light rays arrive, measured from mount. */
const RAYS_AT = 2700;

/**
 * Longest we will wait for the cubes to report landing before showing the
 * button anyway.
 *
 * The button is the hero's only call to action, so unlike the rays it cannot be
 * allowed to depend on whether the animation ran — no WebGL, a blocked font or
 * a failed image would otherwise leave the hero with nothing to click.
 */
const CTA_FALLBACK = 6500;

export function Hero() {
  const [raysOn, setRaysOn] = useState(false);
  const [landed, setLanded] = useState(false);

  /*
   * A plain timer from mount, not a callback from the animation.
   *
   * Gating on the cubes landing tied the background to whether the animation
   * ran at all — a blocked font, a failed image or no WebGL and the hero would
   * simply never get its rays. On a clock it always arrives, and it arrives at
   * the same moment for everyone regardless of how fast the chunk loaded.
   */
  useEffect(() => {
    const id = window.setTimeout(() => setRaysOn(true), RAYS_AT);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (landed) return;
    const id = window.setTimeout(() => setLanded(true), CTA_FALLBACK);
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
      {raysOn && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <ShaderAnimation active />
        </motion.div>
      )}

      {/*
        The canvas is the whole viewport, not a band inside it.

        The cubes begin close to the camera and well outside the frame, so a
        short container clipped the stream against its own edges — the animation
        looked cut off at top and bottom while it was still the most interesting
        part. Full height gives the flight somewhere to happen; the lockup
        itself stays centred, sized by `FILL`.

        `pointer-events-none` so it cannot swallow clicks on the button that
        sits over it.
      */}
      <LogoAssembly
        className="absolute inset-0 pointer-events-none"
        duration={3.5}
        onDone={() => setLanded(true)}
      />

      <div className="absolute inset-x-0 bottom-[9vh] z-10 flex flex-col items-center text-center px-6">
        {/*
          The headline is drawn in cubes now, so it is no longer text on screen.
          It is still the page's <h1>: deleting it would take the primary
          heading off the homepage of a site whose entire FIX.md programme is
          about how search engines read this page. It stays in the markup,
          server-rendered, and out of the way visually.

          With the sub-heading gone too, the button below is the only text the
          hero paints — see the note on its own gating there.
        */}
        <h1 className="sr-only">Make Animations with FlashFX</h1>

        {/*
          Held back until the cubes have landed, on the owner's instruction, so
          the button does not compete with the animation.

          The cost is worth stating: this is the only text the hero paints, so
          it is the LCP element — and an element that is invisible does not
          count as painted. Homepage LCP is therefore roughly the moment the
          animation finishes, around 3.5 s after the chunk mounts, rather than
          first paint. Everything else P1 protects still holds (the hero is not
          gated, nothing blocks render); this is a deliberate design trade, not
          a regression that crept in.
        */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={landed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ pointerEvents: landed ? 'auto' : 'none' }}
        >
          <CtaButton href="https://editor.flashfx.app" size="lg">
            Open the editor, it&rsquo;s free
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
