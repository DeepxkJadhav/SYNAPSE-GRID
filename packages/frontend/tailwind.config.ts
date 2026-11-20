/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        synapse: {
          bg: '#0c0d0e',
          surface: '#121316',
          elevated: '#17191e',
          card: '#14151a',
          border: 'rgba(255, 255, 255, 0.07)',
          borderStrong: 'rgba(255, 255, 255, 0.12)',
          accent: '#f59e0b',
          accentHover: '#d97706',
          accentMuted: 'rgba(245, 158, 11, 0.08)',
          accentBorder: 'rgba(245, 158, 11, 0.25)',
          emerald: '#10b981',
          rose: '#ef4444',
          amber: '#f59e0b',
          muted: '#8a8f98',
          subtle: '#5c6068',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        'elevated': '0 12px 30px -10px rgba(0, 0, 0, 0.65), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
        'modal': '0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
