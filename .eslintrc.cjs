module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.eslintrc.cjs',
    '*.config.js',
    '*.config.ts',
    'shared/**/*',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'react-hooks'],
  rules: {
    'react-refresh/only-export-components': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
  },
  overrides: [
    {
      // TypeScript files
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }],
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: [
          './*/tsconfig.json',
          './*/tsconfig.app.json',
          './*/tsconfig.node.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    {
      // JavaScript files (no type checking)
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      extends: [
        'plugin:react-hooks/recommended',
      ],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      // Server files (TypeScript without tsconfig.json coverage)
      files: ['**/server.ts', '**/server.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
      parserOptions: {
        project: null,
      },
    },
  ],
}
