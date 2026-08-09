'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CtaButton } from '@/components/ui/cta-button';
import { EDITOR_URL } from '@/lib/editor';

/*
 * "Flat layers, and a camera that moves through them."
 *
 * Sits under the procedural section, at the end of the capability run. It is
 * the last and largest claim on the page about what the editor can do, and the
 * order is deliberate: particles and procedural animation are both about
 * generating things, and this is about moving through what you already have.
 *
 * ── Full width, not split ───────────────────────────────────────────────────
 *
 * The demo renders the rig and the camera's own shot side by side inside one
 * canvas, and the argument only lands if both are big enough to compare. A
 * copy column beside it would take half the width and leave the inset the size
 * of a postage stamp. So the copy sits above and the canvas takes the viewport,
 * the same shape `ProceduralAnimation` uses and for the same reason.
 *
 * ── What is claimed here ────────────────────────────────────────────────────
 *
 * That FlashFX has a 2.5D camera, that it turns flat layers into a scene with
 * depth, and that doing this on the web is hard. All three are the owner's,
 * stated 2026-08-09 and recorded in FIX.md under *Canonical facts*.
 *
 * What is **not** claimed: any world first, any benchmark, any comparison to a
 * named competitor's camera, and no feature list. The bullets under the other
 * feature blocks came from `editorFeatures.ts` or from the owner directly, and
 * there is no such source for this one yet — inventing four plausible lines
 * about a camera system would be exactly the thing CLAUDE.md forbids. Add them
 * when they arrive.
 */
const CameraRig = dynamic(() => import('@/components/demos/CameraRig').then((m) => m.CameraRig), {
  ssr: false,
  // The section below reserves the height, so there is nothing to size here
  // and nothing moves when the chunk lands.
  loading: () => <div className="absolute inset-0" />,
});

export function DepthCamera() {
  return (
    <section id="camera" className="relative w-full py-20 md:py-28 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white max-w-5xl mx-auto"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Flat layers, and a{' '}
        <span style={{ color: '#f5c842' }}>2.5D camera</span> that moves through them
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-6 px-6 text-center text-lg md:text-xl leading-relaxed text-fx-text-secondary max-w-3xl mx-auto"
      >
        Stand your layers at different depths and push a real camera through them.
        Nothing is redrawn: the near ones sweep past, the far ones barely shift,
        and flat artwork becomes a scene with somewhere to go.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="mt-5 px-6 text-center text-base md:text-lg text-fx-text-primary/85 max-w-3xl mx-auto"
      >
        This is the hardest thing we have put in a browser tab, and one of the
        biggest things the web has been able to do with motion.
      </motion.p>

      {/*
        Full-bleed and tall. The rig on the left needs room for five layers to
        stand apart, and the shot in the corner has to stay large enough to read
        as a shot rather than as a thumbnail.
      */}
      <div className="relative mt-12 md:mt-16 w-screen left-1/2 -translate-x-1/2 h-[78vh] min-h-[480px] md:min-h-[620px]">
        <CameraRig className="absolute inset-0" />
      </div>

      <div className="mt-10 flex justify-center px-6">
        <CtaButton href={EDITOR_URL} size="md">
          Move a camera through your own layers
        </CtaButton>
      </div>
    </section>
  );
}
