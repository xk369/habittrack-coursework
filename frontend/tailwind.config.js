/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          page: 'var(--surface-page)',
          pageTint: 'var(--surface-page-tint)',
          card: 'var(--surface-card)',
          card2: 'var(--surface-card-2)',
          inset: 'var(--surface-inset)',
          deep: 'var(--surface-deep)',
          ink: 'var(--surface-ink)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          1: 'var(--ink-1)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          4: 'var(--ink-4)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
          soft: 'var(--line-soft)',
        },
        sage: {
          50: 'var(--sage-50)',
          100: 'var(--sage-100)',
          200: 'var(--sage-200)',
          300: 'var(--sage-300)',
          400: 'var(--sage-400)',
          500: 'var(--sage-500)',
          600: 'var(--sage-600)',
          700: 'var(--sage-700)',
          ink: 'var(--sage-ink)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
          line: 'var(--danger-line)',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          soft: 'var(--warn-soft)',
        },
        accent: {
          amber: 'var(--accent-amber)',
          amberSoft: 'var(--accent-amber-soft)',
          blue: 'var(--accent-blue)',
          blueSoft: 'var(--accent-blue-soft)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
    },
  },
  plugins: [],
};
