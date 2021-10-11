/** @jsx jsx */
import {jsx, Box} from '@tishman/components';
import {forwardRef} from 'react';
import {IntrinsicBox} from './IntrinsicBox';

import type {IntrinsicBoxProps} from '@tishman/components';
import type {ElementType, Ref} from 'react';

export type IntrinsicFlexProps<
  As extends ElementType = 'div'
> = IntrinsicBoxProps<As>;

/**
 * Use the IntrinsicFlex component like a ThemeUI Flex, but
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
 *   <IntrinsicFlex ratio={278 / 178} p={4} bg="primary">
 *     Beep
 *   </IntrinsicFlex>
 *
 * @see https://tishman.netlify.app/components/intrinsic-flex
 * @see https://theme-ui.com/components/flex/
 * @see https://theme-ui.com/components/aspect-ratio/
 * @see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6
 */
export const IntrinsicFlex = forwardRef(function IntrinsicFlex(
  {ratio = 1, minWidth, maxWidth, ...props}: IntrinsicFlexProps,
  forwardedRef?: Ref<HTMLDivElement>,
): JSX.Element {
  return (
    <IntrinsicBox
      ratio={ratio}
      minWidth={minWidth}
      maxWidth={maxWidth}
      sx={{display: 'flex'}}
    >
      <Box
        ref={forwardedRef}
        // Taken from https://github.com/system-ui/theme-ui/blob/57483e/packages/components/src/AspectRatio.js#L21
        __css={{display: 'flex', flex: 1}}
        {...props}
      />
    </IntrinsicBox>
  );
}) as <As extends ElementType = 'div'>(
  props: IntrinsicFlexProps<As>,
) => JSX.Element;
// NOTE: We assert the above component as a function type (instead of
// defining it in the `forwardRef` call or function declaration)
// because the `forwardRef` type does not support generics
// (like `<As>`) in prop types.
// See https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
