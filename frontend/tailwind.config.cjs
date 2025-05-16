/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#8B5CF6', // Purple
          hover: '#7C3AED',
          light: '#A78BFA',
          dark: '#6D28D9',
        },
        // Dark theme background colors
        dark: {
          DEFAULT: '#121212', // Main background
          lighter: '#1E1E1E', // Card background
          card: '#252525',    // Elevated card background
          accent: '#333333',  // Accent background
        },
        // Text colors for dark theme
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      boxShadow: {
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'neu-dark': '5px 5px 10px #0d0d0d, -5px -5px 10px #171717',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

