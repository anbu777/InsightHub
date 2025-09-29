/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Plugin v4 yang benar
    'autoprefixer': {}          // Plugin yang kita install
  }
};

export default config;