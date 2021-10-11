// @ts-check

/** @typedef {import('gatsby').Node} Node */
/** @typedef {string | import('graphql').GraphQLOutputType} TypeOrTypeName */

/**
 * @typedef {import('gatsby').CreateResolversArgs & {
 *   intermediateSchema: import('graphql').GraphQLSchema
 * }} CreateResolversArgs
 */

/**
 * @typedef {{
 *   type: TypeOrTypeName;
 *   query: {filter: {}, sort?: {}};
 *   firstOnly?: boolean;
 * }} QueryArguments
 */

/**
 * @typedef {{
 *   runQuery(args: QueryArguments): Promise<Node | null>;
 *   findRootNodeAncestor(
 *     obj: {} | {}[],
 *     predicate?: (node: Node) => boolean
 *   ): Node | null;
 * }} GatsbyNodeModel
 */

/**
 * @template TSource
 * @typedef {{
 *   nodeModel: GatsbyNodeModel;
 *   defaultFieldResolver: import('graphql').GraphQLFieldResolver<TSource, unknown>;
 * }} GatsbyResolverContext
 */

/**
 * @template TSource
 * @template TResult
 * @typedef {(...args: Parameters<import('graphql').GraphQLFieldResolver<
 *   TSource,
 *   GatsbyResolverContext<TSource>,
 * >>) => TResult} GatsbyFieldResolver
 */

/**
 * Resolves to the `ImageSharp` node related to the ancestor `Image` node.
 *
 * @type {GatsbyFieldResolver<Node, Promise<Node | null>>}
 */
const resolveImageSharp = async (source, args, context) => {
  const fileNode = context.nodeModel.findRootNodeAncestor(
    source,
    (node) => node.internal && node.internal.type === 'File',
  );
  if (!fileNode) return null;
  const imageSharpNode = await context.nodeModel.runQuery({
    type: 'ImageSharp',
    query: {filter: {parent: {id: {eq: fileNode.id}}}},
    firstOnly: true,
  });
  if (!imageSharpNode) return null;
  return imageSharpNode;
};

/**
 * Resolves to a field of the same name on the ImageSharp node
 * related to the ancestor Image node.
 *
 * @param {import('graphql').GraphQLFieldMap<unknown, unknown>} fields
 * @returns {GatsbyFieldResolver<Node, Promise<Node | null>>}
 */
const imageSharpFieldResolver = (fields) => async (
  source,
  args,
  context,
  info,
) => {
  const field = fields[info.fieldName];
  if (!field || !field.resolve) return null;
  const imageSharpNode = await resolveImageSharp(source, args, context, info);
  if (!imageSharpNode) return null;
  return field.resolve(imageSharpNode, args, context, info);
};

/** @param {import('graphql').GraphQLArgument[]} args */
const mapArgs = (args) =>
  args.reduce(
    (map, {name, ...options}) => ({...map, [name]: options}),
    /** @type {Record<string, Omit<import('graphql').GraphQLArgument, 'name'>>}*/
    ({}),
  );

/**
 * Create resolvers on `Image` that reflect the `ImageSharp` fields.
 *
 * These are defined here (instead of in the `Image.graphql` SDL along
 * with the rest of the fields) because gatsby-transformer-sharp
 * creates `ImageSharp` types after we've created our types
 * (they aren't predefined, for some reason). Since `createResolvers`
 * runs after all of the schema has been generated, we have to add fields
 * that use the `ImageSharp` types there.
 *
 * @param {CreateResolversArgs} args
 */
module.exports = function createImageResolvers({
  createResolvers,
  intermediateSchema,
}) {
  const ImageSharp = intermediateSchema.getType('ImageSharp');
  if (!ImageSharp) throw new Error('Could not find ImageSharp type!');
  if (!('isTypeOf' in ImageSharp)) {
    throw new Error('Expected ImageSharp to be GraphQLObject!');
  }
  const imageSharpFields = ImageSharp.getFields();
  const resolveImageSharpField = imageSharpFieldResolver(imageSharpFields);
  createResolvers({
    Image: {
      childImageSharp: {
        type: 'ImageSharp!',
        deprecationReason:
          'Use `fixed`, `fluid`, `resize` fields on `Image` instead',
        resolve: resolveImageSharp,
      },
      fixed: {
        type: 'ImageSharpFixed!',
        args: mapArgs(imageSharpFields.fixed.args),
        resolve: resolveImageSharpField,
      },
      fluid: {
        type: 'ImageSharpFluid!',
        args: mapArgs(imageSharpFields.fluid.args),
        resolve: resolveImageSharpField,
      },
      original: {
        type: 'ImageSharpOriginal!',
        resolve: resolveImageSharpField,
      },
      resize: {
        type: 'ImageSharpResize!',
        args: mapArgs(imageSharpFields.resize.args),
        resolve: resolveImageSharpField,
      },
    },
  });
};
