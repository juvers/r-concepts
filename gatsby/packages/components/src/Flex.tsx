/** @jsx jsx */
import {Flex as ThemeUIFlex} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';
import type {FlexProps as ThemeUIFlexProps} from 'theme-ui';

/**
 * Use the Flex component to create flexbox layouts.
 * @see https://theme-ui.com/components/flex
 */
export const Flex = (ThemeUIFlex as unknown) as ThemeUIComponent<
  undefined,
  'div',
  ThemeUIFlexProps
>;

export type FlexProps = ComponentProps<typeof Flex>;
