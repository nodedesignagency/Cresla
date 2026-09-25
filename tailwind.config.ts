import type { Config } from 'tailwindcss'

// Design tokens for the Cresla paywall (Figma: "Cresla Paywall Final", node 1:385).
// Loaded by Tailwind v4 through `@config` in src/index.css.

const gloss = (rgb: string, edge: string) =>
  [
    `inset 0 1px 4px 0 ${edge}`,
    `inset 0 -15px 4px 0 rgba(${rgb},0.01)`,
    `inset 0 -4px 3px 0 rgba(${rgb},0.05)`,
    `inset 0 -2px 3px 0 rgba(${rgb},0.18)`,
    `inset 0 -3px 2px 0 rgba(${rgb},0.3)`,
    `inset 0 -2px 2px 0 rgba(${rgb},0.35)`,
  ].join(', ')

const glossBrand = gloss('147,203,255', '#93cbff')

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f2f4f8',
        ink: '#0a0d20',
        muted: '#8b8b8b',
        brand: {
          DEFAULT: '#3576ff',
          deep: '#253ea7',
        },
        success: '#0fb000',
        track: '#e2e4e9',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // SF Pro Rounded on Apple platforms, Inter elsewhere.
        rounded: ['ui-rounded', '"SF Pro Rounded"', 'Inter', 'system-ui', 'sans-serif'],
      },

      // Line heights are Figma's "auto" (Inter ≈ 1.21em) rounded to whole pixels, as Figma lays them out.
      fontSize: {
        display: ['28px', { lineHeight: '34px', letterSpacing: '-0.02em' }],
        cta: ['18px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
        title: ['16px', { lineHeight: '19px', letterSpacing: '-0.02em' }],
        label: ['14px', { lineHeight: '17px', letterSpacing: '-0.02em' }],
        button: ['14px', { lineHeight: '17px' }],
        caption: ['12px', { lineHeight: '15px', letterSpacing: '-0.02em' }],
        badge: ['12px', { lineHeight: '15px', letterSpacing: '0.01em' }],
        micro: ['10px', { lineHeight: '12px', letterSpacing: '-0.02em' }],
        nano: ['9px', { lineHeight: '11px', letterSpacing: '-0.02em' }],
      },

      spacing: {
        gutter: '20px',
        // Figma trims text boxes to cap height → baseline ("text-box-trim"). Applied as
        // negative block margins, e.g. `-my-trim-caption`, which works in every WebKit version.
        'trim-display': '7px',
        'trim-title': '3.5px',
        'trim-label': '3.5px',
        'trim-caption': '3px',
        'trim-rounded': '3.5px',
        'trim-micro': '2.5px',
      },

      borderRadius: {
        card: '18px',
        panel: '16px',
        badge: '7px',
      },

      boxShadow: {
        card: [
          '0 40.725px 5.989px 0 rgba(0,0,0,0)',
          '0 26.352px 5.39px 0 rgba(0,0,0,0.01)',
          '0 14.374px 4.192px 0 rgba(0,0,0,0.02)',
          '0 5.989px 2.994px 0 rgba(0,0,0,0.04)',
          '0 1.198px 1.797px 0 rgba(0,0,0,0.04)',
        ].join(', '),
        'gloss-brand': glossBrand,
        'gloss-success': [
          'inset 0 1px 4px 0 #93ffaa',
          'inset 0 -15px 4px 0 rgba(147,255,194,0.01)',
          'inset 0 -4px 3px 0 rgba(147,255,181,0.05)',
          'inset 0 -2px 3px 0 rgba(147,255,161,0.18)',
          'inset 0 -3px 2px 0 rgba(147,255,174,0.3)',
          'inset 0 -2px 2px 0 rgba(149,255,147,0.35)',
        ].join(', '),
        cta: `0 0 16px 0 rgba(192,220,241,0.2), ${glossBrand}`,
        radio: '0 2px 2px 0 rgba(27,28,29,0.12)',
        'radio-active': 'inset 0 2px 2px 0 rgba(22,38,100,0.32)',
        'radio-dot': '0 2px 2px 0 rgba(27,28,29,0.12), inset 0 -2px 3px 0 #cfd1d3',
      },

      dropShadow: {
        icon: [
          '0 8px 2px rgba(194,212,255,0.01)',
          '0 5px 2px rgba(194,212,255,0.04)',
          '0 3px 2px rgba(194,212,255,0.14)',
          '0 1px 1px rgba(194,212,255,0.24)',
          '0 0 1px rgba(194,212,255,0.27)',
        ],
      },

      backgroundImage: {
        sky: 'linear-gradient(180deg, #91c3fe 0%, #2f8af2 61.058%, #167bef 80.769%, #f2f4f8 100%)',
        headline: 'linear-gradient(90deg, #287cf9 0%, #0f39b3 100%)',
        icon: 'linear-gradient(180deg, #2882fa 0%, #0c32ab 100%)',
        'rule-dashed': 'linear-gradient(90deg, rgba(10,13,32,0.1) 50%, transparent 50%)',
        'rule-fade': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
      },
    },
  },
} satisfies Config
