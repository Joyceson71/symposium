import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#04070b',
        ember: '#ff3b30',
        snow: '#f4f6fb',
        steel: '#7f8c8d',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,59,48,0.35), 0 20px 80px rgba(255,59,48,0.16)',
      },
    },
  },
  plugins: [],
} satisfies Config;
