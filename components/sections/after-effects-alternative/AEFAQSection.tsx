'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const aeFaqData = [
  {
    question: 'Is FlashFX completely free?',
    answer: 'Yes. FlashFX has a free tier with no watermark and access to core motion graphics features including timeline editing, basic effects, and MP4 export. A paid tier with advanced templates, additional export formats, and priority rendering is available for creators who need more capabilities. See the pricing page for detailed feature comparisons.',
  },
  {
    question: 'Can FlashFX replace After Effects for professional work?',
    answer: 'For most creator use cases — including YouTube intros, social media reels, presentation animations, and explainer videos — FlashFX provides all the necessary tools without the complexity of After Effects. For highly specialized studio-level VFX compositing, advanced 3D rendering, and complex plugin-dependent workflows, After Effects remains the industry standard. However, the vast majority of creators do not need that level of capability for their day-to-day content production.',
  },
  {
    question: 'Does FlashFX work on a low-end PC or Chromebook?',
    answer: 'Yes. FlashFX is optimized to run in any modern web browser and requires approximately 4GB of RAM for smooth operation. It works perfectly on Chromebooks, older Windows laptops, and budget MacBooks where After Effects would not install or would crash frequently. There is no need for a dedicated GPU or high-end processor. If you can browse the web, you can use FlashFX.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No. FlashFX is entirely browser-based. Simply navigate to the FlashFX URL, and you have immediate access to the full editing interface. There is no download, no installation wizard, no Creative Cloud account requirement, and no disk space consumed on your local drive. Updates happen automatically without any action required from you.',
  },
  {
    question: 'What export formats does FlashFX support?',
    answer: 'FlashFX currently supports MP4, WebM, and animated GIF export formats. These cover the majority of use cases for web video, social media content, and embedded animations. Additional formats including MOV and AVI are on the development roadmap. If you need a specific format not currently supported, you can export as MP4 and use a free converter tool as an intermediary step.',
  },
  {
    question: 'Is FlashFX good for YouTube intros and channel branding?',
    answer: 'Absolutely. Creating YouTube intros, outros, lower thirds, and channel branding graphics is one of the primary use cases FlashFX was designed for. The built-in template library includes pre-configured animations specifically tailored for YouTube content creators. You can customize colors, text, and timing to match your brand, then export directly as MP4 for upload. Many creators use FlashFX exclusively for all their channel graphics needs.',
  },
];

export function AEFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {aeFaqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-fx-border rounded-card bg-fx-bg-base overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-fx-bg-raised transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-sans text-lg font-bold text-fx-text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-fx-text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openIndex === index && (
                <div id={`faq-answer-${index}`} className="px-6 pb-4">
                  <p className="text-fx-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-fx-text-secondary leading-relaxed mt-8 text-center"
        >
          Have more questions?{' '}
          <Link href="/features" className="text-fx-accent-blue hover:underline">
            Explore all features
          </Link>{' '}
          or start using FlashFX immediately to see if it meets your needs.
        </motion.p>
      </div>
    </section>
  );
}
