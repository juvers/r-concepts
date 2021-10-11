/** @jsx jsx */
import {jsx, Box} from '@tishman/components';
import {forwardRef} from 'react';

import type {
  ResponsiveStyleValue,
  ThemeUIComponentProps,
} from '@tishman/components';
import type {ElementType, Ref} from 'react';

const toPct = (ratio: number): number => Math.round((1 / ratio) * 10000) / 100;

/**
 * Given a `ratio` value or array of values,
 * generates a padding value for maintaining that aspect ratio
 * by sandwiching content between floated `::before` and
 * cleared `::after` pseudo elements.
 *
 * @see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6
 */
const intrinsicPadding = (
  ratio: ResponsiveStyleValue<number> = 1,
): ResponsiveStyleValue<string> => {
  if (typeof ratio === 'number') {
    return `${toPct(ratio)}%`;
  } else if (Array.isArray(ratio)) {
    return ratio.map((r) => (r == null ? r : `${toPct(r)}%`));
  } else {
    return ratio;
  }
};

export type IntrinsicBoxProps<
  As extends ElementType = 'div'
> = ThemeUIComponentProps<undefined, As> & {
  as?: As;
  /**
   * The intrinsic ratio of width to height for the content.
   *
   * Defaults to `1` (square).
   *
   * May also be defined as a responsive value.
   *
   * Some example values:
   *   - widescreen (16:9): `1.78`
   *   - golden ratio: `1.618`
   *   - square on small screens, wide otherwise: `[1, 16 / 9]`
   */
  ratio?: ResponsiveStyleValue<number>;
  /**
   * The minimum width for the box.
   *
   * If defined, the box will not get narrower than this value,
   * and it will also maintain a proportional height as defined by `ratio`.
   *
   * May also be defined as a responsive value.
   */
  minWidth?: ResponsiveStyleValue<number | string>;
  /**
   * The maximum width for the box.
   *
   * If defined, the box will not get wider than this value,
   * and it will also maintain a proportional height as defined by `ratio`.
   *
   * May also be defined as a responsive value.
   */
  maxWidth?: ResponsiveStyleValue<number | string>;
};

/**
 * Use the IntrinsicBox component like a ThemeUI Box, but
 * with a `ratio` prop like ThemeUI AspectRatio.
 *
 * The differences between this component and AspectRatio are:
 *
 * - AspectRatio hides overflow (and thus requires content to be positioned),
 *   while this component shows overflow, and content is allowed to flow.
 *
 * - AspectRatio only supports one `ratio` value, while this component supports
 *   multiple for responsive designs
 *
 * - It supports `minWidth` and `maxWidth` props, which can also be responsive
 *
 * @example
 *   <IntrinsicBox ratio={278 / 178} p={4} bg="primary">
 *     Beep
 *   </IntrinsicBox>
 *
 * @see https://tishman.netlify.app/components/intrinsic-box
 * @see https://theme-ui.com/components/box/
 * @see https://theme-ui.com/components/aspect-ratio/
 * @see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6
 */
export const IntrinsicBox = forwardRef(function IntrinsicBox(
  {ratio = 1, minWidth, maxWidth, sx, ...props}: IntrinsicBoxProps,
  forwardedRef: Ref<HTMLDivElement>,
): JSX.Element {
  return (
    <Box
      {...props}
      ref={forwardedRef}
      sx={{
        ...sx,
        minWidth,
        maxWidth,
        '::before': {
          content: "''",
          width: '1px',
          marginLeft: '-1px',
          float: 'left',
          height: '0px',
          paddingTop: intrinsicPadding(ratio),
        },
        '::after': {
          content: "''",
          display: 'table',
          clear: 'both',
        },
      }}
    />
  );
}) as <As extends ElementType = 'div'>(
  props: IntrinsicBoxProps<As>,
) => JSX.Element;
// NOTE: We assert the above component as a function type (instead of
// defining it in the `forwardRef` call or function declaration)
// because the `forwardRef` type does not support generics
// (like `<As>`) in prop types.
// See https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
