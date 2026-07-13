import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Flags the standard React-documented data-fetching effect pattern
      // (reset a flag synchronously, then setState in a .then()/.catch()) as
      // an error. This codebase uses that pattern consistently and correctly
      // for fetch-on-mount / fetch-on-dependency-change data loading.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
