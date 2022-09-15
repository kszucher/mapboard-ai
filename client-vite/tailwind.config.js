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
      },
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false, // https://tailwindcss.com/docs/preflight
  }
}
