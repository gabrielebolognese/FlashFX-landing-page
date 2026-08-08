'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * "Not sure where to start? Start with a template!"
 *
 * Sits under the procedural section, at the point where the page has finished
 * showing what the editor can do and a visitor might reasonably wonder how they
 * would ever make any of it themselves.
 *
 * ── Real screenshots, not placeholders ──────────────────────────────────────
 *
 * The cards were drawn placeholders until the owner supplied four screenshots of
 * the templates open in the editor. Everything on them now comes from those
 * images: the names, the blurbs, and the "Scenes" category. Nothing here is
 * invented, which is the point — the whole argument of the section is that these
 * are things the product actually ships.
 *
 * ── Where the button goes ───────────────────────────────────────────────────
 *
 * The editor, because there is no templates gallery to send anyone to. There is
 * no `/templates` route and no templates subdomain — blog, documentation,
 * editor and roadmap are the only ones the site knows about. A button labelled
 * "Explore all templates" pointing at a URL that does not exist is FIX.md M6
 * all over again. Point it somewhere better the moment somewhere better exists.
 */

type Template = {
  title: string;
  /** The description the editor itself shows for this template. */
  blurb: string;
  src: string;
};

/*
 * The four are real templates, and everything here is read off the editor
 * screenshots in `public/templates/` rather than invented: the names are the
 * layer names, and the blurbs are the descriptions the editor's own animation
 * browser prints under each one. All four are in its "Scenes" category.
 *
 * The screenshots arrived as PNGs between 203 and 223 kB, and two of them were
 * over the 220 kB per-asset budget that `scripts/check-budgets.mjs` fails the
 * build on. They are WebP at 1200px now: 860 kB down to 165 kB, 81% less, for
 * cards that render around 500px wide. Re-export at that width if they are ever
 * replaced.
 */
const TEMPLATES: Template[] = [
  {
    title: 'City Skyline',
    blurb: 'A night skyline with a glowing moon and twinkling windows.',
    src: '/templates/cityskyline.webp',
  },
  {
    title: 'Forest',
    blurb: 'Layered trees swaying in the breeze with drifting leaves.',
    src: '/templates/forest.webp',
  },
  {
    title: 'Galaxy',
    blurb: 'A glowing core with planets orbiting on tilted rings over a starfield.',
    src: '/templates/galaxy.webp',
  },
  {
    title: 'Rocket Launch',
    blurb: 'A rocket lifts off with a flickering flame past twinkling stars.',
    src: '/templates/rocketlaunch.webp',
  },
];

function TemplateCard({ template, index }: { template: Template; index: number }) {
  return (
    <motion.a
      href="https://editor.flashfx.app"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      /*
       * `fx-template` carries the hover: a small scale and a glow, in CSS rather
       * than a framer `whileHover`. The reveal above is a one-shot on arrival, so
       * framer is right for it; a hover that fires on every pass is not worth a
       * JavaScript animation when one transition property does the same job.
       */
      className="fx-template group relative block rounded-2xl overflow-hidden border border-fx-border"
    >
      {/*
        The screenshots are 1200x615, which is 1.95:1 rather than a video's 1.78.
        The card takes the image's own ratio instead of forcing 16:9 and cropping
        with `object-cover` — 9% off the sides of an editor screenshot would eat
        into the left tool rail and the properties panel on the right, which are
        most of what makes it read as an editor at all.
      */}
      <div className="relative w-full aspect-[1200/615]">
        <Image
          src={template.src}
          alt={`The ${template.title} template open in the FlashFX editor`}
          fill
          sizes="(min-width: 640px) 46vw, 90vw"
          className="object-cover"
        />

        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
          style={{ background: 'rgba(8, 13, 30, 0.78)', color: '#F5C518' }}
        >
          Scenes
        </span>
      </div>

      {/* Name and blurb sit under the picture rather than over it: laid on top
          they covered the timeline, which is the part of the screenshot doing
          the arguing. */}
      <div className="px-5 py-4">
        <span
          className="block text-lg sm:text-xl text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {template.title}
        </span>
        <span className="mt-1 block text-sm text-fx-text-secondary leading-relaxed">{template.blurb}</span>
      </div>
    </motion.a>
  );
}

export function TemplateStart() {
  return (
    <section id="templates" className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl leading-[1.06] text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Not sure where to start?{' '}
          <span style={{ color: '#f5c842' }}>Start with a template!</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-center text-xl sm:text-2xl md:text-3xl leading-snug text-fx-text-primary/90 max-w-4xl mx-auto"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          Ten tutorial templates, from beginner to absolute monstrosity. See what FlashFX
          can do, right up to its limits.
        </motion.p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {TEMPLATES.map((template, i) => (
            <TemplateCard key={template.title} template={template} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CtaButton href="https://editor.flashfx.app" size="lg">
            Explore all templates
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
