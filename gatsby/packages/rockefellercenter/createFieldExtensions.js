// @ts-check
const path = require('path');

/** @typedef {import('gatsby').Node} Node */
/** @typedef {import('gatsby').CreateSchemaCustomizationArgs} CreateSchemaCustomizationArgs */
/** @typedef {string | import('graphql').GraphQLOutputType} TypeOrTypeName */

/**
 * @typedef {{
 *   findRootNodeAncestor(
 *     obj: {} | {}[],
 *     predicate?: (node: Node) => boolean
 *   ): Node | null;
 *   getAllNodes(args: {type?: TypeOrTypeName}): Node[];
 * }} GatsbyNodeModel
 */

/**
 * @template TSource
 * @typedef {{
 *   nodeModel: GatsbyNodeModel,
 *   defaultFieldResolver: GatsbyFieldResolver<TSource>
 * }} GatsbyResolverContext
 */

/**
 * @template TSource
 * @typedef {Omit<import('graphql').GraphQLFieldConfig<
 *   TSource,
 *   GatsbyResolverContext<TSource>
 * >, 'type'> & {type: TypeOrTypeName}} GatsbyFieldConfig
 */

/**
 * @template TSource
 * @typedef {import('graphql').GraphQLFieldResolver<
 *   TSource,
 *   GatsbyResolverContext<TSource>
 * >} GatsbyFieldResolver
 */

/**
 * @template TSource
 * @typedef {{
 *   name: string;
 *   description?: string;
 *   extend: (
 *     config: {},
 *     fieldConfig: GatsbyFieldConfig<TSource>,
 * ) => Partial<GatsbyFieldConfig<TSource>>;
 * }} GatsbyFieldExtension
 */

/**
 * A GraphQL field extension that will automatically resolve
 * the extended field to a field on the ancestor File node.
 *
 * Example:
 * ```graphql
 * type Image implements Node @dontInfer @childOf(type: "File") {
 *    sourceInstanceName: String! @proxyFile
 *  }
 * ```
 *
 * @see https://www.gatsbyjs.com/docs/actions/#createFieldExtension
 * @type {GatsbyFieldExtension<Node>}
 */
const proxyFile = {
  name: 'proxyFile',
  description: 'Resolves to a field value on the ancestor File node.',
  extend: () => {
    return {
      resolve: (source, _, context, info) => {
        const fileNode = context.nodeModel.findRootNodeAncestor(
          source,
          (node) => node.internal && node.internal.type === `File`,
        );
        if (!fileNode) return null;
        return fileNode[info.fieldName];
      },
    };
  },
};

/**
 * A GraphQL field extension that links a file path field
 * to the `Image` node for the path.
 *
 * This is useful because gatsby-source-filesystem creates `File` nodes
 * for the relative urls it finds in our data, but since our data
 * is just strings, there has to be some 'glue' code that resolves
 * to the right `File` node for the given url string.
 *
 * Example:
 * ```graphql
 * type SomeDataType {
 *   image: Image! @imageByRelativePath`
 * }
 * ```
 *
 * @see https://www.gatsbyjs.com/docs/actions/#createFieldExtension
 * @type {GatsbyFieldExtension<Node>}
 */
const imageByRelativePath = {
  name: 'imageByRelativePath',
  description: 'Link to Image node by relative path.',
  extend: (_, fieldConfig) => {
    return {
      type: 'Image!',
      resolve: async (source, args, context, info) => {
        const resolver = fieldConfig.resolve || context.defaultFieldResolver;
        /** @type {string | string[] | null | undefined} */
        const fieldValue = await resolver(source, args, context, info);
        if (fieldValue == null) return null;

        const parentFileNode = context.nodeModel.findRootNodeAncestor(
          source,
          (node) => node.internal && node.internal.type === 'File',
        );
        if (!parentFileNode || typeof parentFileNode.dir !== 'string') {
          return null;
        }
        const dir = parentFileNode.dir;

        /** @param {string} relativePath */
        const findLinkedImageNode = (relativePath) => {
          const fileLinkPath = path.normalize(path.resolve(dir, relativePath));

          const linkedFileNode = context.nodeModel
            .getAllNodes({type: 'File'})
            .find((n) => n.absolutePath === fileLinkPath);
          if (!linkedFileNode) return null;

          return context.nodeModel
            .getAllNodes({type: 'Image'})
            .find((n) => n.parent === linkedFileNode.id);
        };

        return Array.isArray(fieldValue)
          ? fieldValue.map((value) => findLinkedImageNode(value))
          : findLinkedImageNode(fieldValue);
      },
    };
  },
};

/**
 * Create custom field extensions for our schema.
 *
 * @param {CreateSchemaCustomizationArgs} args
 */
module.exports = function createFieldExtensions({actions}) {
  actions.createFieldExtension(imageByRelativePath);
  actions.createFieldExtension(proxyFile);
};
