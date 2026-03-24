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
        empire: '#DAFC68'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.35)'
      },
      animation: {
        orbit: 'orbit calc(var(--duration)*1s) linear infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)' },
        },
      },
    }
  },
  plugins: []
}
export default config
