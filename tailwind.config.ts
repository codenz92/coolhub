import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  theme: {
    extend: {
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      animation: {
        scan: 'scan 3s ease-in-out infinite',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [], // Keep this empty to avoid "module not found" errors
} satisfies Config;