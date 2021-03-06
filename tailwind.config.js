module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-900': '#331D22',
        'primary-800': '#5B303A',
        'primary-700': '#844454',
        'primary-600': '#c17171',
        'primary-500': '#B5808D',
        'primary-400': '#E27F98',
        'primary-300': '#E5ACBA',
        'primary-200': '#E5CED2',
        'primary-100': '#E5DADA',
        'primary-50': '#f8f4f4',
      },
    },
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover'],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within'],
    textColor: ['dark', 'dark-hover', 'dark-active'],
  },
  plugins: [require('tailwindcss-dark-mode')(), require('@tailwindcss/ui')],
};
