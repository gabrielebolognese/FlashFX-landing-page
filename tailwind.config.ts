import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
        sans: ['var(--font-outfit)', 'sans-serif'],
        display: ['var(--font-cormorant)', 'serif'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
      },
      borderRadius: {
        card: '4px',
        button: '2px',
      },
      colors: {
        'fx-bg-base': 'var(--color-bg-base)',
        'fx-bg-surface': 'var(--color-bg-surface)',
        'fx-bg-raised': 'var(--color-bg-raised)',
        'fx-accent-yellow': 'var(--color-accent-yellow)',
        'fx-accent-yellow-muted': 'var(--color-accent-yellow-muted)',
        'fx-accent-purple': 'var(--color-accent-purple)',
        'fx-accent-blue': 'var(--color-accent-blue)',
        'fx-text-primary': 'var(--color-text-primary)',
        'fx-text-secondary': 'var(--color-text-secondary)',
        'fx-border': 'var(--color-border)',
      },
      keyframes: {
        'shimmer2': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '-200% 0%' },
        },
        'fade-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'spotlight': {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -40%) scale(1)',
          },
        },
      },
      animation: {
        'shimmer2': 'shimmer2 2s infinite linear',
        'fade-up': 'fade-up 0.5s ease-out',
        'spotlight': 'spotlight 2s ease 0.5s 1 forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
