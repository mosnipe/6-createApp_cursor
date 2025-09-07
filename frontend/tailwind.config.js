/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'powerproke': {
          'blue': '#4A90E2',
          'purple': '#8B5CF6',
          'pink': '#EC4899',
          'green': '#10B981',
        }
      },
      fontFamily: {
        'game': ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
