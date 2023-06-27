/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mb-pink': '#9040b8',
        'mb-purple': '#5f0a87'
      },
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  corePlugins: {
    preflight: false, // https://tailwindcss.com/docs/preflight
  }
}
