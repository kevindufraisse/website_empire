import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        empire: 'rgb(var(--empire-rgb) / <alpha-value>)',
        autopilot: '#d4a574',
        academy: '#fca5a5'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.35)'
      },
      animation: {
        orbit: 'orbit calc(var(--duration)*1s) linear infinite',
        sparkle: 'sparkle 1.8s ease-in-out var(--sparkle-delay, 0s) infinite',
        'sparkle-rotate': 'sparkle-rotate 2s linear infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)' },
        },
        sparkle: {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0) rotate(0deg)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(var(--sparkle-scale, 1)) rotate(180deg)' },
        },
        'sparkle-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(180deg)' },
        },
      },
    }
  },
  plugins: []
}
export default config
