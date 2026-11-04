/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b1220',
          800: '#0f172a',
          700: '#15203b',
          600: '#1e293b',
          500: '#273449',
        },
        lime: {
          neon: '#a3e635',
          DEFAULT: '#84cc16',
        },
        coral: {
          neon: '#fb7185',
          DEFAULT: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(132,204,22,0.35), 0 0 40px rgba(132,204,22,0.15)',
        coral: '0 0 20px rgba(244,63,94,0.35), 0 0 40px rgba(244,63,94,0.15)',
        card: '0 10px 30px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pop-in': 'pop-in 0.35s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'confetti-fall': 'confetti-fall 2.2s ease-in forwards',
      },
    },
  },
  plugins: [],
};
