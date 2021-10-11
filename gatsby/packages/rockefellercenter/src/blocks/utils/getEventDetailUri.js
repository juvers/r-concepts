// NOTE: this is as a cjs module so it can be used `gatsby-node.js`

/**
 * @param {{
 * titleAndSlug: {slug: {current?: string}}
 * type: string | undefined
 * }} event
 * @return {string}
 */
exports.getEventDetailUri = function getEventDetailUri(event) {
  const slug = event.titleAndSlug.slug.current;
  const {type} = event;
  if (!slug) throw new Error('An event slug is required!');
  if (!type) throw new Error('An event type is required!');
  if (type === 'event.treeLighting') return `/holidays/${slug}`;
  if (type === 'event.virtual') return `${slug}`;
  return `/events/${slug}`;
};
