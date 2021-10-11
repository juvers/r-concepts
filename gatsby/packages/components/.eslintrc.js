const path = require('path');
const {sync: globSync} = require('glob');

/** Supported alias file extensions. */
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/** A list of filenames (and directories) under `src` to alias. */
const filenamesToAlias =
  /** Glob for all directories directly under `src`.*/
  globSync(path.join(__dirname, 'src/*/')).concat(
    /** Glob for all files directly under `src` with supported extensions. */
    globSync(path.join(__dirname, `src/*+(${extensions.join('|')})`)),
  );

/** Get a file's base name without its extension. */
const getBasename = (filename) =>
  path.basename(filename).replace(/(.*)\..*$/, '$1');

module.exports = {
  extends: '../../.eslintrc.js',
  settings: {
    'import/resolver': {
      // Alias "src/*" as "~*".
      // Why "~" instead of "@"?
      // See https://www.mrozilla.cz/blog/gatsby-eslint-vscode-import-alias/
      alias: {
        map: filenamesToAlias.map((filename) => [
          `~${getBasename(filename)}`,
          filename,
        ]),
        extensions,
      },
    },
  },
};
