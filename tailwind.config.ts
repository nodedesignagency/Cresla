import type { Config } from 'tailwindcss'

// Design tokens for the Cresla paywall (Figma: "Cresla Paywall Final", node 1:385).
// Loaded by Tailwind v4 through `@config` in src/index.css.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f2f4f8',
        brand: '#3576ff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
