/** @jsx jsx */
import {Button as ThemeUIButton} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

/**
 * Primitive button component with variants
 * @see https://theme-ui.com/components/button
 */
export const Button = ThemeUIButton as ThemeUIComponent<'buttons', 'button'>;

export type ButtonProps = ComponentProps<typeof Button>;
