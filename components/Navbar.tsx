'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Menu, X } from 'lucide-react';
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
 *
 * ── Mobile, added 2026-08-20 ────────────────────────────────────────────────
 *
 * Until now the entire link block was `hidden lg:flex` with nothing behind it.
 * Below 1024px a visitor got the logo and the editor button and no navigation
 * at all — Home, Explore, Pricing, Documentation, FAQ and Socials were simply
 * unreachable on every phone and most tablets. There is a menu now.
 *
 * ── Why the dropdowns take a click, not just a hover ────────────────────────
 *
 * They used to open from `onMouseEnter` on the wrapper, and the buttons carried
 * no `onClick` at all. A touch device has no hover, so Explore and Socials could
 * never be opened — including on an iPad in landscape, which is wide enough to
 * show the desktop bar and still cannot use half of it.
 *
 * Click is now the mechanism and hover is the enhancement: the hover handlers
 * are gated behind `(hover: hover) and (pointer: fine)` rather than attached
 * unconditionally. On a hybrid laptop the emulated `mouseenter` a tap produces
 * would otherwise open the panel and the click that follows would close it
 * again, which reads as the menu refusing to open.
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

/*
 * Every row in the mobile sheet, at a size a thumb can actually hit. `py-3` on
 * a 15px line comes to 44px, which is the floor both platform guidelines give
 * for a touch target — the desktop bar's rows are around 22px and would be a
 * coin toss to tap.
 */
const MOBILE_ROW =
  'w-full flex items-center justify-between gap-3 py-3 text-[16px] text-fx-text-secondary hover:text-fx-accent-yellow transition-colors duration-150';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Null until measured, so the first render never guesses at input type. */
  const [canHover, setCanHover] = useState(false);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Hover is an enhancement for real pointers only — see the note at the top. */
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const read = () => setCanHover(query.matches);
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setExploreOpen(false);
    setSocialsOpen(false);
  }, []);

  /*
   * A menu that only closes by pressing its own button is a trap on a phone,
   * where the button is a long way from where the thumb ends up. Escape and a
   * tap outside both close it.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (nav.current && !nav.current.contains(e.target as Node)) closeAll();
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen, closeAll]);

  /*
   * Widening past the breakpoint swaps the sheet for the desktop bar, and a
   * `menuOpen` left set behind it would spring back the next time the window
   * narrowed. Closing on the breakpoint keeps the two representations of the
   * same state from disagreeing.
   */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (query.matches) closeAll();
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [closeAll]);

  /* The page must not scroll under an open sheet. */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Closes either way: leaving the sheet open over a section that does not
    // exist on this route would look like the tap was ignored.
    closeAll();
  };

  /* Only attached when the pointer can actually hover. */
  const hoverProps = (set: (v: boolean) => void) =>
    canHover ? { onMouseEnter: () => set(true), onMouseLeave: () => set(false) } : {};

  return (
    <motion.nav
      ref={nav}
      initial={{ y: -100 }}
      /* Stays put while the sheet is open, so scrolling back to the top cannot
         slide the bar out from under a menu the visitor is still reading. */
      animate={{ y: isVisible || menuOpen ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(11, 17, 38, 0.72)', borderColor: 'rgba(230, 237, 243, 0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-6" style={UI_FONT}>
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={closeAll}>
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
          <div className="relative" {...hoverProps(setExploreOpen)}>
            <button
              type="button"
              onClick={() => {
                setExploreOpen((v) => !v);
                setSocialsOpen(false);
              }}
              aria-expanded={exploreOpen}
              className={`flex items-center gap-1.5 ${LINK}`}
            >
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

          <div className="relative" {...hoverProps(setSocialsOpen)}>
            <button
              type="button"
              onClick={() => {
                setSocialsOpen((v) => !v);
                setExploreOpen(false);
              }}
              aria-expanded={socialsOpen}
              className={`flex items-center gap-1.5 ${LINK}`}
            >
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

        <div className="flex items-center gap-2 flex-shrink-0">
          {/*
            The same `CtaButton` the hero uses, at the new `sm` size. It was a flat
            yellow chip with its own colour, radius and shadow — a second, worse
            version of the button it sits above. One component means the gradient,
            the sheen and the lift cannot drift apart.
          */}
          <CtaButton href="https://editor.flashfx.app" size="sm">
            Open editor
          </CtaButton>

          {/* 44px square: the same touch floor the sheet's rows use. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden -mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-fx-text-secondary transition-colors hover:text-fx-accent-yellow"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/*
        The sheet. `100dvh` rather than `100vh`: on a phone `vh` is measured
        against the viewport with the address bar hidden, so a `vh`-capped panel
        is taller than the space actually available and its last rows sit under
        the browser chrome. It scrolls, because Explore alone is nine rows.
      */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t"
          style={{ borderColor: 'rgba(230, 237, 243, 0.08)', background: 'rgba(11, 17, 38, 0.97)' }}
        >
          <div
            className="max-w-7xl mx-auto px-6 pb-6 overflow-y-auto"
            style={{ ...UI_FONT, maxHeight: 'calc(100dvh - 60px)' }}
          >
            <Link href="/" className={MOBILE_ROW} onClick={closeAll}>
              Home
            </Link>

            <div className="border-t" style={{ borderColor: 'rgba(230, 237, 243, 0.06)' }}>
              <button
                type="button"
                onClick={() => setExploreOpen((v) => !v)}
                aria-expanded={exploreOpen}
                className={MOBILE_ROW}
              >
                Explore
                <ChevronDown
                  className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {exploreOpen && (
                <div className="pb-2 pl-3 border-l" style={{ borderColor: 'rgba(245, 197, 24, 0.25)' }}>
                  {EXPLORE.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left py-2.5 text-[15px] text-fx-text-secondary hover:text-fx-accent-yellow transition-colors duration-150"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(230, 237, 243, 0.06)' }}>
              <button onClick={() => scrollToSection('pricing')} className={MOBILE_ROW}>
                Pricing
              </button>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(230, 237, 243, 0.06)' }}>
              <a
                href="https://documentation.flashfx.app"
                target="_blank"
                rel="noopener noreferrer"
                className={MOBILE_ROW}
                onClick={closeAll}
              >
                Documentation
                <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-70" strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(230, 237, 243, 0.06)' }}>
              <button onClick={() => scrollToSection('faq')} className={MOBILE_ROW}>
                FAQ
              </button>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(230, 237, 243, 0.06)' }}>
              <button
                type="button"
                onClick={() => setSocialsOpen((v) => !v)}
                aria-expanded={socialsOpen}
                className={MOBILE_ROW}
              >
                Socials
                <ChevronDown
                  className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: socialsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {socialsOpen && (
                <div className="pb-2 pl-3 border-l" style={{ borderColor: 'rgba(245, 197, 24, 0.25)' }}>
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAll}
                      className="flex items-center justify-between gap-2 py-2.5 text-[15px] text-fx-text-secondary hover:text-fx-accent-yellow transition-colors duration-150"
                    >
                      {social.label}
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-60" strokeWidth={2} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
