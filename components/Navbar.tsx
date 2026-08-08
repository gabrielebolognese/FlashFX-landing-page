'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { CtaButton } from '@/components/ui/cta-button';

/*
 * The top bar.
 *
 * Rebuilt on 2026-08-07 — it was the last piece still wearing the old site: an
 * opaque navy slab, a "Features" label in a yellow-to-orange gradient nothing
 * else on the page uses any more, unspecified fonts falling through to the
 * browser default, and a flat yellow "Launch App" chip that shared no styling
 * with the call to action it duplicates.
 *
 * ── Every entry must point at something that exists ─────────────────────────
 *
 * Web Editing, Dual Timeline and Easy Animations were removed with the three
 * split-screen sections they targeted, and Share Projects with the sharing
 * section — a dropdown item that scrolls nowhere is the exact failure FIX.md M6
 * existed to fix. `EXPLORE` below is checked against the ids rendered on `/`;
 * adding an entry means adding the `id` to the section first.
 */
const EXPLORE = [
  { id: 'edit-in-plain-english', label: 'Edit in plain English' },
  { id: 'media-pool', label: 'Media pool' },
  { id: 'clip-timeline', label: 'Clip timeline' },
  { id: 'animation-timeline', label: 'Animation timeline' },
  { id: 'interactive-canvas', label: 'Interactive canvas' },
  { id: '3d-support', label: '3D' },
  { id: 'particles', label: 'Particles' },
  { id: 'animation-presets', label: 'Animation presets' },
  { id: 'keyframe-interpolation', label: 'Keyframe interpolation' },
];

const SOCIALS = [
  { label: 'YouTube', url: 'https://www.youtube.com/@flashfxeditor' },
  { label: 'X (Twitter)', url: 'https://x.com/FlashFXeditor' },
  { label: 'Instagram', url: 'https://www.instagram.com/flashfxeditor/' },
  { label: 'Newsletter', url: 'https://substack.com/@flashfx' },
];

/* Darker and more transparent than the old slab, so the field of light behind
   the page carries through the bar instead of stopping at it. */
const PANEL = {
  background: 'rgba(11, 17, 38, 0.82)',
  borderColor: 'rgba(245, 197, 24, 0.16)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
};

const UI_FONT = { fontFamily: 'var(--font-outfit), sans-serif' };

const LINK =
  'text-[15px] text-fx-text-secondary hover:text-fx-text-primary transition-colors duration-200';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExploreOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(11, 17, 38, 0.72)', borderColor: 'rgba(230, 237, 243, 0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-6" style={UI_FONT}>
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <Image src="/android-chrome-192x192.png" alt="FlashFX logo" width={30} height={30} className="rounded-md flex-shrink-0" />
          <span
            className="text-[19px] text-fx-text-primary group-hover:text-fx-accent-yellow transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            FlashFX
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          <Link href="/" className={LINK}>
            Home
          </Link>

          {/*
            "Explore", not "Features" — it lists the parts of the editor the page
            demonstrates, and every one of them is a live demo further down. It
            also no longer wears a gradient: it is a menu label like the others,
            and colouring one item differently only made it look like a mistake.
          */}
          <div className="relative" onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)}>
            <button className={`flex items-center gap-1.5 ${LINK}`}>
              Explore
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {exploreOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[236px]">
                <div className="py-2 rounded-xl border backdrop-blur-xl" style={PANEL}>
                  {EXPLORE.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-4 py-2 text-[14px] text-fx-text-secondary hover:text-fx-accent-yellow hover:bg-fx-accent-yellow/10 transition-colors duration-150"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => scrollToSection('pricing')} className={LINK}>
            Pricing
          </button>

          {/*
            The icon is not decoration: this is the one item in the bar that
            leaves the site, and saying so before the click is the whole job of
            that glyph.
          */}
          <a
            href="https://documentation.flashfx.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 ${LINK}`}
          >
            Documentation
            <ExternalLink className="w-3.5 h-3.5 opacity-70" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <button onClick={() => scrollToSection('faq')} className={LINK}>
            FAQ
          </button>

          <div className="relative" onMouseEnter={() => setSocialsOpen(true)} onMouseLeave={() => setSocialsOpen(false)}>
            <button className={`flex items-center gap-1.5 ${LINK}`}>
              Socials
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: socialsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {socialsOpen && (
              <div className="absolute top-full right-0 pt-3 w-48">
                <div className="py-2 rounded-xl border backdrop-blur-xl" style={PANEL}>
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-4 py-2 text-[14px] text-fx-text-secondary hover:text-fx-accent-yellow hover:bg-fx-accent-yellow/10 transition-colors duration-150"
                    >
                      {social.label}
                      <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={2} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/*
          The same `CtaButton` the hero uses, at the new `sm` size. It was a flat
          yellow chip with its own colour, radius and shadow — a second, worse
          version of the button it sits above. One component means the gradient,
          the sheen and the lift cannot drift apart.
        */}
        <div className="flex-shrink-0">
          <CtaButton href="https://editor.flashfx.app" size="sm">
            Open editor
          </CtaButton>
        </div>
      </div>
    </motion.nav>
  );
}
