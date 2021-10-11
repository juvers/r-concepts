// @ts-check
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}`,
});
const {
  // adapted from https://www.gatsbyjs.org/packages/gatsby-plugin-robots-txt/#netlify
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://tishman.netlify.com',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

module.exports = {
  siteMetadata: {
    title: 'Tishman Style',
    description: 'Documentation and style guide for Tishman projects',
    author: 'hzdg',
    siteUrl,
  },
  plugins: [
    '@tishman/components',
    'gatsby-theme-docz',
    // Gatsby's default cache busting strategy is to change filenames (hashes)
    // when their contents change. However, Netlify has _its own_ cache busting
    // strategy (also based on file contents, but without hashes),
    // which is confounded by Gatsby's hashing. This plugin disables
    // that hashing so that Netlify can do its thing.
    // See https://github.com/narative/gatsby-plugin-remove-fingerprints
    'gatsby-plugin-remove-fingerprints',
    {
      resolve: `gatsby-plugin-netlify`,
      // See https://github.com/gatsbyjs/gatsby/issues/29055
      options: {
        mergeLinkHeaders: false,
        mergeCachingHeaders: false,
      },
    },
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: '__generated__/gatsby-types.d.ts',
        emitSchema: {
          '__generated__/gatsby-introspection.json': true,
        },
        emitPluginDocuments: {
          '__generated__/gatsby-plugin-documents.graphql': true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{userAgent: '*', disallow: ['/']}],
        sitemap: null,
        host: null,
      },
    },
    {
      resolve: 'gatsby-plugin-force-trailing-slashes',
      options: {
        excludedPaths: ['/404.html'],
      },
    },
  ],
};
