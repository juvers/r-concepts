#! /usr/local/bin node
// @ts-check
const path = require('path');
const Module = require('module');
// @ts-expect-error: Digging into gatsby internals here.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const {specifiedScalarTypes} = require('gatsby/graphql');
// eslint-disable-next-line @typescript-eslint/unbound-method
const {startCase} = require('lodash');
const debug = require('debug')('tishman:generate-sanity-schema');

/**
 * @typedef {Record<string, () => SanityRule>} SanityRule
 */

/**
 * @typedef {object} SanityType
 * @prop {string} type
 * @prop {string} name
 * @prop {SanityType[]} [of]
 * @prop {SanityType[]} [to]
 * @prop {SanityType[]} [fields]
 * @prop {(rule: SanityRule) => unknown} [validation]
 */

/**
 * @typedef {object} SanitySchema
 * @prop {string} name
 * @prop {SanityType[]} types
 */

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const scalarTypeNames = /** @type {{ name: string; }[]} */ (specifiedScalarTypes)
  .map((def) => def.name)
  .concat(['JSON', 'Date']);

const typePrefix = 'Sanity';

/** @param {string} type */
function getTypeName(type) {
  if (!type) {
    return type;
  }

  const typeName = startCase(type);
  if (scalarTypeNames.includes(typeName)) {
    return typeName;
  }

  return `${typePrefix}${typeName.replace(/\s+/g, '').replace(/^Sanity/, '')}`;
}

/**
 * @param {SanityType} field
 * @returns {string}
 */
const getFieldType = (field) => {
  switch (field.type) {
    case 'text':
    case 'url': {
      return 'String';
    }
    case 'number': {
      return 'Float';
    }
    case 'datetime': {
      return 'Date';
    }
    case 'object': {
      return getTypeName(field.name);
    }
    case 'image': {
      return getTypeName(field.name);
    }
    case 'file': {
      return getTypeName(field.name);
    }
    case 'array': {
      const of = field.of;
      if (!of) throw new Error("Expected `of` on type `'reference'`");
      return `[${of.map(getFieldType).join(', ')}]`;
    }
    case 'reference': {
      const to = field.to;
      if (!to) throw new Error("Expected `to` on type `'reference'`");
      if (to.length > 1) {
        throw new Error('dunno how to handle multiple `to` references yet!');
      }
      return getFieldType(to[0]);
    }
    case 'simpleRichtext': {
      return `[${getTypeName('block')}]`;
    }
    case 'document': {
      const typeName = getTypeName(field.type);
      return `${getTypeName(field.name)} implements ${typeName} & Node`;
    }
    default: {
      return getTypeName(field.type);
    }
  }
};

/** @param {SanityType} field */
const getFieldName = (field) => {
  switch (field.type) {
    case 'datetime': {
      return `${field.name}(formatString: String, fromNow: Boolean, difference: String, locale: String)`;
    }
    default: {
      return field.name;
    }
  }
};

/**
 * @param {(required: boolean) => void} resolve
 * @returns {SanityRule}
 */
function createRule(resolve) {
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'required') {
          return () => {
            resolve(true);
            return createRule(resolve);
          };
        }
        return () => createRule(resolve);
      },
    },
  );
}

/**
 * @param {SanityType} type
 */
function isRequiredField(type) {
  let required = false;
  if (type.validation) {
    type.validation(
      createRule(() => {
        required = true;
      }),
    );
  }
  return required;
}

/**
 * @param {SanityType} type
 * @param {string[]} out
 */
function printSanityType(type, out) {
  /** @type {string[]} */
  const lines = [];
  try {
    const typeName = getFieldType(type);
    if (!type.fields || !type.fields.length) return;
    for (const field of type.fields) {
      if (isRequiredField(field)) {
        lines.push(`  ${getFieldName(field)}: ${getFieldType(field)}!`);
      }
    }
    if (lines.length) {
      lines.unshift(`type ${typeName} {`);
      lines.push('}');
      out.push(lines.join('\n'));
    }
  } catch (e) {
    debug(`failed to print schema type:`);
    debug(type);
    throw e;
  }
}

/**
 * @param {SanitySchema} schema
 * @returns {string}
 */
function printSanitySchema(schema) {
  /** @type {string[]} */
  const out = [];
  for (const type of schema.types) {
    printSanityType(type, out);
  }
  return out.join('\n');
}

/** @param {string} basePath */
function registerBabelLoader(basePath) {
  const babelConfig = {
    compact: false,
    root: basePath,
    ignore: [path.join(basePath, 'node_modules')],
    test: /.*/,
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };
  // @ts-expect-error: untyped
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  require('@babel/register')(babelConfig);
}

/**
 * @param {string} filename
 * @param {NodeJS.Module | undefined} parent
 * @param {string} src
 * @returns {unknown}
 */
function createModule(filename, parent, src) {
  const created = new Module(filename, parent);
  // @ts-expect-error: internal method
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  created._compile(src, filename);
  // @ts-expect-error: internal method
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Module._cache[filename] = created;
  return created.exports;
}

function mockPluginLoader() {
  const cachedNames = new Set();

  // @ts-expect-error: internal method
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  Module._load = new Proxy(Module._load, {
    /**
     * @param {Function} target
     * @param {unknown} thisArg
     * @param {[string, NodeJS.Module]} argumentsList
     * @returns {unknown}
     */
    apply(target, thisArg, argumentsList) {
      const [request, parent] = argumentsList;
      // Use an empty array for the list of base schema types.
      if (request.startsWith('all:part:@sanity/base/schema-type')) {
        cachedNames.add(request);
        return createModule(request, parent, `module.exports = []`);
      }
      // Use an identify function for sanity parts.
      if (request.startsWith('part:@sanity')) {
        cachedNames.add(request);
        return createModule(request, parent, `module.exports = (v) => v`);
      }
      // Try and load the request normally.
      try {
        return Reflect.apply(target, thisArg, argumentsList);
      } catch {
        // If that failed, try and load the request from this context.
        debug(`request for ${request} failed; using local version...`);
        try {
          return Reflect.apply(target, thisArg, [request, module]);
        } catch {
          // If that failed, use a null function and hope for the best...
          cachedNames.add(request);
          debug(
            `request for local version of ${request} failed; using null function...`,
          );
          return createModule(request, parent, `module.exports = () => null`);
        }
      }
    },
  });
}

/**
 * @param {string} schemaPath
 * @param {string} [basePath]
 * @returns {string}
 */
function generateSanitySchema(schemaPath, basePath = process.cwd()) {
  debug(`Registering babel loader with basePath ${basePath}`);
  registerBabelLoader(basePath);
  mockPluginLoader();
  debug(`Loading sanity schema at ${schemaPath}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sanitySchema = require(schemaPath);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const schema = sanitySchema.default || sanitySchema;
  return printSanitySchema(schema);
}

module.exports = generateSanitySchema;

// If this is module is being run as a script,
// process argv and invoke the appropriate command.
if (
  typeof require !== 'undefined' &&
  require.main === /** @type {unknown} */ (module)
) {
  console.log(generateSanitySchema('../../sanity/schemas/schema'));
}
