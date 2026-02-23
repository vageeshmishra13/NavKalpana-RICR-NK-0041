export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          500: '#6471f2', 600: '#4f55e6', 700: '#4243cb',
          800: '#3638a4', 950: '#1d1d4e'
        },
        gold: { 400: '#fbbf24', 500: '#f59e0b' }
      }
    }
  },
  plugins: []
}
