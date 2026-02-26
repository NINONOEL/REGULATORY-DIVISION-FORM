/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        /* Exact colors from COLOR THEME.png */
        rd: {
          'dark-green': '#0F571C',
          'medium-green': '#4D7E58',
          khaki: '#BEB68F',
          cream: '#F1EAD6',
          primary: '#0F571C',
          'primary-darker': '#0a3d14',
          'primary-darkest': '#0F571C',
          'primary-alt': '#4D7E58',
          'primary-alt-dark': '#3d6546',
          'primary-alt-lightest': '#e8f0e9',
          secondary: '#4D7E58',
          'secondary-dark': '#3d6546',
          'secondary-darkest': '#0F571C',
          'secondary-light': '#7a9f82',
          'secondary-lightest': '#e8f0e9',
          green: '#0F571C',
          'green-light': '#4D7E58',
          'green-lightest': '#e8f0e9',
          base: '#0F571C',
          'gray-dark': '#2d3d2d',
          gray: '#374537',
          'gray-light': '#4a5d4a',
          'gray-lighter': '#6b7f6b',
          border: '#4D7E58',
          alert: '#8B6914',
          'alert-light': '#BEB68F',
          'alert-lightest': '#F1EAD6',
        },
      },
    },
  },
  plugins: [],
}
