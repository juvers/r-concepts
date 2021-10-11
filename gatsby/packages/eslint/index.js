module.exports = {
  rules: {
    'prefer-tishman-components': require('./prefer-tishman-components'),
    'avoid-tishman-components-src': require('./avoid-tishman-components-src'),
    'avoid-blocks-without-pages': require('./avoid-blocks-without-pages'),
  },
  configs: {
    recommended: {
      plugins: ['@tishman'],
      rules: {
        '@tishman/prefer-tishman-components': 2,
        '@tishman/avoid-tishman-components-src': 2,
        '@tishman/avoid-blocks-without-pages': 2,
      },
    },
  },
};
