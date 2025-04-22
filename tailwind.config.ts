import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        background: {
          DEFAULT: '#F2FCE2',
          foreground: '#333333'
        },
        primary: {
          DEFAULT: '#D3E4FD',
          foreground: '#1A365D'
        },
        secondary: {
          DEFAULT: '#FEF7CD',
          foreground: '#4A5568'
        },
        accent: {
          DEFAULT: '#E5DEFF',
          foreground: '#4A5568'
        },
        muted: {
          DEFAULT: '#F1F0FB',
          foreground: '#718096'
        },
        destructive: {
          DEFAULT: '#FFDEE2',
          foreground: '#742A2A'
        },
        diabetes: {
          50: '#F2FCE2',
          100: '#E5F4C3',
          200: '#D3E4FD',
          300: '#FEF7CD',
          400: '#FEC6A1',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        health: {
          50: '#F2FCE2',
          100: '#E5F4C3',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34a',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        sidebar: {
          DEFAULT: '#F1F0FB',
          foreground: '#2D3748',
          primary: '#D3E4FD',
          'primary-foreground': '#1A365D',
          accent: '#E5DEFF',
          'accent-foreground': '#4A5568',
          border: '#E2E8F0',
          ring: '#4299E1'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
