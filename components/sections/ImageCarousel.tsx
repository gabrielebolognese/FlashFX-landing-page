'use client';

import dynamic from 'next/dynamic';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAmbient, loop } from '@/lib/motion';

/*
 * three.js is loaded on demand rather than in the initial bundle
 * (performancemilestones.md P5). Decorative background only, so `ssr: false`
 * costs nothing a crawler cares about, and the placeholder matches the
 * shader's own clear colour so nothing flashes or shifts.
 */
const WebGLShader = dynamic(
  () => import('@/components/ui/web-gl-shader').then((m) => m.WebGLShader),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0" style={{ background: '#0a1628' }} />,
  }
);


const images = [
  {
    src: '/shot-180920.webp',
    alt: 'FlashFX 3D Airplane Animation',
  },
  {
    src: '/shot-200913.webp',
    alt: 'FlashFX Brand Strategy Design',
  },
  {
    src: '/shot-202425.webp',
    alt: 'FlashFX Eye Effect with Color Adjustments',
  },
  {
    src: '/shot-204557.webp',
    alt: 'FlashFX Pattern Design',
  },
  {
    src: '/carousel-logo-animation.webp',
    alt: 'FlashFX Logo Animation',
  },
  {
    src: '/carousel-timeline.webp',
    alt: 'FlashFX Project Timeline',
  },
  {
    src: '/back-on-track.webp',
    alt: 'Back on Track Design',
  },
  {
    src: '/easy.webp',
    alt: 'Easy to Use Interface',
  },
  {
    src: '/visuals.webp',
    alt: 'Stunning Visuals',
  },
];

// Duplicate images for seamless loop
const duplicatedImages = [...images, ...images, ...images];

export function ImageCarousel() {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimationControls();

  /*
   * The marquee used to run whenever the visitor was neither dragging nor
   * hovering — which includes the entire time this section is nowhere near the
   * viewport. It was the only continuously running animation in content on the
   * site, and it ran for the whole session (immersionmilestones.md I1).
   *
   * `constraintsRef` and the ambient ref are the same element, so the drag
   * bounds are unchanged.
   */
  const { ref: constraintsRef, active } = useAmbient<HTMLDivElement>();

  const imageWidth = 490; // 700 * 0.7 = 490px (30% smaller)
  const gap = 24; // 6 * 4 = 24px
  const totalWidth = (imageWidth + gap) * images.length;

  useEffect(() => {
    if (active && !isDragging && !isHovering) {
      controls.start({
        x: -totalWidth,
        transition: {
          duration: loop.crawl,
          ease: 'linear',
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [active, isDragging, isHovering, controls, totalWidth]);

  return (
    <section className="relative w-full py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <WebGLShader />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-center mb-4"
          style={{ fontFamily: 'Georgia, var(--font-cormorant), serif', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#f5c842' }}>See</span><span className="text-white"> what it looks like</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-fx-text-secondary text-center text-lg"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          Drag to explore real projects created with FlashFX
        </motion.p>
      </div>

      <div
        ref={constraintsRef}
        className="relative z-10 w-full h-[350px] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -totalWidth * 2, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={controls}
          className="flex gap-6 absolute left-0"
          style={{ paddingLeft: '10%' }}
        >
          {duplicatedImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % images.length) * 0.05 }}
              className="relative flex-shrink-0 w-[490px] h-[350px] rounded-lg overflow-hidden shadow-2xl border border-fx-border"
              whileHover={!isDragging ? { scale: 1.05 } : {}}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover pointer-events-none"
                draggable={false}
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fx-bg-base/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <p className="text-fx-accent-yellow text-sm font-medium" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-8 text-center">
        <p className="text-fx-text-secondary text-sm" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          ← Drag to explore more →
        </p>
      </div>
    </section>
  );
}
