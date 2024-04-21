/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  },
  plugins: [
  ],
  corePlugins: {
    preflight: false, // https://tailwindcss.com/docs/preflight
  },
}
