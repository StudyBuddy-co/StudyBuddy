/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
  "bg-teal-500",
  "bg-cyan-500",
  "bg-purple-500",
  "bg-stone-500",
]
}

