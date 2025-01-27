import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      'no-console': 'warn', // Warn on console logs
      'prettier/prettier': ['error', { singleQuote: true }], // Use single quotes in strings
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
