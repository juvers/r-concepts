/** @jsx jsx */
import {Box as ThemeUIBox} from 'theme-ui';

import type {ThemeUIComponentProps, SxStyleProp} from '~theme-ui';
import type {ElementType} from 'react';
import type {TishmanVariantType} from '~themes';

/**
 *
 * Use the Box component as a layout primitive to add margin, padding, and colors to content.
 * @see https://theme-ui.com/components/box
 */
export const Box = (ThemeUIBox as unknown) as <
  As extends ElementType = 'div',
  VariantType extends TishmanVariantType | undefined = undefined
>(
  props: BoxProps<As, VariantType>,
) => JSX.Element;

export type BoxProps<
  As extends ElementType = 'div',
  VariantType extends TishmanVariantType | undefined = undefined
> = ThemeUIComponentProps<
  VariantType,
  As,
  {
    as?: As;
    __themeKey?: VariantType;
    __css?: SxStyleProp<VariantType>;
  }
>;
