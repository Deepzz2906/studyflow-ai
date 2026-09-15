/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F5F7FB',
          secondary: '#EEF2F7',
        },
        card: '#FFFFFF',
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          DEFAULT: '#4F46E5', // Indigo primary
          600: '#4F46E5',
          700: '#4338CA', // Primary hover
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          sky: '#0EA5E9',
          cyan: '#06B6D4',
        },
        slate: {
          text: '#172033', // Main text
          secondary: '#64748B', // Secondary text
          subtle: '#94A3B8',
          border: '#E2E8F0',
          cardBorder: '#E5E9F2',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 6px 0 rgba(23, 32, 51, 0.04), 0 1px 2px 0 rgba(23, 32, 51, 0.02)',
        'elevated': '0 10px 25px -5px rgba(23, 32, 51, 0.08), 0 8px 10px -6px rgba(23, 32, 51, 0.04)',
        'ai-glow': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
}
