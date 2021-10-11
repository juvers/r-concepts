import * as FontFaces from '../fonts/FontFaces';
import * as colors from './colors';
import base from './base';

// eslint-disable-next-line @tishman/prefer-tishman-components
import type {ColorMode} from 'theme-ui';
import type {Theme} from 'styled-system';

/**
 * Tishman theme names follow the pattern `"<Attraction> [Variant]"`,
 * where `"<Attraction>"` refers to one of the primary Tishman properties, like
 * "Rockefeller Center", "Top of the Rock", "The Rink", and `"[Variant]"`
 * optionally refers to the dominant color or feature of the theme,
 * usually the theme's background color.
 */
export const themes = {
  'Rock Center': {
    colors: {...base.colors},
    fonts: {...base.fonts},
  },
  'Rock Center Black': {
    colors: {
      ...base.colors,
      text: colors.WHITE,
      textInverted: colors.BLACK,
      textDisabled: colors.CONCRETE,
      background: colors.BLACK,
      primary: colors.TUSSOCK,
      secondary: colors.WHITE,
      accent: colors.GOLD,
      accentSecondary: colors.CREAM,
      logo: colors.WHITE,
      pageName: colors.TUSSOCK,
      error: colors.RED,
      muted: colors.GRAY,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Green': {
    colors: {
      ...base.colors,
      text: colors.WHITE,
      textInverted: colors.GREEN,
      background: colors.GREEN,
      accent: colors.GOLD,
      accentSecondary: colors.TUSSOCK,
      logo: colors.WHITE,
      pageName: colors.WHITE,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Medium_Yellow': {
    colors: {
      ...base.colors,
      text: colors.BLACK,
      background: colors.MEDIUM_YELLOW,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Dark_Green': {
    colors: {
      ...base.colors,
      text: colors.WHITE,
      background: colors.DARK_GREEN,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Navy': {
    colors: {
      ...base.colors,
      text: colors.WHITE,
      textInverted: colors.NAVY,
      background: colors.NAVY,
      accentSecondary: colors.YELLOW,
      logo: colors.WHITE,
      pageName: colors.TUSSOCK,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Cream': {
    colors: {
      ...base.colors,
      text: colors.BLACK,
      background: colors.CREAM,
      pageName: colors.BLACK,
      accentSecondary: colors.YELLOW,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Lavender': {
    colors: {
      ...base.colors,
      text: colors.BLACK,
      background: colors.LAVENDER,
      pageName: colors.BLACK,
      accentSecondary: colors.ROMAN_COFFEE,
    },
    fonts: {...base.fonts},
  },
  'Rock Center Rust': {
    colors: {
      ...base.colors,
      background: colors.RUST,
      text: colors.WHITE,
    },
  },
  'The Rink': {
    colors: {
      ...base.colors,
      accent: colors.BLUE,
      accentSecondary: colors.TUSSOCK,
    },
    fonts: {...base.fonts},
  },
  'The Rink Navy': {
    colors: {
      ...base.colors,
      text: colors.WHITE,
      textInverted: colors.BLACK,
      background: colors.NAVY,
      primary: colors.WHITE,
      secondary: colors.WHITE,
      accent: colors.BLUE,
      accentSecondary: colors.TUSSOCK,
      logo: colors.WHITE,
    },
    fonts: {
      ...base.fonts,
      heading: String(FontFaces.CentraNo2Book),
    },
  },
  'The Rink Blue': {
    colors: {
      ...base.colors,
      background: colors.BLUE,
    },
    fonts: {...base.fonts},
  },
  'Top of the Rock': {
    colors: {
      ...base.colors,
      primary: colors.BLUE,
      accent: colors.BLUE,
      accentSecondary: colors.TUSSOCK,
    },
    fonts: {...base.fonts},
  },
  'Top of the Rock Yellow': {
    colors: {
      ...base.colors,
      background: colors.YELLOW,
    },
    fonts: {...base.fonts},
  },
  'Top of the Rock Blue': {
    colors: {
      ...base.colors,
      background: colors.BLUE,
      accent: colors.WHITE,
    },
    fonts: {...base.fonts},
  },
  'Top of the Rock Olive': {
    colors: {
      ...base.colors,
      background: colors.OLIVE,
      accent: colors.BLACK,
    },
    fonts: {...base.fonts},
  },
  'Top of the Rock Navy': {
    colors: {...base.colors},
    fonts: {...base.fonts},
  },
  'Top of the Rock Green': {
    colors: {...base.colors},
    fonts: {...base.fonts},
  },
} as const;

/**
 * Given a theme `name` (such as "Rock Center Black"), returns
 * the corresponding Tishman theme object, or an empty object
 * if no theme matching the given `name` can be found.
 */
export const getThemeByName = (name: TishmanThemeName): TishmanThemeConfig => {
  return themes[name];
};

/**
 * Given an arbitrarily deeply nested type `T`, returns a deeply writable,
 * partial, and widened type.
 *
 * - 'widened' means literal types are asserted as primitive types
 *   (i.e., `'#000000'` becomes `'string'`)
 * - 'writable' means `readonly` is removed from all fields
 * - 'partial' means all fields are made optional
 * - 'deep' means these transformations are applied recursively
 */
type DeepPartialWritableWidened<T> = T extends Record<string, unknown>
  ? {-readonly [P in keyof T]?: DeepPartialWritableWidened<T[P]>}
  : T extends ReadonlyArray<infer U>
  ? Array<DeepPartialWritableWidened<U>>
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

/** The variant definitions extracted from the Tishman theme object. */
type Variants = Omit<TishmanTheme, 'styles' | keyof Omit<Theme, 'buttons'>>;

/** The styles definitions extracted from the Tishman theme object. */
type Styles = Pick<TishmanTheme, 'styles'>;

type DotPaths<
  T extends Record<string, unknown>,
  Path extends string | undefined = undefined
> = Path extends string
  ? {
      [K in keyof T]: K extends string ? `${Path}.${K}` : never;
    }[keyof T]
  : keyof T;

// Path<T> and PathValue<T, P> borrowed from https://twitter.com/diegohaz/status/1309489079378219009

type PathImpl<T, K extends keyof T> = K extends string
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[K] extends Record<string, any>
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T[K] extends ArrayLike<any>
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type TishmanTheme = Omit<typeof base, 'useLocalStorage'>;
export type TishmanThemeConfig = DeepPartialWritableWidened<TishmanTheme>;
/** The Tishman theme scales, i.e., 'colors'. */
export type TishmanThemeScales = Omit<
  TishmanTheme,
  keyof Variants | keyof Styles
>;
export type TishmanScalePath = Path<TishmanThemeScales>;
export type TishmanScaleValue<P extends TishmanScalePath> = PathValue<
  TishmanThemeScales,
  P
>;
export type TishmanColorMode = ColorMode & TishmanTheme['colors'];
/** The name of a Tishman color to use. */
export type TishmanColorName = keyof Omit<TishmanTheme['colors'], 'modes'>;
/** The name of a Tishman theme to use. */
export type TishmanThemeName = keyof typeof themes;
/** A Tishman variant type, i.e., `'buttons'`. */
export type TishmanVariantType = keyof Variants;
/** A Tishman variant path, i.e., `'buttons.primary'`. */
export type TishmanVariantPath = {
  [K in keyof Variants]: DotPaths<Variants[K], K>;
}[keyof Variants];
/** A Tishman styles path, i.e., `'styles.h1'`. */
export type TishmanStylesPath = {
  [K in keyof Styles]: DotPaths<Styles[K], K>;
}[keyof Styles];
/** The name of a Tishman variant to use. */
export type TishmanVariant<
  K extends keyof Variants | undefined = undefined
> = K extends keyof Variants
  ? keyof Variants[K]
  : TishmanVariantPath | TishmanStylesPath;
