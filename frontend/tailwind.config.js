/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy github tokens (kept for AdminDashboard)
        github: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          accent: '#58a6ff',
        },
        // Monochromatic dashboard tokens
        dash: {
          bg:          '#080808',
          surface:     '#111111',
          'surface-2': '#191919',
          border:      '#1e1e1e',
          'border-2':  '#2a2a2a',
          text:        '#f5f5f5',
          secondary:   '#a0a0a0',
          muted:       '#555555',
          // "Accent" is white-only
          white:       '#ffffff',
          'white-2':   '#e0e0e0',
          'white-3':   '#aaaaaa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out both',
        'slide-up':     'slideUp 0.45s ease-out both',
        'slide-in-left':'slideInLeft 0.35s ease-out both',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 3s linear infinite',
        'draw-line':    'drawLine 1.4s ease-out both',
        'bar-grow':     'barGrow 0.7s ease-out both',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { '0%': { opacity: '0', transform: 'translateX(-16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        drawLine:    { '0%': { strokeDashoffset: '1000' }, '100%': { strokeDashoffset: '0' } },
        barGrow:     { '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' }, '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' } },
      },
    },
  },
  plugins: [],
}
