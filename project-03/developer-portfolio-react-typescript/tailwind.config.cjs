// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FAF8F5',
          100: '#F3F0E9',
          200: '#E7E2D5',
          300: '#D5CDBA',
          800: '#2A2723',
          900: '#1C1917',
        },
        brand: {
          blue: '#2563EB',
          purple: '#7C3AED',
          gold: '#D4AF37',
          dark: '#111827',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.02)',
        lift: '0 20px 40px -15px rgba(37, 99, 235, 0.12)',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
