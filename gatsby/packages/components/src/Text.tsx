/** @jsx jsx */
import {Text as ThemeUIText} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';
import type {TextProps as ThemeUITextProps} from 'theme-ui';

/**
 * Primitive typographic component.
 *
 * Text style variants can be defined in the theme.text object.
 * @see https://theme-ui.com/components/text
 */
export const Text = ThemeUIText as ThemeUIComponent<
  'text',
  'div',
  ThemeUITextProps
>;

export type TextProps = ComponentProps<typeof Text>;
