/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
  ],
  theme: {
    extend: {
      maxWidth: {
        990: '990px',
      },
      fontFamily: {
        sans: ['gtAmerica', ...defaultTheme.fontFamily.sans],
        'gt': ['gtAmerica', 'ui-sans-serif'],
        'gtBold': ['gtAmericaBold', 'sans-serif']
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};
