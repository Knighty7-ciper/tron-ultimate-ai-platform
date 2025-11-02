/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TRON Color Scheme
        tron: {
          black: '#000000',
          red: {
            primary: '#ef4444',
            secondary: '#dc2626', 
            tertiary: '#b91c1c',
            light: '#f87171',
            dark: '#991b1b',
            glow: 'rgba(239, 68, 68, 0.3)',
            'glow-strong': 'rgba(239, 68, 68, 0.6)',
          }
        },
        // Override default colors with TRON theme
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      },
      backgroundImage: {
        // TRON Gradients
        'tron-gradient': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'tron-gradient-secondary': 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
        'tron-grid': `
          linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
        `,
        'tron-radial': 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        // TRON Shadows
        'tron': '0 4px 20px rgba(239, 68, 68, 0.2)',
        'tron-strong': '0 8px 40px rgba(239, 68, 68, 0.4)',
        'tron-glow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'tron-glow-lg': '0 0 40px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        // TRON Animations
        'tron-pulse': 'tron-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tron-glow': 'tron-glow 2s ease-in-out infinite alternate',
        'tron-scan': 'tron-scan 2s linear infinite',
        'tron-spin': 'tron-spin 1s linear infinite',
      },
      keyframes: {
        'tron-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.02)',
          },
        },
        'tron-glow': {
          '0%': {
            'box-shadow': '0 0 20px rgba(239, 68, 68, 0.2)',
          },
          '100%': {
            'box-shadow': '0 0 30px rgba(239, 68, 68, 0.4)',
          },
        },
        'tron-scan': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'tron-spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      fontFamily: {
        'tron': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      backdropBlur: {
        'tron': '10px',
      },
      borderWidth: {
        'tron': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.tron-text': {
          color: 'rgba(255, 255, 255, 0.8)',
          'text-shadow': '0 2px 10px rgba(239, 68, 68, 0.2)',
        },
        '.tron-text-muted': {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        '.tron-heading': {
          color: '#ef4444',
          'font-weight': '700',
          'text-shadow': '0 4px 20px rgba(239, 68, 68, 0.2)',
          'letter-spacing': '0.05em',
        },
        '.tron-subheading': {
          color: '#f87171',
          'font-weight': '600',
          'text-shadow': '0 2px 10px rgba(239, 68, 68, 0.2)',
        },
        '.tron-button': {
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          'border-radius': '0.5rem',
          'font-weight': '500',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(239, 68, 68, 0.05)',
          'box-shadow': '0 4px 20px rgba(239, 68, 68, 0.2)',
        },
        '.tron-button:hover': {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid #ef4444',
          color: '#f87171',
          'box-shadow': '0 8px 40px rgba(239, 68, 68, 0.4)',
          transform: 'translateY(-1px)',
        },
        '.tron-container': {
          'border-radius': '0.5rem',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          'backdrop-filter': 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.4)',
          'box-shadow': '0 4px 20px rgba(239, 68, 68, 0.2)',
        },
        '.tron-terminal': {
          'font-family': 'Fira Code, Monaco, Consolas, monospace',
          color: '#10b981',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '1rem',
          'border-radius': '0.5rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          'overflow': 'auto',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}