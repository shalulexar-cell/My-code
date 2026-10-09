const path = require('node:path');
const root = path.resolve(__dirname, '..');
module.exports = {
  content: [path.join(root, '*.html'), path.join(root, 'ar/**/*.html'), path.join(root, 'articles/**/*.html'), path.join(root, 'services/**/*.html'), path.join(root, 'script.js')],
  theme: { extend: {} },
  plugins: [],
};
