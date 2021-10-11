/** @jsx jsx */
import {Divider as ThemeUIDivider} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

/**
 * Centered, max-width layout component
 *
 * Divider variants can be defined in the `theme.layout` object.
 * The Divider component uses `theme.layout.Divider` as its default variant style.
 * @see https://theme-ui.com/components/Divider
 */
export const Divider = ThemeUIDivider as ThemeUIComponent<undefined, 'hr'>;

export type DividerProps = ComponentProps<typeof Divider>;
