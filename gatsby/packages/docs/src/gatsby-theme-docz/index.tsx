/** @jsx jsx */
// eslint-disable-next-line @tishman/prefer-tishman-components
import {jsx, Styled, ThemeProvider} from 'theme-ui';
import {createContext, useContext} from 'react';
import {theme, ComponentsProvider} from 'docz';
import components from 'gatsby-theme-docz/src/components';
import {base, themes} from './theme';

import type {ReactNode, ComponentType, Dispatch} from 'react';
import type {TishmanThemeName} from '@tishman/components';

type ActiveThemeContext = [TishmanThemeName, Dispatch<TishmanThemeName>];

const ActiveTheme = createContext<ActiveThemeContext>([
  'Rock Center',
  () => void {},
]);

ActiveTheme.displayName = 'ActiveTheme';

export const ActiveThemeProvider = ActiveTheme.Provider;

export const useActiveTheme = (): ActiveThemeContext => {
  return useContext(ActiveTheme);
};

/**
 * Override the Docz theme component to replace the default
 * ThemeProvider. This allows Docz to use the theme
 * provided by @tishman/components (via gatsby-plugin-theme-ui).
 *
 * Note that the @tishman/components theme is _also_ being overridden
 * in `../gatsby-plugin-theme-ui`.
 *
 * @see ../gatsby-plugin-theme-ui/index.ts
 * @see ./theme/index.tsx
 * @see https://www.docz.site/docs/creating-your-themes#creating-your-theme-component
 */
const Theme = ({children}: {children: ReactNode}): JSX.Element => {
  const [theme] = useActiveTheme();
  return (
    <ThemeProvider theme={themes[theme]}>
      <ComponentsProvider components={components}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  );
};

export default theme(base)(Theme as ComponentType<Record<string, unknown>>);
