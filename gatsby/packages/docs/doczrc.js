// @ts-check
const path = require('path');
const {sync: globSync} = require('glob');
const {existsSync} = require('fs');

const MDX_GLOB = './src/**/*.mdx';

/**
 * Package directories that we don't want to generate docs from.
 *
 * Note that we exclude the `docs` package because it is being explicitly
 * configured.
 */
const excludedPackages = [__dirname, path.resolve(__dirname, '../types')];

/** A list of package directories that we want to generate docs from. */
const packages = globSync('../*/').filter(
  (globPath) =>
    // Explicitly exclude packages
    !excludedPackages.includes(path.resolve(__dirname, globPath)) &&
    // Also exclude any directories that aren't packages (no package.json)
    existsSync(path.resolve(__dirname, path.join(globPath, 'package.json'))),
);

module.exports = {
  typescript: true,
  editBranch: process.env.BRANCH || 'master', // BRANCH env from netlify https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
  menu: [
    'Getting Started',
    'Style Guide',
    'Guides',
    'Components',
    'Hooks',
    {name: 'Rockefeller Center', menu: ['Overview']},
  ],
  files: [MDX_GLOB, ...packages.map((pkg) => path.join(pkg, MDX_GLOB))],
  docgenConfig: {
    searchPatterns: [
      '../**/*.{ts,tsx,js,jsx,mjs}',
      '!**/node_modules',
      '!**/doczrc.js',
    ],
  },
};
