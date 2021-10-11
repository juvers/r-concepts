/** @jsx jsx */
import {Grid as ThemeUIGrid} from 'theme-ui';

import type {GridProps as ThemeUIGridProps} from 'theme-ui';
import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

/**
 * CSS grid layout component to arrange direct child elements in a tiled grid layout.
 * @see https://theme-ui.com/components/grid
 */
export const Grid = ThemeUIGrid as ThemeUIComponent<
  undefined,
  'div',
  ThemeUIGridProps
>;

export type GridProps = ComponentProps<typeof Grid>;
