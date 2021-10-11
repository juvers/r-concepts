module.exports = {
  root: true,
  plugins: ['@tishman/eslint-plugin'],
  extends: [
    '@hzdg',
    '@hzdg/eslint-config-react',
    '@hzdg/eslint-config-jest',
    '@hzdg/eslint-config-typescript',
    'plugin:@tishman/recommended',
  ],
  parserOptions: {
    project: ['tsconfig.json', 'packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'node_modules/',
    'public/',
    '.cache/',
    '.docz/',
    '.vscode/',
    '.yarn/',
    'patches/',
    'built-lambda/',
    'static/',
    '__generated__/',
  ],
  globals: {
    __DEV__: 'readonly',
    __PATH_PREFIX__: true,
  },
  env: {
    node: true,
    es6: true,
    browser: true,
  },
};
