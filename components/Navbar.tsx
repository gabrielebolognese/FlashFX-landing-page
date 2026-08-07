'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

/*
 * Every entry must point at a section that is actually rendered. Web Editing,
 * Dual Timeline and Easy Animations were removed on 2026-08-07 with the three
 * split-screen sections they targeted — a dropdown item that scrolls nowhere is
 * the exact failure FIX.md M6 existed to fix. Share Projects went the same way
 * later that day when the sharing section was cut.
 */
const FEATURES = [
  { id: '3d-support', label: '3D Support' },
  { id: 'particles', label: 'Particles' },
  { id: 'keyframe-interpolation', label: 'Keyframe Interpolation' },
];

const SOCIALS = [
  { label: 'YouTube', url: 'https://www.youtube.com/@flashfxeditor' },
  { label: 'X (Twitter)', url: 'https://x.com/FlashFXeditor' },
  { label: 'Instagram', url: 'https://www.instagram.com/flashfxeditor/' },
  { label: 'Newsletter', url: 'https://substack.com/@flashfx' },
];

const DROPDOWN_STYLE = {
  background: 'rgba(20, 31, 64, 0.98)',
  borderColor: 'rgba(245, 197, 24, 0.2)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
};

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFeaturesOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 z-50 w-full border-b border-fx-border backdrop-blur-md"
      style={{ backgroundColor: 'rgba(20, 31, 64, 0.92)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/android-chrome-192x192.png"
            alt="FlashFX logo"
            width={28}
            height={28}
            className="rounded-sm flex-shrink-0"
          />
          <span
            className="text-lg text-fx-text-primary group-hover:text-fx-accent-yellow transition-colors"
            style={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 400 }}
          >
            FlashFX
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-fx-text-secondary hover:text-fx-text-primary transition-colors text-sm">
            Home
          </Link>

          <div
            ref={featuresRef}
            className="relative"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm group">
              <span className="bg-gradient-to-r from-fx-accent-yellow to-orange-500 bg-clip-text text-transparent">
                Features
              </span>
              <ChevronDown
                className="w-3.5 h-3.5 text-fx-text-secondary transition-transform duration-200"
                style={{ transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {featuresOpen && (
              <div
                className="absolute top-full left-0 pt-2 min-w-[200px]"
              >
              <div
                className="py-1.5 rounded-lg border"
                style={DROPDOWN_STYLE}
              >
                {FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => scrollToSection(feature.id)}
                    className="w-full text-left px-4 py-2 text-fx-text-secondary hover:text-fx-accent-yellow hover:bg-fx-accent-yellow/10 transition-colors text-sm"
                  >
                    {feature.label}
                  </button>
                ))}
              </div>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection('pricing')}
            className="text-fx-text-secondary hover:text-fx-text-primary transition-colors text-sm"
          >
            Pricing
          </button>

          <a
            href="https://documentation.flashfx.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fx-text-secondary hover:text-fx-text-primary transition-colors text-sm"
          >
            Documentation
          </a>

          <button
            onClick={() => scrollToSection('faq')}
            className="text-fx-text-secondary hover:text-fx-text-primary transition-colors text-sm"
          >
            FAQ
          </button>

          <div
            ref={socialsRef}
            className="relative"
            onMouseEnter={() => setSocialsOpen(true)}
            onMouseLeave={() => setSocialsOpen(false)}
          >
            <button className="flex items-center gap-1 text-fx-text-secondary hover:text-fx-text-primary transition-colors text-sm">
              Socials
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: socialsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {socialsOpen && (
              <div className="absolute top-full right-0 pt-2 w-40">
                <div
                  className="py-1.5 rounded-lg border"
                  style={DROPDOWN_STYLE}
                >
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-fx-text-secondary hover:text-fx-accent-yellow hover:bg-fx-accent-yellow/10 transition-colors text-sm"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <a
          href="https://editor.flashfx.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-button text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: '#F5C518',
            color: '#141f40',
            fontFamily: 'var(--font-outfit), sans-serif',
            boxShadow: '0 0 16px rgba(245, 197, 24, 0.25)',
          }}
        >
          Launch App
        </a>
      </div>
    </motion.nav>
  );
}
