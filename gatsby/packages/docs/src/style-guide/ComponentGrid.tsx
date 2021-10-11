/* eslint-disable @tishman/prefer-tishman-components */
/** @jsx jsx */
import {jsx, useThemeUI, Grid} from 'theme-ui';

import type {Theme} from 'theme-ui';

export interface ComponentGridProps {
  title: string;
  variants?: keyof Theme;
  omit?: string[];
  children: (variant?: string) => JSX.Element;
}

export function ComponentGrid({
  variants,
  omit,
  children,
}: ComponentGridProps): JSX.Element {
  const {theme} = useThemeUI();
  return (
    <Grid
      m={6}
      gap={6}
      sx={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, max-content))',
      }}
    >
      {children()}
      {variants
        ? Object.keys(theme[variants] ?? {})
            .filter((variant) => !omit?.includes(variant))
            .map(children)
        : null}
    </Grid>
  );
}
