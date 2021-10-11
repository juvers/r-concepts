// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {type: 'problem'},
  create(context) {
    return {
      /** @param {import('estree').ImportDeclaration} node */
      ImportDeclaration(node) {
        if (
          typeof node.source.value === 'string' &&
          /[~/]blocks\/.*/.test(node.source.value)
        ) {
          const filename = context.getFilename();
          // Special cases: blocks, pages, templates can all use blocks.
          if (/\/(?:blocks|pages|templates)\//.test(filename)) return;
          // Special case: the App can use blocks.
          if (/App\..*$/.test(filename)) return;
          context.report({
            node,
            message:
              "Avoid importing from 'blocks' outside of pages.\n" +
              'Blocks (and related utils) often depend on data and types ' +
              'generated from GraphQL, which means they will not work ' +
              'in components that are documented and used in the docs app.',
          });
        }
      },
    };
  },
};
