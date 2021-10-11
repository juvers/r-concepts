// @ts-check

/**
 * @typedef {Record<string, string>} SvgNode
 *
 * @typedef {object} SvgFilter
 * @prop {string[]} path
 * @prop {(value: Record<string, unknown>) => void} update
 */

module.exports = () => {
  return {
    plugins: [
      'gatsby-plugin-theme-ui',
      {
        /** Automatically load svgs as React comonents. */
        resolve: 'gatsby-plugin-react-svg',
        options: {
          rule: {
            /**
             * Any svgs in the icons dir are automatically
             * converted to React components.
             */
            include: /icons\/.*\.svg$/,
            options: {
              filters: [
                /**
                 * Make sure svgs have a default width and height.
                 * We do this so that they will display at a reasonable size
                 * by default.
                 *
                 * @param {SvgNode} value
                 * @this {SvgFilter}
                 */
                function ensureWidthAndHeight(value) {
                  if (
                    this.path[this.path.length - 1] === 'props' &&
                    'viewBox' in value &&
                    !('width' in value && 'height' in value)
                  ) {
                    const [, , width, height] = value['viewBox'].split(' ');
                    this.update({...value, width, height});
                  }
                },
                /**
                 * Use `currentColor` for fill and stroke values.
                 * We do this so that svg colors be styled with 'color'
                 * without having to know if the svg uses strokes or fills.
                 *
                 * Note that this only works because we assume svgs
                 * are monotone, with negative space being transparent.
                 *
                 * @param {SvgNode} value
                 * @this {SvgFilter}
                 */
                function setFillAndStrokeToCurrentColor(value) {
                  if (this.path[this.path.length - 1] === 'props') {
                    this.update(
                      Object.keys(value).reduce((
                        /** @type {SvgNode} */
                        acc,
                        key,
                      ) => {
                        if (
                          (key === 'fill' || key === 'stroke') &&
                          value[key] &&
                          value[key] !== 'none'
                        ) {
                          acc[key] = 'currentColor';
                        } else {
                          acc[key] = value[key];
                        }
                        return acc;
                      }, {}),
                    );
                  }
                },
              ],
            },
          },
        },
      },
    ],
  };
};
