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
        // CTA highlight sweep
        shine: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
        // Gold "mesh" for the trial heading: soft blobs of light and deep gold over a gold base.
        // `animate-gold-mesh` drifts the blobs around (one background-position per layer).
        'gold-mesh': [
          'radial-gradient(closest-side, #fbeeb4 0%, rgba(251,238,180,0) 100%)',
          'radial-gradient(closest-side, #6f500c 0%, rgba(111,80,12,0) 100%)',
          'radial-gradient(closest-side, #f0d06a 0%, rgba(240,208,106,0) 100%)',
          'radial-gradient(closest-side, #8a6614 0%, rgba(138,102,20,0) 100%)',
          'linear-gradient(90deg, #a07a1c 0%, #c9a43d 50%, #a07a1c 100%)',
        ].join(', '),
        // Daybreak veil: clear at the top, page color below. Slid down by `animate-sky-veil`.
        veil: 'linear-gradient(180deg, rgba(242,244,248,0) 0%, #f2f4f8 40%, #f2f4f8 100%)',
        // Light streaming down the ray, and the glow it leaves around the mascot.
        stream: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)',
        halo: 'radial-gradient(closest-side, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 100%)',
        // "Free for 3 days." gradient with a glint layer on top that passes over it once.
        'headline-glint':
          'linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 60%), linear-gradient(90deg, #287cf9 0%, #0f39b3 100%)',
      },

      // Ambient loops run as CSS animations so iOS composites them off the main thread;
      // they stay smooth even while JavaScript is busy. Delays are set inline per element.
      keyframes: {
        // Drifts begin at the design position and at rest, so they pick up seamlessly from the
        // clouds' entrance; all layers move the same way, the nearest furthest (parallax).
        'cloud-drift-far': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-90px)' } },
        'cloud-drift-back': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-70px)' } },
        'cloud-drift-front': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-120px)' } },
        'cloud-bob': { from: { transform: 'translateY(0)' }, to: { transform: 'translateY(-5px)' } },
        // Daybreak: a veil of the page color slides down off the sky, so the blue spreads from
        // the top with a soft edge.
        'sky-veil': { from: { transform: 'translateY(-40%)' }, to: { transform: 'translateY(50%)' } },
        'ray-sway': { from: { transform: 'rotate(-1.6deg)' }, to: { transform: 'rotate(1.6deg)' } },
        'ray-pulse': { from: { opacity: '0.5' }, to: { opacity: '0.32' } },
        'ray-stream': { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(220%)' } },
        'mote-fall': {
          '0%': { transform: 'translateY(0) scale(0.5)', opacity: '0' },
          '20%': { opacity: '1' },
          '75%': { opacity: '0.8' },
          '100%': { transform: 'translateY(150px) scale(1)', opacity: '0' },
        },
        'halo-pulse': {
          from: { transform: 'scale(0.92)', opacity: '0.55' },
          to: { transform: 'scale(1.06)', opacity: '1' },
        },
        'gold-mesh': {
          '0%': { backgroundPosition: '5% 50%, 85% 40%, 45% 60%, 100% 50%, 0 0' },
          '33%': { backgroundPosition: '55% 30%, 20% 65%, 95% 45%, 35% 55%, 0 0' },
          '66%': { backgroundPosition: '95% 60%, 55% 40%, 10% 55%, 75% 40%, 0 0' },
          '100%': { backgroundPosition: '30% 45%, 100% 55%, 65% 40%, 0% 60%, 0 0' },
        },
        'text-glint': {
          from: { backgroundPosition: '160% 0, 0 0' },
          to: { backgroundPosition: '-60% 0, 0 0' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-130%) skewX(-20deg)' },
          '26%, 100%': { transform: 'translateX(430%) skewX(-20deg)' },
        },
        twinkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '12%': { transform: 'scale(1) rotate(45deg)', opacity: '1' },
          '28%, 100%': { transform: 'scale(0) rotate(90deg)', opacity: '0' },
        },
        // Timeline: the lit capsule slides down while its contents counter-slide, so the
        // white icons stay put and are uncovered exactly as the leading edge reaches them.
        // It rests on Today, glides to Day 2, rests, then glides to Day 3 (1.8s rests, 1.6s glides).
        'rail-fill': {
          '0%, 26.47%': { transform: 'translateY(-117px)' },
          '50%, 76.47%': { transform: 'translateY(-58px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'rail-counter': {
          '0%, 26.47%': { transform: 'translateY(117px)' },
          '50%, 76.47%': { transform: 'translateY(58px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'rail-glint': { from: { transform: 'translateY(-60px)' }, to: { transform: 'translateY(180px)' } },
        'icon-pop': {
          '0%': { transform: 'scale(0.4)' },
          '55%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'row-lit': { from: { opacity: '0.4' }, to: { opacity: '1' } },
      },

      animation: {
        'cloud-drift-far': 'cloud-drift-far 21s ease-in-out infinite alternate',
        'cloud-drift-back': 'cloud-drift-back 13s ease-in-out infinite alternate',
        'cloud-drift-front': 'cloud-drift-front 9s ease-in-out infinite alternate',
        'cloud-bob': 'cloud-bob 5.5s ease-in-out infinite alternate',
        'sky-veil': 'sky-veil 2.2s cubic-bezier(0.4, 0, 0.2, 1) both',
        'ray-sway': 'ray-sway 7s ease-in-out infinite alternate',
        'ray-pulse': 'ray-pulse 3.6s ease-in-out infinite alternate',
        'ray-stream': 'ray-stream 3.4s cubic-bezier(0.4, 0, 0.7, 1) infinite',
        'mote-fall': 'mote-fall 4.2s linear infinite',
        'halo-pulse': 'halo-pulse 3.4s ease-in-out infinite alternate',
        'gold-mesh': 'gold-mesh 9s ease-in-out infinite alternate',
        'text-glint': 'text-glint 1.5s cubic-bezier(0.45, 0, 0.25, 1) both',
        'shine-sweep': 'shine-sweep 4.8s cubic-bezier(0.45, 0, 0.25, 1) infinite',
        twinkle: 'twinkle 4s ease-out infinite',
        'rail-fill': 'rail-fill 6.8s cubic-bezier(0.65, 0, 0.35, 1) both',
        'rail-counter': 'rail-counter 6.8s cubic-bezier(0.65, 0, 0.35, 1) both',
        'rail-glint': 'rail-glint 1.1s cubic-bezier(0.45, 0, 0.3, 1) both',
        'icon-pop': 'icon-pop 0.55s cubic-bezier(0.3, 0, 0.3, 1) both',
        'row-lit': 'row-lit 0.5s ease-out both',
      },
    },
  },
} satisfies Config
