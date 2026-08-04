'use client';

import { motion } from 'framer-motion';
import { LazyYouTube } from '@/components/ui/lazy-youtube';
import { ElegantShape } from '@/components/ui/elegant-shapes';

export function LoadTime() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-fx-bg-base">
      <div className="absolute inset-0 bg-gradient-to-br from-fx-accent-yellow/[0.05] via-transparent to-orange-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-yellow-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-amber-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-yellow-400/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-600/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-yellow-300/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl leading-tight bg-gradient-to-r from-fx-accent-yellow to-orange-500 bg-clip-text text-transparent mb-6"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Load Time
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-fx-text-secondary text-xl md:text-2xl max-w-3xl mx-auto mb-16"
          >
            Lightning fast performance that keeps you in the creative flow
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-yellow-500/[0.15]">
            <LazyYouTube
              src="https://www.youtube.com/embed/N1VDnFOIeRg?autoplay=1&mute=1&loop=1&playlist=N1VDnFOIeRg&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1"
              title="FlashFX Load Time Demo"
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base via-transparent to-fx-bg-base/80 pointer-events-none" />
    </section>
  );
}
