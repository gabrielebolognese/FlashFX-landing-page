'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

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

export function Hero() {
  const [raysOn, setRaysOn] = useState(false);

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
      <LogoAssembly className="absolute inset-0 pointer-events-none" duration={3.5} />

      <div className="absolute inset-x-0 bottom-[9vh] z-10 flex flex-col items-center text-center px-6">
        {/*
          The headline is drawn in cubes now, so it is no longer text on screen.
          It is still the page's <h1>: deleting it would take the primary
          heading off the homepage of a site whose entire FIX.md programme is
          about how search engines read this page. It stays in the markup,
          server-rendered, and out of the way visually.

          With the sub-heading gone too, the button below is the only text the
          hero paints, so LCP is now the button. It is server-rendered and not
          gated on the animation (performancemilestones.md P1, which exists
          because a gate here once kept the LCP element out of the DOM entirely).
        */}
        <h1 className="sr-only">Make Animations with FlashFX</h1>

        {/*
          One button, and it is now the only text the hero paints — which makes
          it the LCP element. It is server-rendered and not gated on the cube
          animation, so it is there at first paint whatever the WebGL chunk is
          doing (performancemilestones.md P1).
        */}
        <motion.a
          href="https://editor.flashfx.app"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
          className="fx-cta group inline-flex items-center gap-3 sm:gap-4 rounded-full px-8 sm:px-12 py-4 sm:py-6 text-fx-bg-base font-semibold text-lg sm:text-2xl md:text-[26px] tracking-tight"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Open the editor, it&rsquo;s free
          <ArrowRight
            className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </motion.a>
      </div>
    </section>
  );
}
