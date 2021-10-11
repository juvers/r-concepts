/** @jsx jsx */
import {Container as ThemeUIContainer} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

/**
 * Centered, max-width layout component
 *
 * Container variants can be defined in the `theme.layout` object.
 * The Container component uses `theme.layout.container` as its default variant style.
 * @see https://theme-ui.com/components/container
 */
export const Container = ThemeUIContainer as ThemeUIComponent<'layout'>;

export type ContainerProps = ComponentProps<typeof Container>;
