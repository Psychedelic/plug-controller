module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-import'],
  extends: [
      'plugin:@typescript-eslint/recommended',
      'airbnb/base',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'eslint:recommended',
  ],
  parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
          jsx: true,
          modules: true,
      },
  },
  rules: {
      'func-names': 0,
      '@typescript-eslint/no-namespace': 0,
      'import/extensions': [
          'error',
          'ignorePackages',
          {
              js: 'never',
              jsx: 'never',
              ts: 'never',
              tsx: 'never',
          },
      ],
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
  },
  env: {
      node: true,
      commonjs: true,
      jest: true,
      es2020: true,
  },
  settings: {
      'indent': ['error', 2],
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
          node: {
              extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
      },
  },
};
