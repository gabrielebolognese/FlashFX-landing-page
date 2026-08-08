'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BeamBorder } from '@/components/ui/beam-border';

export const faqData = [
  {
    question: 'Is FlashFX really free with no watermark?',
    answer: 'Yes. FlashFX\'s free tier gives you full access to the core motion graphics editor and exports your work without any watermark. A paid tier exists for AI services that have to be paid on our side. But you never need to pay to produce clean, professional output.',
  },
  {
    question: 'What are the system requirements to run FlashFX?',
    answer: 'FlashFX runs entirely in the browser and requires approximately 4GB of RAM. It works on Windows, macOS, Chromebooks, and older laptops where desktop tools like After Effects would struggle or refuse to install. No strong GPU required, but will help in 3d editing.',
  },
  {
    question: 'How long does it take to create my first motion graphic?',
    answer: 'Most users export their first project within minutes of opening FlashFX. The built-in template library lets you start from a working animation rather than a blank timeline, so the learning curve is measured in minutes, not the 40-80 hours typically associated with professional desktop tools.',
  },
  {
    question: 'What file formats can I export to?',
    answer: 'FlashFX currently supports MP4, WebM, and animated GIF. These cover the vast majority of creator use cases, YouTube uploads, social media reels, website embeds, and presentations. Additional export formats including MOV are on the public roadmap.',
  },
  {
    question: 'Can I use FlashFX for YouTube channel branding?',
    answer: 'Yes, YouTube creators are one of the primary audiences FlashFX is built for. The template library includes intros, outros, lower thirds, and thumbnail overlays sized for YouTube. Export in 1080p MP4 directly from the browser with no media encoder or render queue.',
  },
  {
    question: 'Does FlashFX work without an internet connection?',
    answer: 'No, FlashFX is a web application and requires an active internet connection to run. This is the trade-off for zero installation, automatic updates, and the ability to run on low-spec hardware. If offline use is a hard requirement for your workflow, a desktop tool like After Effects or DaVinci Resolve would be more appropriate.',
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="w-full"
    >
      <div className="group relative bg-fx-bg-surface border border-fx-border rounded-card overflow-hidden hover:border-fx-accent-yellow/30 transition-colors">
        <BeamBorder />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-8 px-6 flex flex-col items-center text-center hover:bg-fx-bg-raised/50 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-center gap-3 w-full">
            <span className="text-lg md:text-xl font-normal text-fx-text-primary" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-fx-text-secondary transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
        {isOpen && (
          <div className="px-6 pb-8 text-fx-text-secondary leading-relaxed text-center max-w-4xl mx-auto font-normal" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {answer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="relative w-full px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center mb-16"
          style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => (
            <FAQItem key={faq.question} {...faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
