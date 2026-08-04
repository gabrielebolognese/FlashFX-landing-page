'use client';

import { motion } from 'framer-motion';
import { useRef, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import { editorFeatures, FeatureItem } from './feature-highlights/editorFeatures';
import { animationPresets, AnimationPresetItem } from './feature-highlights/animationPresets';
import { editableProperties, PropertyItem } from './feature-highlights/editableProperties';

type CardItem = FeatureItem | AnimationPresetItem | PropertyItem;

function FeatureCard({ item, index, showCategory }: { item: CardItem; index: number; showCategory?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const { Icon } = item as { Icon: LucideIcon };
  const category = 'category' in item ? (item as AnimationPresetItem).category : undefined;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.background = `radial-gradient(260px circle at ${x}% ${y}%, rgba(245, 197, 24, 0.14), transparent 70%)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(-5px)';
      iconRef.current.style.filter = 'drop-shadow(0 8px 16px rgba(245, 197, 24, 0.4))';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.background = 'transparent';
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(0px)';
      iconRef.current.style.filter = 'none';
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: (index % 10) * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative h-full rounded-2xl overflow-hidden cursor-default"
        style={{
          background: 'rgba(20, 31, 64, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(230, 237, 243, 0.1)',
          borderTopColor: 'rgba(230, 237, 243, 0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(230,237,243,0.06) inset',
        }}
      >
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-10 transition-none"
          style={{ background: 'transparent', borderRadius: 'inherit' }}
        />

        <div className="relative z-20 p-5 h-full flex flex-col">
          {showCategory && category && (
            <span
              className="text-xs font-medium mb-3 tracking-wider uppercase"
              style={{ color: 'rgba(245, 197, 24, 0.5)', fontFamily: 'var(--font-lexend)' }}
            >
              {category}
            </span>
          )}
          <div
            ref={iconRef}
            className="mb-3 w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.16) 0%, rgba(245, 197, 24, 0.05) 100%)',
              border: '1px solid rgba(245, 197, 24, 0.22)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
            }}
          >
            <Icon className="w-4 h-4 text-fx-accent-yellow" strokeWidth={1.5} />
          </div>

          <h3
            className="text-sm font-normal text-fx-text-primary mb-1.5"
            style={{ fontFamily: 'var(--font-lexend)', fontWeight: 400 }}
          >
            {item.title}
          </h3>
          <p className="text-fx-text-secondary text-xs leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({
  title,
  subtitle,
  items,
  showCategory,
  indexOffset,
}: {
  title: string;
  subtitle: string;
  items: CardItem[];
  showCategory?: boolean;
  indexOffset: number;
}) {
  return (
    <div className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h3
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: 'var(--font-lexend)', fontWeight: 600 }}
        >
          {title}
        </h3>
        <p className="text-fx-text-secondary text-sm">{subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-5 gap-4">
        {items.map((item, index) => (
          <FeatureCard
            key={item.title}
            item={item}
            index={indexOffset + index}
            showCategory={showCategory}
          />
        ))}
      </div>
    </div>
  );
}

export function FeatureHighlights() {
  return (
    <section className="relative w-full pt-24 bg-fx-bg-base">
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-[2] bg-gradient-to-b from-fx-bg-base via-transparent to-transparent" />

      <div className="relative z-[10] max-w-screen-2xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-20"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#f5c842' }}>Everything</span>
          <span className="text-white"> FlashFX can do</span>
        </motion.h2>

        <CategorySection
          title="Editor Features"
          subtitle="The full suite of tools built into the FlashFX editor"
          items={editorFeatures}
          indexOffset={0}
        />

        <CategorySection
          title="Editable Properties"
          subtitle="Every visual property you can control and animate on any element"
          items={editableProperties}
          indexOffset={editorFeatures.length}
        />

        <CategorySection
          title="Animation Presets"
          subtitle="Ready-to-use preset animations for elements and text"
          items={animationPresets}
          showCategory
          indexOffset={editorFeatures.length + editableProperties.length}
        />
      </div>

      <div
        style={{
          width: '100%',
          height: '140vh',
          lineHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fix copy.png"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
          }}
        />
      </div>

      <div
        className="relative w-full text-center"
        style={{
          background: '#141f40',
          paddingTop: '1rem',
          paddingBottom: '7rem',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            color: '#f5c842',
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1,
          }}
        >
          And so much more
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '3rem auto 0',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {[
            'Like the 300+ 3D features',
            '110 image effect filters',
            'Team collaboration features',
            'Not to mention all marketplace templates',
            'And all AI features',
          ].map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
              style={{
                color: 'rgba(230, 237, 243, 0.55)',
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#f5c842', fontSize: '0.6em', opacity: 0.7 }}>—</span>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
