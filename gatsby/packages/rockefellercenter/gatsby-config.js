// @ts-check
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}`,
});

// adapted from https://www.gatsbyjs.org/packages/gatsby-plugin-robots-txt/#netlify
const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://rockefellercenter.com',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,

  // GA_ID = 'UA-4932181-1',

  GTM_ID = 'GTM-NKNK8R3',
  SANITY_PROJECT_ID = 'bs9rmafh',
  SANITY_DATASET = 'production',
  SANITY_TOKEN,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

process.env.GATSBY_GTM_ID = GTM_ID;

module.exports = {
  proxy: {
    prefix: '/.netlify',
    url: 'http://localhost:9000',
  },
  siteMetadata: {
    title: 'Rockefeller Center',
    description: 'Rockefeller Center',
    author: 'hzdg',
    siteUrl,
  },
  assetPrefix: '/rc-assets/',
  plugins: [
    '@tishman/components',
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: GTM_ID,

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: {platform: 'gatsby', project: 'tishman'},

        // Specify optional GTM environment details.
        // gtmAuth: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING',
        // gtmPreview: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME',
        // dataLayerName: 'YOUR_DATA_LAYER_NAME',

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        routeChangeEventName: 'gatsby-route-change',
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 90, //by default, quality is only 50
      },
    },
    {
      resolve: `gatsby-plugin-sumo`,
      options: {
        sumoSiteId: `7001ef7d70073fe9269564266969a1167a3b8c2a6bd4eeb2838596e3380395bf`, //Sumo Site ID
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sitemap',
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
    'gatsby-transformer-json',
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
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      // adapted from https://www.gatsbyjs.org/packages/gatsby-plugin-robots-txt/#netlify
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{userAgent: '*'}],
            sitemap: `${siteUrl}/sitemap.xml`,
            host: siteUrl,
          },
          'branch-deploy': {
            policy: [{userAgent: '*', disallow: ['/']}],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{userAgent: '*', disallow: ['/']}],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    {
      resolve: 'gatsby-plugin-force-trailing-slashes',
      options: {
        excludedPaths: ['/404.html'],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
        ignore: ['**/*.graphql'],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: `${__dirname}/src/images/tishman-favicon.png`,
        name: 'Rockefeller Center',
        short_name: 'Rockefeller Center',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: `#ffffff`,
        display: 'browser',
      },
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        // expose these envs to use with ./src/environment.ts
        allowList: [
          'SANITY_PROJECT_ID',
          'SANITY_DATASET',
          'GOOGLE_API_KEY',
          'GOOGLE_SEARCH_KEY',
        ],
      },
    },
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        token: SANITY_TOKEN,
        overlayDrafts: false,
      },
    },
    {
      resolve: `gatsby-plugin-asset-path`,
    },
  ],
};
