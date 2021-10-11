/** @jsx jsx */
import {jsx, ThemeProvider, getThemeByName} from '@tishman/components';

import type {ComponentPropsWithoutRef} from 'react';
import type {TishmanThemeName} from '@tishman/components';

export interface LayoutProps extends ComponentPropsWithoutRef<'main'> {
  theme?: TishmanThemeName;
  /** An optional map of styled components to use for rich text, etc. */
  components?: ComponentPropsWithoutRef<typeof ThemeProvider>['components'];
}

export function Layout({
  theme,
  components,
  children,
  sx: withSx,
  ...props
}: LayoutProps): JSX.Element {
  if (theme || components) {
    return (
      <ThemeProvider
        theme={theme ? getThemeByName(theme) : {}}
        components={components}
      >
        <main sx={withSx} {...props}>
          {children}
        </main>
      </ThemeProvider>
    );
  } else {
    return (
      <main sx={withSx} {...props}>
        {children}
      </main>
    );
  }
}
