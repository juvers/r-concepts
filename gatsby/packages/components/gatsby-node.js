// @ts-check
const path = require('path');

/**
 * @typedef {import('enhanced-resolve/lib/common-types').ResolverRequest} ResolverRequest
 *
 * @typedef {object} Resolver
 * @prop {(name: string) => import('tapable').Hook} ensureHook
 * @prop {(name: string) => import('tapable').Hook<ResolverRequest, unknown, () => void>} getHook
 * @prop {(
 *   resolver: import('tapable').Hook,
 *   request: ResolverRequest,
 *   message: string | null,
 *   ctx: unknown,
 *   callback: () => void
 * ) => void} doResolve
 */

/**
 * @param {string} dir
 */
const resolvePkgSrc = (dir) => {
  const segments = dir.split(path.sep).reverse();
  while (segments.length > 2) {
    const [, parent] = segments;
    if (parent === 'packages') {
      break;
    } else {
      segments.shift();
    }
  }
  return path.resolve(segments.reverse().join(path.sep), 'src');
};

/**
 * A Webpack resolve plugin that resolves paths with a configured prefix
 * (default is '~') to the parent package's `src` directory.
 *
 * @type {import('webpack').ResolvePlugin}
 */
class SrcAliasResolvePlugin {
  /**
   * @param {object} [options]
   * @param {string} [options.prefix] - The alias prefix to use. Defaults to '~'.
   */
  constructor(options) {
    this.options = {prefix: '~', ...options};
  }

  /**
   * @param {Resolver} resolver the resolver
   * @returns {void}
   */
  apply(resolver) {
    const {prefix} = this.options;
    const target = resolver.ensureHook('described-resolve');
    resolver
      .getHook('resolve')
      .tapAsync(
        'SrcAliasResolvePlugin',
        (request, resolveContext, callback) => {
          const innerRequest = request.request || request.path;
          if (innerRequest.startsWith(prefix)) {
            const issuer = request.context.issuer;
            if (!issuer) {
              throw new Error(
                `Expected an issuer while resolving ${innerRequest}`,
              );
            }
            const remainingRequest = innerRequest.substr(1);
            const srcDir = resolvePkgSrc(issuer);
            const newRequest = path.join(srcDir, remainingRequest);
            return resolver.doResolve(
              target,
              {...request, request: newRequest},
              `aliased to '${newRequest}'`,
              resolveContext,
              callback,
            );
          }
          return callback();
        },
      );
  }
}

/**
 * @param {import('gatsby').CreateWebpackConfigArgs} context - Gatsby context
 * @param {object} options - Plugin options
 * @param {string} [options.prefix] - The source alias prefix to use. Default is '~'.
 */
exports.onCreateWebpackConfig = ({actions}, {prefix = '~'}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new SrcAliasResolvePlugin({prefix})],
    },
  });
};
