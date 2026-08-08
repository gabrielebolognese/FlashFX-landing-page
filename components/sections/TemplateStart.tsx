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
 * ── The four cards are placeholders, and are built to be replaced ───────────
 *
 * Each one takes an optional `src`. With no image it draws its own field of
 * colour and reads as a designed card rather than a broken one; give it a path
 * and `next/image` takes over. Swapping in real artwork is one line per card,
 * with no other change to the file.
 *
 * No stock imagery was downloaded for them, for the same reasons as the media
 * pool: a licence cannot be verified for a file fetched at build time, and
 * `scripts/check-budgets.mjs` fails the build over 220 kB for any single asset.
 * Real template screenshots are the right content here and they have to come
 * from the product.
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
  level: string;
  /** Drop a path in and the drawn placeholder gives way to the real thing. */
  src?: string;
  /** Two stops for the placeholder field. */
  from: string;
  to: string;
};

const TEMPLATES: Template[] = [
  { title: 'Logo sting', level: 'Beginner', from: '#2D6BE4', to: '#7C5CBF' },
  { title: 'Kinetic titles', level: 'Intermediate', from: '#F5C518', to: '#E86A9B' },
  { title: 'Product reveal', level: 'Advanced', from: '#4ADE80', to: '#2D6BE4' },
  { title: 'The whole toolbox', level: 'Monstrosity', from: '#7C5CBF', to: '#F5C518' },
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
      <div className="relative w-full aspect-video">
        {template.src ? (
          <Image src={template.src} alt={template.title} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${template.from} 0%, ${template.to} 100%)`, opacity: 0.5 }}
            />
            {/* A little structure over the field, so an empty card still reads
                as a composition rather than a swatch. */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,150 Q80,120 160,142 T320,128 L320,180 L0,180 Z" fill="rgba(8,13,30,0.42)" />
              <path d="M0,166 Q90,142 180,160 T320,150 L320,180 L0,180 Z" fill="rgba(8,13,30,0.6)" />
            </svg>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(8,13,30,0) 0%, rgba(8,13,30,0.55) 100%)' }} />
          </>
        )}

        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
          style={{ background: 'rgba(8, 13, 30, 0.72)', color: '#F5C518' }}
        >
          {template.level}
        </span>

        <span
          className="absolute bottom-3 left-4 text-lg sm:text-xl text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {template.title}
        </span>
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
