const js = require('@eslint/js');
const globals = require('globals');
const html = require('eslint-plugin-html');

module.exports = [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    // The app's JavaScript lives inside index.html (single-file requirement).
    files: ['**/*.html'],
    plugins: { html },
    languageOptions: { sourceType: 'script', globals: { ...globals.browser } },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
      curly: ['error', 'multi-line'],
      'no-unused-vars': 'error',
      'no-shadow': 'error',
      'no-implicit-globals': 'off'
    }
  },
  {
    files: ['tests/**/*.js', 'eslint.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
    rules: { 'no-var': 'error', 'prefer-const': 'error', eqeqeq: 'error' }
  }
];
