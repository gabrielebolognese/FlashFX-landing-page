/*
 * The one place in the codebase where hex literals are correct rather than a
 * mistake: this page documents the palette, so the hex value IS the content.
 * Do not "fix" these to fx-* Tailwind tokens — the reader needs the number.
 *
 * Source of truth is the :root block in app/globals.css. If a token changes
 * there, change it here too, or this page starts publishing the wrong colour.
 */
export interface BrandColor {
  name: string;
  token: string;
  hex: string;
  usage: string;
}

export const brandColors: BrandColor[] = [
  {
    name: 'Base',
    token: '--color-bg-base',
    hex: '#141F40',
    usage: 'Page background. The deep navy the whole product sits on.',
  },
  {
    name: 'Surface',
    token: '--color-bg-surface',
    hex: '#1C2952',
    usage: 'Cards, panels, and the footer.',
  },
  {
    name: 'Raised',
    token: '--color-bg-raised',
    hex: '#1C2E63',
    usage: 'Hover states and elevated surfaces.',
  },
  {
    name: 'Accent Yellow',
    token: '--color-accent-yellow',
    hex: '#F5C518',
    usage: 'The primary brand colour. Buttons, highlights, and emphasis.',
  },
  {
    name: 'Accent Yellow Muted',
    token: '--color-accent-yellow-muted',
    hex: '#C9A614',
    usage: 'Hover state for primary actions.',
  },
  {
    name: 'Accent Purple',
    token: '--color-accent-purple',
    hex: '#7C5CBF',
    usage: 'Secondary accent, used in gradients and dividers.',
  },
  {
    name: 'Accent Blue',
    token: '--color-accent-blue',
    hex: '#2D6BE4',
    usage: 'Inline links.',
  },
  {
    name: 'Text Primary',
    token: '--color-text-primary',
    hex: '#E6EDF3',
    usage: 'Headings and body copy.',
  },
  {
    name: 'Text Secondary',
    token: '--color-text-secondary',
    hex: '#8B949E',
    usage: 'Supporting copy, captions, and labels.',
  },
  {
    name: 'Border',
    token: '--color-border',
    hex: '#243060',
    usage: 'Default border colour, applied globally.',
  },
];

export interface BrandFont {
  name: string;
  role: string;
  weights: string;
  variable: string;
}

/**
 * Loaded in app/layout.tsx via next/font/google. All three are Google Fonts.
 *
 * Lexend was a fourth until performancemilestones.md P7 folded it into Outfit.
 * Cormorant Garamond was the display face until 2026-08-07, when every section
 * heading on the site moved to Inter and nothing referenced it any more.
 */
export const brandFonts: BrandFont[] = [
  {
    name: 'Inter',
    role: 'Display. Every heading and section title.',
    weights: 'variable, 100–900',
    variable: '--font-inter',
  },
  {
    name: 'Outfit',
    role: 'Body and UI. The default sans across the site, and the wordmark.',
    weights: '400, 500, 700',
    variable: '--font-outfit',
  },
  {
    name: 'JetBrains Mono',
    role: 'Monospace. Figures, labels, and technical detail.',
    weights: '400',
    variable: '--font-jetbrains',
  },
];
