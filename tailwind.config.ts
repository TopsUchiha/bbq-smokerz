import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd9b0',
          300: '#f9b97b',
          400: '#f6903e',
          500: '#f47018',
          DEFAULT: '#f47018',
          600: '#e55a0e',
          700: '#be430f',
          800: '#973615',
          900: '#7a2e14',
        },
        coal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#181818',
        },
      },
      fontFamily: {
        display: ['var(--font-oswald)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
