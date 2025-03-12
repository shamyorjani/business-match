// filepath: c:\laragon\www\business-matching\tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#657786',
        background: '#F5F8FA',
        border: '#E1E8ED',
        'purple-900': '#6B21A8',
        'purple-800': '#7C3AED',
        'purple-500': '#A78BFA',
        'gray-800': '#1F2937',
        'gray-700': '#374151',
        'gray-200': '#E5E7EB',
        'gray-50': '#F9FAFB',
        'red-600': '#DC2626',
        'white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      },
      gradientColorStops: theme => ({
        'primary-start': '#1DA1F2',
        'primary-end': '#14171A',
        'secondary-start': '#657786',
        'secondary-end': '#AAB8C2',
        'purple-900': '#6B21A8',
        'pink-600': '#DB2777',
      }),
    },
  },
  variants: {},
  plugins: [],
};
