import type { Config } from 'tailwindcss';

export default {
  // Added {js,jsx} to the pattern below
  content: ['./app/**/*.{js,jsx,ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  theme: {},
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;