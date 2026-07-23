import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          base: '#050505',
          surface: '#0d0d0d',
          surface2: '#141414',
        },
        gold: {
          DEFAULT: '#c8a96e',
          bright: '#f0c97a',
          dim: 'rgba(200, 169, 110, 0.25)',
        },
        text: {
          primary: '#e8e2d9',
          muted: '#6a6460',
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'hero-sm': 'clamp(48px, 10vw, 110px)',
        'hero-lg': 'clamp(80px, 18vw, 220px)',
        'section-title': 'clamp(40px, 7vw, 90px)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'blur-in': 'blurIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blurIn: {
          '0%': { backdropFilter: 'blur(0px)', opacity: '0' },
          '100%': { backdropFilter: 'blur(10px)', opacity: '1' },
        },
      },
      backdropBlur: {
        sm: '4px',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      zIndex: {
        base: '10',
        nav: '100',
        modal: '200',
        cursor: '99998',
        cursorTrail: '99999',
      },
    },
  },
  plugins: [],
};

export default config;
