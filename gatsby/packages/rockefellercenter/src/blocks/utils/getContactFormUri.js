// NOTE: this is as a cjs module so it can be used `gatsby-node.js`

const CONTACT_PATH = '/contact/';

/**
 * @param {string} slug
 * @return {string}
 */
exports.getContactFormUri = function getEventDetailUri(slug) {
  return `${CONTACT_PATH}${slug.replace(/^\//, '')}`;
};
