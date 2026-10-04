/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'sf-bg': '#FFFFFF',
        'sf-surface': '#F8FAFC',
        'sf-surface-alt': '#F1F5F9',
        'sf-border': '#E2E8F0',
        'sf-text-primary': '#0F172A',
        'sf-text-secondary': '#475569',
        'sf-text-muted': '#94A3B8',

        'sf-primary': '#4F46E5',
        'sf-primary-hover': '#4338CA',
        'sf-primary-light': '#EEF2FF',
        'sf-accent-blue': '#2563EB',
        'sf-accent-blue-bg': '#EFF6FF',

        'sf-success': '#16A34A',
        'sf-success-bg': '#F0FDF4',
        'sf-warning': '#D97706',
        'sf-warning-bg': '#FFFBEB',
        'sf-danger': '#DC2626',
        'sf-danger-bg': '#FEF2F2',

        'sf-course-indigo': '#4F46E5',
        'sf-course-sky': '#0284C7',
        'sf-course-teal': '#0D9488',
        'sf-course-violet': '#7C3AED',
        'sf-course-rose': '#E11D48',
        'sf-course-amber': '#D97706',
      },
    },
  },
  plugins: [],
}
