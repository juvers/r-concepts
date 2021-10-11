// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {type: 'problem', fixable: 'code'},
  create(context) {
    return {
      /** @param {import('estree').ImportDeclaration} node */
      ImportDeclaration(node) {
        if (
          node.source.value === 'theme-ui' &&
          node.specifiers[0].type !== 'ImportNamespaceSpecifier' &&
          !node.specifiers.some((specifier) => {
            if (!('imported' in specifier)) return false;
            return specifier.local.name !== specifier.imported.name;
          })
        ) {
          context.report({
            node,
            message:
              "Use '@tishman/components' instead of using 'theme-ui' directly",
            fix(fixer) {
              // Look for other '@tishman/components' import to merge with.
              for (const sibling of /** @type {import('estree').Program} */
              (context.getAncestors()[0]).body) {
                if (
                  sibling.type === 'ImportDeclaration' &&
                  // @ts-expect-error: this seems to be on nodes that represent
                  // type imports, e.g., `import type {..} from '...'`
                  sibling.importKind !== 'type' &&
                  sibling.source.value === '@tishman/components'
                ) {
                  return [
                    fixer.insertTextBefore(
                      sibling.specifiers[0],
                      node.specifiers
                        .map((specifier) => {
                          if (!('imported' in specifier)) {
                            return specifier.local.name;
                          } else if (
                            specifier.local.name === specifier.imported.name
                          ) {
                            return specifier.local.name;
                          } else {
                            return `${specifier.imported.name} as ${specifier.local.name}`;
                          }
                        })
                        .concat([''])
                        .join(', '),
                    ),
                    fixer.remove(node),
                  ];
                }
              }
              return fixer.replaceText(node.source, "'@tishman/components'");
            },
          });
        }
      },
    };
  },
};
