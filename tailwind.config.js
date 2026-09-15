/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f1117',
          light: '#1a1d28',
          lighter: '#222633',
          card: '#181b25',
        },
        accent: {
          DEFAULT: '#00ff88',
          dark: '#00cc6f',
          dim: '#00b359',
          glow: 'rgba(0, 255, 136, 0.15)',
        },
        danger: {
          DEFAULT: '#ff4466',
          dark: '#cc3355',
        },
        warning: {
          DEFAULT: '#ff9933',
          dark: '#cc7726',
        },
        muted: {
          DEFAULT: '#6b7080',
          light: '#8b90a0',
        },
        border: {
          DEFAULT: '#2a2e3a',
          light: '#353a48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        base: ['16px', '150%'],
        lg: ['18px', '150%'],
        xl: ['20px', '140%'],
        '2xl': ['24px', '130%'],
        '3xl': ['30px', '120%'],
        '4xl': ['36px', '120%'],
      },
    },
  },
  plugins: [],
}
