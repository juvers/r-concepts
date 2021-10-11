import doczBase from 'gatsby-theme-docz/src/theme/index';
import {merge, mergeAll} from 'lodash/fp';
import {themes as tishmanThemes} from '@tishman/components';
// eslint-disable-next-line @tishman/avoid-tishman-components-src
import tishmanBase from '@tishman/components/src/themes/base';

// eslint-disable-next-line @tishman/prefer-tishman-components
import type {ColorMode, Theme} from 'theme-ui';
import type {TishmanColorMode} from '@tishman/components';

interface DoczColorMode extends TishmanColorMode {
  link: string;
  border: string;
  sidebar: {
    bg: string;
    navGroup: string;
    navLink: string;
    navLinkActive: string;
    tocLink: string;
    tocLinkActive: string;
  };
  header: {
    bg: string;
    text: string;
    border: string;
    button: {
      bg: string;
      color: string;
    };
  };
  props: {
    bg: string;
    text: string;
    highlight: string;
    defaultValue: string;
    descriptionText: string;
    descriptionBg: string;
  };
  playground: {
    bg: string;
    border: string;
  };
  blockquote: {
    bg: string;
    border: string;
    color: string;
  };
}

/**
 * Given a @tishman/components theme color mode (and optional base),
 * returns a new theme color mode with Docz-specific colors added.
 */
function generateDoczColorMode(
  colorMode: Partial<ColorMode>,
  base: TishmanColorMode,
): DoczColorMode;
function generateDoczColorMode(colorMode: TishmanColorMode): DoczColorMode;
function generateDoczColorMode(
  colorMode: Partial<ColorMode> | TishmanColorMode,
  base?: TishmanColorMode,
): DoczColorMode {
  const colors = mergeAll([{}, base, colorMode]);
  return merge(colors, {
    link: colors.muted,
    border: colors.muted,
    sidebar: {
      bg: colors.accent,
      navGroup: colors.muted,
      navLink: colors.muted,
      navLinkActive: colors.text,
      tocLink: colors.muted,
      tocLinkActive: colors.text,
    },
    header: {
      bg: colors.primary,
      text: colors.background,
      border: colors.muted,
      button: {
        bg: colors.background,
        color: colors.primary,
      },
    },
    props: {
      bg: colors.background,
      text: colors.text,
      highlight: colors.muted,
      defaultValue: colors.accent,
      descriptionText: colors.text,
      descriptionBg: colors.background,
    },
    playground: {
      bg: colors.background,
      border: colors.muted,
    },
    blockquote: {
      bg: colors.accent,
      border: colors.muted,
      color: colors.text,
    },
  });
}

/**
 * A custom Docz theme that uses
 * the @tishman/components default theme as its base.
 */
export const base = {
  ...mergeAll([{}, doczBase, tishmanBase]),
  // Generate a base Docz color mode from the @tishman/components theme base.
  colors: generateDoczColorMode(tishmanBase.colors),
  prismTheme: merge({}, doczBase.colors?.prism),
  fontWeights: tishmanBase.fontWeights,
  styles: mergeAll([
    {},
    doczBase.styles,
    tishmanBase.styles,
    // {
    //   a: {
    //     color: 'accentSecondary',
    //   },
    // },
  ]),
};

// Generate a Docz color theme for each of the @tishman/components themes.
export const themes = Object.entries(tishmanThemes).reduce(
  (themes: Record<string, Theme>, [key, theme]) => {
    themes[key] = mergeAll([
      {},
      theme,
      {
        colors: generateDoczColorMode(
          (theme as Theme).colors as Partial<ColorMode>,
          tishmanBase.colors,
        ),
      },
    ]);
    return themes;
  },
  {},
) as Record<keyof typeof tishmanThemes, Theme>;
