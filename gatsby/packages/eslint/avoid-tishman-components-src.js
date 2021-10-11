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
          node.source.value.startsWith('@tishman/components/src')
        ) {
          context.report({
            node,
            message:
              "Avoid importing from '@tishman/components/src' files directly",
          });
        }
      },
    };
  },
};
