// NOTE: this is as a cjs module so it can be used `gatsby-node.js`
const {default: slugify} = require('slugify');

/**
 * @param {{titleAndSlug?: {slug?: {current?: string}}, category?: string}} story
 * @return {string}
 */
exports.getStoryDetailUri = function getStoryDetailUri(story) {
  const slug = story.titleAndSlug.slug.current;
  if (!slug) throw new Error('A story slug is required!');
  const category = story.category;
  if (!category) throw new Error('A story category is required!');
  const category_slug = slugify(category, {lower: true, remove: /and/g});
  return `/magazine/${category_slug}/${slug}`;
};
