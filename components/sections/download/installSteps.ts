import { Chrome, Globe, Smartphone, Apple, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/*
 * These describe the browser's own "install this page as an app" feature, which
 * works on any URL and does NOT require a web app manifest. That matters,
 * because flashfx.app currently ships no manifest and no service worker — so a
 * guide written around the omnibox install button would describe something that
 * does not happen. Verified 2026-08-06: no manifest in public/, none referenced
 * in app/layout.tsx.
 *
 * Chromium menu wording shifts between releases, which is why each path is
 * given with its older equivalent rather than as a single exact string.
 */
export interface InstallGuide {
  browser: string;
  Icon: LucideIcon;
  steps: string[];
  note?: string;
}

export const installGuides: InstallGuide[] = [
  {
    browser: 'Chrome, desktop',
    Icon: Chrome,
    steps: [
      'Open the page you want as an app.',
      'Click the three-dot menu at the top right.',
      'Choose Cast, save and share, then Install page as app.',
      'On older Chrome versions this lives under More tools, then Create shortcut — tick Open as window.',
      'Confirm. It opens in its own window and lands in your app launcher.',
    ],
  },
  {
    browser: 'Edge',
    Icon: Globe,
    steps: [
      'Open the page you want as an app.',
      'Click the three-dot menu at the top right.',
      'Choose Apps, then Install this site as an app.',
      'Name it and confirm.',
      'Edge adds it to your Start menu or dock, and offers to pin it to the taskbar.',
    ],
  },
  {
    browser: 'Brave, Opera, Vivaldi',
    Icon: Globe,
    steps: [
      'All three are Chromium underneath, so the feature is the same.',
      'Open the browser menu.',
      'Look for Install, or More tools then Create shortcut.',
      'Tick Open as window if the option appears.',
    ],
  },
  {
    browser: 'Safari, macOS',
    Icon: Apple,
    steps: [
      'Requires macOS Sonoma or newer.',
      'Open the page in Safari.',
      'From the menu bar choose File, then Add to Dock.',
      'Rename it if you like and confirm.',
    ],
  },
  {
    browser: 'iPhone and iPad',
    Icon: Smartphone,
    steps: [
      'Open the page in Safari.',
      'Tap the Share button.',
      'Scroll and tap Add to Home Screen.',
      'Confirm. It behaves like an installed app from the home screen.',
    ],
    note: 'On iOS this must be Safari — other browsers cannot add to the home screen.',
  },
  {
    browser: 'Android',
    Icon: Smartphone,
    steps: [
      'Open the page in Chrome.',
      'Tap the three-dot menu.',
      'Tap Add to Home screen, or Install app if it appears.',
      'Confirm.',
    ],
  },
  {
    browser: 'Firefox, desktop',
    Icon: Info,
    steps: [
      'Firefox on desktop cannot install a site as an app — the feature was removed and has not returned.',
      'Bookmark the editor, or use a Chromium browser if you want a dedicated window.',
    ],
    note: 'Firefox on Android does support Install.',
  },
];
