/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d4af37',
        'primary-hover': '#c5a028',
        'primary-light': '#f3e5ab',
        'secondary': '#d9b55d',
        'accent-gold': '#ffd700',
        'deep-blue': '#002366',
        'background-light': '#000000',
        'background-dark': '#000000',
        'card-dark': '#0a0a0a',
        'card-light': '#0a0a0a',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(212, 175, 55, 0.3)',
        'glow-hover': '0 0 25px rgba(212, 175, 55, 0.5)',
        'glow-blue': '0 0 15px rgba(0, 35, 102, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
