import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint' // Unified package
import react from 'eslint-plugin-react'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // 1. Global Ignores (must be separate in Flat Config)
  { 
    ignores: ['dist', 'node_modules', 'build', '.DS_Store'] 
  },
  
  // 2. Base Configurations
  js.configs.recommended,
  ...tseslint.configs.recommended, // The "..." spread is vital here

  // 3. Main Logic for TS/React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        // Change this line to use a glob or explicit reference
        project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'], 
        projectServices: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': react,
      'prettier': prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules, 
      'prettier/prettier': 'error',

      // Senior Developer Standards
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/jsx-boolean-value': ['error', 'never'],
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
)