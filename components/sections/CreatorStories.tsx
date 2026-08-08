'use client';

import { motion } from 'framer-motion';
import { Clapperboard, Link2, ArrowRight } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { BeamBorder } from '@/components/ui/beam-border';

/*
 * Two ways to earn, side by side. This replaced a "Video Coming Soon"
 * placeholder that occupied the whole section and said nothing.
 *
 * Only the first column is live. The affiliate programme has not launched, so
 * it is deliberately styled down — muted border, no accent, no call to action —
 * and says so in the body copy as well as the badge. A visitor should not be
 * able to skim this and come away thinking they can sign up today.
 *
 * No rates, percentages, view counts or earnings figures appear anywhere here.
 * None have been published, and inventing them on a page that invites people to
 * make money is the kind of claim that has to be defensible.
 */

function EarnCard({
  icon: Icon,
  badge,
  live,
  title,
  children,
  cta,
  delay,
}: {
  icon: typeof Clapperboard;
  badge: string;
  live: boolean;
  title: string;
  children: React.ReactNode;
  cta?: { label: string; href: string };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      className={`group relative h-full flex flex-col text-left p-7 md:p-8 rounded-2xl border backdrop-blur-sm ${
        live
          ? 'bg-fx-bg-surface/80 border-fx-accent-yellow/25'
          : 'bg-fx-bg-surface/40 border-fx-border'
      }`}
    >
      {/*
        The live route gets a continuously circling beam; the unlaunched one
        gets nothing at all. Two of the three signals separating these cards are
        already colour, and motion is the strongest of the three — the card you
        can act on should be the one that is alive
        (immersionmilestones.md I2).
      */}
      {live && <BeamBorder variant="ambient" priority={2} />}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            live
              ? 'bg-fx-accent-yellow/10 border-fx-accent-yellow/25'
              : 'bg-white/[0.03] border-fx-border'
          }`}
        >
          <Icon
            className={`w-5 h-5 ${live ? 'text-fx-accent-yellow' : 'text-fx-text-secondary'}`}
            strokeWidth={1.5}
          />
        </div>

        <span
          className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border whitespace-nowrap ${
            live
              ? 'text-fx-accent-yellow border-fx-accent-yellow/40 bg-fx-accent-yellow/10'
              : 'text-fx-text-secondary border-fx-border bg-white/[0.03]'
          }`}
        >
          {badge}
        </span>
      </div>

      <h3
        className={`text-2xl md:text-3xl font-bold mb-4 ${
          live ? 'text-fx-text-primary' : 'text-fx-text-secondary'
        }`}
      >
        {title}
      </h3>

      <div className="space-y-3 text-fx-text-secondary leading-relaxed text-[15px] flex-1">
        {children}
      </div>

      {cta ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-fx-accent-yellow hover:gap-3 transition-all duration-200"
        >
          {cta.label}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </a>
      ) : (
        <p className="mt-7 font-mono text-xs text-fx-text-secondary/70">
          Nothing to sign up for yet.
        </p>
      )}
    </motion.div>
  );
}

export function CreatorStories() {
  return (
    <section className="relative w-full">
      <BackgroundPaths
        title="Earn with FlashFX"
        description="Two ways to make money with it. One you can start today."
      >
        <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <EarnCard
            icon={Clapperboard}
            badge="Available now"
            live
            title="Make videos, get paid"
            delay={0}
            cta={{ label: 'Start making videos', href: 'https://editor.flashfx.app' }}
          >
            <p>
              Short-form is where the attention is. Whole channels run on nothing but fast,
              repeatable motion graphics, and they pull view counts that would take years to
              build any other way.
            </p>
            <p>
              Sponsorships follow those views. Brands pay for reach, and short-form is the
              cheapest reach on the internet right now. You do not need a huge following to
              get the first deal, you need volume and a look worth stopping for.
            </p>
            <p>
              FlashFX is built for that loop. Animate in the browser, export vertical, post,
              repeat. No install, no overnight render, no reason to skip a day.
            </p>
          </EarnCard>

          <EarnCard
            icon={Link2}
            badge="Coming soon"
            live={false}
            title="Share FlashFX, earn a cut"
            delay={0.1}
          >
            <p>
              Promote FlashFX with a link of your own and take a percentage of what it brings
              in: a share of every person who signs up through you.
            </p>
            <p>
              It scales with you. The bigger your account gets and the more it sends our way,
              the larger that percentage becomes.
            </p>
            <p className="text-fx-text-secondary/70">
              This one is not live yet. Rates and terms have not been announced, and there is
              no waitlist. This section will be updated when the programme opens.
            </p>
          </EarnCard>
        </div>
      </BackgroundPaths>
    </section>
  );
}
