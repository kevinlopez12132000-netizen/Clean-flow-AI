import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf5',
          100: '#d7f9e4',
          200: '#b2f1cc',
          300: '#7ce4ab',
          400: '#3fce85',
          500: '#17b367',
          600: '#0c9053',
          700: '#0b7345',
          800: '#0c5b39',
          900: '#0b4b30',
        },
      },
    },
  },
  plugins: [],
};

export default config;
