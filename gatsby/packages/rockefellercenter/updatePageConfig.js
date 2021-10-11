// @ts-check

/** @typedef {import('gatsby').Page} Page */
/** @typedef {import('gatsby').Actions} Actions */
/** @typedef {import('gatsby').Reporter} Reporter */

const {readFile} = require('fs').promises;
const babylon = require(`@babel/parser`);
const traverse = require(`@babel/traverse`).default;

/** @type {import('@babel/parser').ParserOptions} */
const babelConfig = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  plugins: [
    'jsx',
    'doExpressions',
    'objectRestSpread',
    ['decorators', {decoratorsBeforeExport: true}],
    'classProperties',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'typescript',
  ],
};

/** An error has occurred while parsing a page config. */
class ParsePageConfigError extends Error {
  /**
   * @param {Page} page
   * @param {string} msg
   */
  constructor(page, msg) {
    super(`'Failed to parse page config in ${page.component}:\n${msg}`);
  }
}

/** An error has occurred while parsing a page config type. */
class ParsePageConfigTypeError extends ParsePageConfigError {
  /**
   * @param {Page} page
   * @param {string} msg
   */
  constructor(page, msg) {
    super(page, `config of type ${msg} not supported!`);
  }
}

/** An error has occurred while parsing a page config field name. */
class ParsePageConfigKeyError extends ParsePageConfigError {
  /**
   * @param {Page} page
   * @param {string} msg
   */
  constructor(page, msg) {
    super(page, `keys of type ${msg} are not supported!`);
  }
}

/** An error has occurred while parsing a page config field value. */
class ParsePageConfigValueError extends ParsePageConfigError {
  /**
   * @param {Page} page
   * @param {string} msg
   */
  constructor(page, msg) {
    super(page, `values of type ${msg} are not supported!`);
  }
}

/**
 * Parse a field from a page config.
 *
 * Page config fields are only allowed to be JSON-compatible constructs.
 *
 * @see parsePageConfig
 * @param {Page} page
 * @param {import('@babel/types').ObjectProperty['value']} node
 * @returns {string | number | boolean | null | Record<string, unknown> | Array<unknown>}
 */
const parsePageConfigField = (page, node) => {
  switch (node.type) {
    case 'BooleanLiteral':
    case 'NumericLiteral':
    case 'StringLiteral': {
      return node.value;
    }
    case 'NullLiteral': {
      return null;
    }
    case 'ObjectExpression': {
      return node.properties.reduce((value, elem) => {
        if (elem.type !== 'ObjectProperty') {
          throw new ParsePageConfigTypeError(page, node.type);
        }
        if (elem.key.type !== 'Identifier') {
          throw new ParsePageConfigKeyError(page, elem.key.type);
        }
        value[elem.key.name] = parsePageConfigField(page, elem.value);
        return value;
      }, /** @type {Record<string, unknown>} */ ({}));
    }
    case 'ArrayExpression': {
      return node.elements.map((element) => {
        if (!element) return element;
        if (element.type === 'SpreadElement') {
          throw new ParsePageConfigValueError(page, element.type);
        }
        return parsePageConfigField(page, element);
      });
    }
    default: {
      throw new ParsePageConfigValueError(page, node.type);
    }
  }
};

/**
 * Parses a page config for a page node.
 *
 * The parsed page config can be passed to the page as context.
 *
 * @param {Page} page
 * @param {string} code
 * @returns {Record<string, unknown> | null}
 */
function parsePageConfig(page, code) {
  const ast = babylon.parse(code, babelConfig);
  /** @type {Record<string, unknown> | null} */
  let config = null;
  traverse(ast, {
    ExportNamedDeclaration(astPath) {
      const {declaration} = astPath.node;
      if (declaration && declaration.type === 'VariableDeclaration') {
        const dataVariableDeclarator = declaration.declarations.find(
          (d) => d.id.type === 'Identifier' && d.id.name === 'config',
        );
        if (
          dataVariableDeclarator &&
          dataVariableDeclarator.init &&
          dataVariableDeclarator.init.type === 'ObjectExpression'
        ) {
          dataVariableDeclarator.init.properties.forEach((node) => {
            if (node.type !== 'ObjectProperty') {
              throw new ParsePageConfigTypeError(page, node.type);
            }
            if (node.key.type !== 'Identifier') {
              throw new ParsePageConfigKeyError(page, node.key.type);
            }
            if (!config) config = {};
            config[node.key.name] = parsePageConfigField(page, node.value);
          });
        }
      }
    },
  });
  return config;
}

/** @type {Map<string, Record<string, unknown>>} */
const originalContexts = new Map();

/**
 * Update the given page's context with any page config
 * exported from the page component.
 *
 * @param {Page} page
 * @param {Actions} actions
 * @param {Reporter} reporter
 */
module.exports = async function updatePageConfig(page, actions, reporter) {
  let config;
  let originalContext = originalContexts.get(page.path);
  if (!originalContext) {
    originalContext = {...page.context} || {};
    originalContexts.set(page.path, originalContext);
  }

  try {
    const code = await readFile(page.component);
    config = parsePageConfig(page, code.toString());
  } catch (error) {
    reporter.panicOnBuild(error);
  } finally {
    if (config) {
      actions.createPage({...page, context: {...originalContext, ...config}});
      reporter.verbose(
        `[pageConfig] Updated page config ${page.path}:` +
          `\n${JSON.stringify(config, null, 2)}`,
      );
    }
  }
};
