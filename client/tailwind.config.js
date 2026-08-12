/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sellora: {
          primary: '#4F46E5',
          'primary-dark': '#4338CA',
          'primary-soft': '#EEF2FF',
          secondary: '#7C3AED',
          'secondary-dark': '#6D28D9',
          accent: '#F59E0B',
          'accent-dark': '#D97706',
          pink: '#EC4899',
          bg: '#F8F7FF',
          border: '#E7E5F4',
          text: '#1E1B4B',
          muted: '#6B7280',
          featured: '#F59E0B',
        },
      },
      backgroundImage: {
        'sellora-gradient': 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        'sellora-gradient-hover': 'linear-gradient(135deg, #4338CA, #6D28D9)',
        'sellora-warm': 'linear-gradient(135deg, #F59E0B, #EC4899)',
        'sellora-hero': 'linear-gradient(135deg, #EEF2FF 0%, #F8F7FF 55%, #FDF2F8 100%)',
      },
      boxShadow: {
        'sellora-sm': '0 1px 2px rgba(30, 27, 75, 0.06), 0 1px 3px rgba(30, 27, 75, 0.04)',
        sellora: '0 4px 16px -4px rgba(79, 70, 229, 0.12), 0 2px 6px -2px rgba(30, 27, 75, 0.06)',
        'sellora-lg': '0 12px 32px -8px rgba(79, 70, 229, 0.22), 0 4px 12px -4px rgba(30, 27, 75, 0.08)',
        'sellora-glow': '0 8px 22px -6px rgba(79, 70, 229, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'sellora-rise': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'sellora-rise': 'sellora-rise 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
