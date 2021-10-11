import * as React from 'react';
import {useState, useEffect} from 'react';
import {ActiveThemeProvider} from '~gatsby-theme-docz';
import {themes} from '~gatsby-theme-docz/theme';

import type {PropsWithChildren} from 'react';
import type {TishmanThemeName} from '@tishman/components';

const getInitialTheme = (defaultTheme: TishmanThemeName): TishmanThemeName => {
  if (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  ) {
    const activeTheme = window.localStorage.getItem('tishman-active-theme');
    if (activeTheme && activeTheme in themes) {
      return activeTheme as TishmanThemeName;
    }
  }
  return defaultTheme;
};

const Wrapper = ({
  children,
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const activeThemeState = useState<TishmanThemeName>(() =>
    getInitialTheme('Rock Center'),
  );
  const [activeTheme] = activeThemeState;

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      window.localStorage.setItem('tishman-active-theme', activeTheme);
    }
  }, [activeTheme]);

  return (
    <ActiveThemeProvider value={activeThemeState}>
      {children}
    </ActiveThemeProvider>
  );
};

/**
 * Wrap docz pages in an active theme context.
 *
 * Note: We put this here (instead of in the docz theme or wrapper,
 * for instance), because we want to wrap the whole docs site in this context.
 *
 * @see ./gatsby-theme-docz/index.tsx
 * @see ./style-guide/ThemeSelect
 */
export default function wrapPageElement(props: {
  element: Record<string, unknown>;
}): JSX.Element {
  /**
   * We have a layer of indirection so that we can use a state hook.
   * See https://spectrum.chat/gatsby-js/general/it-it-possible-to-use-react-hooks-inside-gatsby-browser-js~bda3fe45-352f-4a35-99b6-29026c6257b1
   */
  return <Wrapper>{props.element}</Wrapper>;
}
