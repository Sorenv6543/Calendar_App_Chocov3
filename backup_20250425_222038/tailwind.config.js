/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          dark: 'var(--danger-dark)',
        },
        success: {
          DEFAULT: 'var(--success)',
          dark: 'var(--success-dark)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          dark: 'var(--warning-dark)',
        },
        info: {
          DEFAULT: 'var(--info)',
          dark: 'var(--info-dark)',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 