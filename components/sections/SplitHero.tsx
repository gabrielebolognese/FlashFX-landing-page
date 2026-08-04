'use client';

import { motion } from 'framer-motion';
import { Circle, Square, Type, Pen, Image, Box, Layers, Sparkles, ArrowRight } from 'lucide-react';
import ShimmerButton from '@/components/ui/shimmer-button';
import { useState } from 'react';
import { LazyYouTube } from '@/components/ui/lazy-youtube';

const floatingIcons = [
  { Icon: Circle, top: '15%', left: '8%', rotation: -12, delay: 0 },
  { Icon: Square, top: '28%', left: '5%', rotation: 8, delay: 0.2 },
  { Icon: Type, top: '45%', left: '10%', rotation: -15, delay: 0.4 },
  { Icon: Pen, top: '62%', left: '6%', rotation: 20, delay: 0.6 },
  { Icon: Image, top: '75%', left: '12%', rotation: -8, delay: 0.8 },
  { Icon: Box, top: '20%', left: '15%', rotation: 15, delay: 1 },
  { Icon: Layers, top: '52%', left: '18%', rotation: -10, delay: 1.2 },
  { Icon: Sparkles, top: '82%', left: '8%', rotation: 12, delay: 1.4 },
];

function FloatingIcon({ Icon, top, left, rotation, delay }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.3, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        top,
        left,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <Icon
        className={`w-8 h-8 transition-all duration-300 ${
          isHovered
            ? 'text-fx-accent-yellow drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]'
            : 'text-fx-text-secondary'
        }`}
        strokeWidth={1.5}
      />
    </motion.div>
  );
}

export function SplitHero() {
  return (
    <section id="demo" className="relative w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Text */}
      <div className="w-full md:w-1/2 bg-fx-bg-base flex items-center justify-center px-6 py-32 md:py-20 relative overflow-hidden">
        {/* Gold gradient overlay at top */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '35vh',
            background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.2) 0%, transparent 100%)',
          }}
        />

        {/* Dotted pattern background */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            color: '#FFA500'
          }}
        />

        {/* Floating Icons */}
        {floatingIcons.map((props, i) => (
          <FloatingIcon key={i} {...props} />
        ))}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-fx-accent-yellow to-orange-500 bg-clip-text text-transparent mb-4"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 950, letterSpacing: '-0.02em' }}
          >
            Create Motion Graphics Faster
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-fx-text-secondary text-lg md:text-xl mb-8"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300 }}
          >
            All on web, even 3D
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="https://discord.gg/VkSrB55HWg" target="_blank" rel="noopener noreferrer">
              <ShimmerButton>
                Join Discord
              </ShimmerButton>
            </a>
            <a href="https://editor.flashfx.app" target="_blank" rel="noopener noreferrer">
              <ShimmerButton
                style={{ fontSize: '16px', fontWeight: 400 }}
              >
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </span>
              </ShimmerButton>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - YouTube Video */}
      <div className="w-full md:w-1/2 bg-fx-bg-surface flex items-center justify-center p-0 overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full h-full min-h-[400px] md:min-h-screen relative overflow-hidden"
        >
          <LazyYouTube
            src="https://www.youtube.com/embed/lExZR785eI0?autoplay=1&mute=1&loop=1&playlist=lExZR785eI0&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1"
            title="FlashFX Demo"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            style={{
              width: '177.78vh',
              height: '100vh',
              minHeight: '400px',
              border: 'none',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
