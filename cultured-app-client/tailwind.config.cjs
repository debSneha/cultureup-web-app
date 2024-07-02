/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const withMT = require("@material-tailwind/react/utils/withMT");

// deleting deprecated color names to silence warnings
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      ...colors,
      'umeed-dogwood':'#F6D2C2',
      'umeed-tangerine':{
        100: '#f8ded3',
        300: '#eb9d7a',
        500: '#dd5c22',
        700: '#853714',
        900: '#2c1207'
      },
      'umeed-beige': '#EC9C83',
      'umeed-brown':'#B3867A',
      'umeed-dimgray':'#797071',
      'umeed-payneblue':'#3F586A',
      'umeed-blue':'#05445E',
      'umeed-moonstone':'#6D9BA9',
      'umeed-cyan':'#D4F1F4'
    },
    fontFamily:{
      'cormorant': ['Cormorant Garamond', 'serif'],
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      animation: {
        "slide-in": 'slideIn 0.7s ease-in-out',
      },
      keyframes: theme => ({
        slideIn: {
          '0%': { opacity: '0%', transform: 'translateY(25%)' },
          '100%': { opacity: '100%', transform: 'translateY(0%)' },
        },
      }),
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/typography')
  ],
})
