// eslint.config.mjs
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // 1) GLOBAL IGNORES (apply to everything ESLint scans)
  { 
    ignores: [
      '**/dist/**',             // compiled output
      '**/node_modules/**',
      'public/**',              // adjust if you keep assets here
      '*.min.js'
    ]
  },


  // 2) Make the React version setting GLOBAL so the plugin never warns
  { settings: { react: { version: 'detect' } } },

  // 3) Base JS rules
  js.configs.recommended,

  // 4) React preset (flat)
  react.configs.flat.recommended,   // <- provides JSX-aware rules like react/jsx-uses-vars

  // 5) React (JS/JSX) in src/
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }, // enable JSX parsing
      },
      globals: { ...globals.browser },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    }
  }
];
