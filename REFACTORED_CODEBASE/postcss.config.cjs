module.exports = {
  plugins: {
   
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'development' ? { cssnano: { preset: 'default' } } : {})
  }
} 