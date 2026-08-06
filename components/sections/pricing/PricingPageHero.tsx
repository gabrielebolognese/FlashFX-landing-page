'use client';

import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/shimmer-button';

export function PricingPageHero() {
  const scrollToPlans = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-fx-border rounded-card bg-fx-bg-surface text-xs font-mono text-fx-text-secondary uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Free tier — No watermark — No credit card
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
          >
            <span className="text-white">Start free. </span>
            <span style={{ color: '#f5c842' }}>Upgrade only if you need to.</span>
          </h1>
          <p className="text-lg md:text-xl text-fx-text-secondary mb-10 max-w-3xl leading-relaxed">
            The free tier is a real tier, not a trial that expires. Unlimited projects, the
            full editor, and exports with no watermark. Paid plans add AI, full 3D, and team
            collaboration when your work outgrows it.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>Start for Free</ShimmerButton>
            </a>
            <ShimmerButton onClick={scrollToPlans}>Compare Plans</ShimmerButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
