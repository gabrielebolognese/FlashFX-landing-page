import { TermlyEmbed } from '@/components/TermlyEmbed';
import { SectionDivider } from '@/components/ui/SectionDivider';

/*
 * Shared shell for the four Termly-backed policy pages. They differ only by
 * title, standfirst, and Termly document id — so they share this rather than
 * existing as four near-identical files that drift apart.
 *
 * No framer-motion here on purpose: reveal-on-scroll animation is wrong for a
 * document someone may be reading carefully or printing.
 */
export function PolicyLayout({
  eyebrow,
  title,
  standfirst,
  dataId,
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
  dataId: string;
}) {
  return (
    <main>
      <section className="relative w-full px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">{eyebrow}</p>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">{title}</span>
          </h1>
          <p className="text-lg text-fx-text-secondary max-w-3xl leading-relaxed">{standfirst}</p>
        </div>
      </section>

      <SectionDivider />

      <section className="relative w-full px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/*
            Termly injects its own markup and styling into this container. Do not
            wrap it in prose classes or typography plugins — they fight the
            embed's own stylesheet and the result is unreadable.
          */}
          <div className="termly-policy text-fx-text-secondary">
            <TermlyEmbed dataId={dataId} />
          </div>
        </div>
      </section>
    </main>
  );
}
