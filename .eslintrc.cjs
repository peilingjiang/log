// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    log: 'readonly',
    setLog: 'readonly',
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'no-inner-declarations': 'off',
    eqeqeq: 'error',
  },
  ignorePatterns: ['node_modules/', 'lib/'],
}
