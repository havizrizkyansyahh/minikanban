import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FAF8F5',
          dark: '#181716',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#232220',
        },
        column: {
          light: '#F4F1EA',
          dark: '#1C1B19',
        },
        subtle: {
          light: '#EFECE6',
          dark: '#2E2C29',
        },
        border: {
          subtle: {
            light: '#E7E3DA',
            dark: '#363430',
          },
          strong: {
            light: '#D5D0C5',
            dark: '#4B4843',
          },
        },
        content: {
          primary: {
            light: '#1C1917',
            dark: '#F5F5F4',
          },
          secondary: {
            light: '#57534E',
            dark: '#A8A29E',
          },
          muted: '#78716C',
        },
        sage: {
          DEFAULT: '#3D5A45',
          hover: '#314937',
          soft: '#EAF0EB',
          border: '#B8CEBE',
          dark: '#6E997B',
          'dark-soft': '#1F2922',
        },
        priority: {
          urgent: {
            fg: '#9A3412',
            bg: '#FFEDD5',
            border: '#FDBA74',
          },
          high: {
            fg: '#C2410C',
            bg: '#FFF7ED',
            border: '#FED7AA',
          },
          medium: {
            fg: '#A16207',
            bg: '#FEF9C3',
            border: '#FDE047',
          },
          low: {
            fg: '#57534E',
            bg: '#F5F5F4',
            border: '#E7E5E4',
          },
          done: {
            fg: '#2B5138',
            bg: '#EBF2EC',
            border: '#C2D9C7',
          },
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Inter"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(28, 25, 23, 0.05)',
        'card-hover': '0 2px 5px 0 rgba(28, 25, 23, 0.08)',
        'card-drag':
          '0 12px 24px -4px rgba(28, 25, 23, 0.15), 0 4px 8px -2px rgba(28, 25, 23, 0.06)',
        modal:
          '0 20px 30px -10px rgba(28, 25, 23, 0.18), 0 8px 10px -6px rgba(28, 25, 23, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
