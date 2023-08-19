/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: ['**/dist/*', '**/node_modules/*'],
  'extends': [
    '../.eslintrc.js', 
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
