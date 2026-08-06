'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ShimmerButton from '@/components/ui/shimmer-button';
import Image from 'next/image';

export function DualTimeline() {
  return (
    <section id="dual-timeline" className="relative w-full h-[75vh] flex flex-col md:flex-row">
      {/* Left Side - Text */}
      <div className="w-full md:w-1/2 bg-fx-bg-base flex items-center justify-center px-6 py-12 md:py-20 relative overflow-hidden">
        {/* Dotted pattern background */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            color: '#FFA500'
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-fx-accent-yellow to-orange-500 bg-clip-text text-transparent mb-4"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 950, letterSpacing: '-0.02em' }}
          >
            Dual Timeline
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-fx-text-secondary text-lg md:text-xl mb-8"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300 }}
          >
            Edit multiple layers simultaneously
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>
                <span className="flex items-center gap-2">
                  Start editing today
                  <ArrowRight className="w-4 h-4" />
                </span>
              </ShimmerButton>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full md:w-1/2 bg-fx-bg-surface flex items-center justify-center p-0 overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="/dual-timeline.webp"
            alt="FlashFX Dual Timeline"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            quality={90}
          />
        </motion.div>
      </div>
    </section>
  );
}
