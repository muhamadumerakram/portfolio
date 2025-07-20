/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#0891b2',
        'secondary': '#1e293b',
        'dark': '#0f172a',
        'light': '#f8fafc'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
