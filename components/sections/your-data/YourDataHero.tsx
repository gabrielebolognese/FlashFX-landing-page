import { Card } from '@/components/ui/fx-card';
import { RichText } from './RichText';
import { keyPoints, lastUpdated, legalEntity } from './yourDataContent';

/*
 * Server component, no framer-motion. Reveal-on-scroll is wrong for a document
 * someone may be reading carefully, printing, or reading with assistive tech.
 */
export function YourDataHero() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Privacy</p>
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
        >
          <span className="text-white">Your data in </span>
          <span style={{ color: '#f5c842' }}>FlashFX</span>
        </h1>
        <p className="text-lg md:text-xl text-fx-text-secondary max-w-3xl leading-relaxed mb-3">
          What we collect, why, how long we keep it, and how to make us delete it. In full,
          in plain language, on one page.
        </p>
        <p className="font-mono text-xs text-fx-text-secondary uppercase tracking-wider mb-12">
          {legalEntity}: last updated {lastUpdated}
        </p>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-fx-text-primary mb-6">
          The short version
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyPoints.map((point) => (
            <Card key={point.question} className="h-full">
              <h3 className="text-base font-medium text-fx-text-primary mb-2">{point.question}</h3>
              <p className="text-sm text-fx-text-secondary leading-relaxed">
                <RichText text={point.answer} />
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
