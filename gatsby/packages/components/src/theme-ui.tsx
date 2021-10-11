/** @jsx jsx */
import invariant from 'invariant';
import {
  get as themeUIGet,
  ThemeProvider as ThemeUIThemeProvider,
  useThemeUI as ThemeUIuseThemeUI,
} from 'theme-ui';

/**
 * This module exports some ThemeUI types and utilities
 * for use from @tishman/components.
 *
 * In general, any components, utilities, or types that we want to use
 * in theme-ui should be first added to @tishman/components and then used
 * from there. For example, instead of using `jsx` from theme-ui:
 *
 *   import {jsx} from 'theme-ui';
 *
 * use:
 *
 *   import {jsx} from '@tishman/components';
 *
 * This module is the place to add those things (like `jsx`) that aren't
 * components, but that we want to use from `theme-ui`.
 */

import type {
  ForwardRefExoticComponent,
  ComponentProps,
  ComponentPropsWithRef,
  FunctionComponent,
  ElementType,
} from 'react';
import type {
  TishmanStylesPath,
  TishmanTheme,
  TishmanThemeConfig,
  TishmanScalePath,
  TishmanScaleValue,
  TishmanVariant,
  TishmanVariantPath,
  TishmanVariantType,
} from '~themes';
import type {InterpolationWithTheme} from '@emotion/core';
import type {SpaceProps} from 'styled-system';
import type * as ThemeUI from 'theme-ui';

type Assign<T, U> = {
  [P in keyof (T & U)]: P extends keyof T
    ? T[P]
    : P extends keyof U
    ? U[P]
    : never;
};

type ThemeUIComponentOwnProps<
  VariantType extends TishmanVariantType | undefined = undefined
> = Assign<
  Omit<ThemeUI.BoxOwnProps, 'as' | 'css' | 'ref' | 'sx' | 'variant'>,
  {
    variant?: TishmanVariant<VariantType>;
    sx?: SxStyleProp<VariantType>;
    css?: InterpolationWithTheme<TishmanTheme>;
  }
>;

/**
 * A utility for typing a Tishman component's props for use
 * as a ThemeUI component.
 *
 * The returned type will include props for the `variant`, `sx`, `ref`,
 * and other props supported by the inner element.
 *
 * The generic signature is:
 * ```ThemeUIComponentProps<VariantType, ElementType, OwnProps>```
 *
 * - `VariantType` is one of the defined Tishman variant _types_
 *   (e.g., `'forms'`, `'buttons'`)
 * - `ElementType` is one of the intrinsic element types
 *   (e.g., `'div'`, `'input'`)i
 * - `OwnProps` is an optional object type for additional props
 *   that are specific to the component.
 *
 * @example
 *
 * type SelectProps = ThemeUIComponentProps<
 *   'forms',
 *   'select',
 *   // Additional prop types specific to this component go here
 *   {text: string;},
 * >;
 *
 * // Make sure your component forwards any provided `ref`!
 * const Select = forwardRef(
 *   (
 *     // Be sure to destructure this component's own props
 *     // before passing the props to the underlying element!
 *     {text, ...props}: SelectProps,
 *     ref: SelectProps['ref']
 *   ) => (
 *     <label>
 *       {text}
 *       <select ref={ref} {...props} />
 *     </label>
 *   )
 * )
 */
export type ThemeUIComponentProps<
  VariantType extends TishmanVariantType | undefined = undefined,
  As extends ElementType = 'div',
  OwnProps = undefined
> = OwnProps extends undefined
  ? Assign<
      Omit<ComponentPropsWithRef<As>, keyof ThemeUIComponentOwnProps>,
      ThemeUIComponentOwnProps<VariantType>
    >
  : Assign<
      Omit<ComponentPropsWithRef<As>, keyof ThemeUIComponentOwnProps>,
      ThemeUIComponentOwnProps<VariantType>
    > &
      Omit<OwnProps, keyof ThemeUIComponentOwnProps>;

/**
 * A utility for typing a ThemeUI Component for use as a Tishman component.
 *
 * The returned type will include typings for the `variant`, `sx`,
 * and additional props that can be forwarded to the `ElementType`.
 *
 * @example
 * export const Divider = ThemeUIDivider as ThemeUIComponent<'layout', 'hr'>;
 */
export type ThemeUIComponent<
  VariantType extends TishmanVariantType | undefined = undefined,
  As extends ElementType = 'div',
  OwnProps = undefined
> = ForwardRefExoticComponent<ThemeUIComponentProps<VariantType, As, OwnProps>>;

export type SxStyleProp<
  VariantType extends TishmanVariantType | undefined = undefined
> =
  | TishmanCSSObject<VariantType>
  | ((theme: ThemeUI.Theme) => TishmanCSSObject<VariantType>);

export interface TishmanCSSObject<
  VariantType extends TishmanVariantType | undefined = undefined
> extends Omit<ThemeUI.ThemeUICSSObject, 'variant'> {
  variant?:
    | TishmanVariant<VariantType>
    | TishmanVariantPath
    | TishmanStylesPath;
}

export type ResponsiveStyleValue<T> = ThemeUI.ResponsiveStyleValue<T>;

export type Theme = ThemeUI.Theme;
interface TishmanThemeContextValue extends Omit<ThemeUI.ContextValue, 'theme'> {
  theme: TishmanTheme;
}

interface TishmanThemeProviderProps
  extends Omit<ComponentProps<typeof ThemeUI.ThemeProvider>, 'theme'> {
  theme:
    | TishmanThemeConfig
    | ((outerTheme: TishmanTheme) => TishmanThemeConfig);
}

export const getProps = (fn: (str: string) => boolean) => (
  props: Record<string, unknown>,
): Record<string, unknown> => {
  const next: Record<string, unknown> = {};
  for (const key in props) {
    if (fn(key || '')) next[key] = props[key];
  }
  return next;
};

const MRE = /^m[trblxy]?$/;

export const getMargin = getProps((k) => MRE.test(k)) as <T extends SpaceProps>(
  props: T,
) => Pick<T, 'mt' | 'mr' | 'mb' | 'ml' | 'mx' | 'my'>;

export const omitMargin = getProps((k) => !MRE.test(k)) as <
  T extends SpaceProps
>(
  props: T,
) => Omit<T, 'mt' | 'mr' | 'mb' | 'ml' | 'mx' | 'my'>;

export const ThemeProvider = (ThemeUIThemeProvider as unknown) as FunctionComponent<TishmanThemeProviderProps>;

export const useThemeUI = (ThemeUIuseThemeUI as unknown) as () => TishmanThemeContextValue;

export const get = themeUIGet as <P extends TishmanScalePath>(
  obj: Theme | TishmanTheme,
  path: P,
) => TishmanScaleValue<P>;

const isTishmanTheme = (theme: unknown): theme is TishmanTheme => true;

function assertTishmanTheme(theme: unknown): asserts theme is TishmanTheme {
  invariant(isTishmanTheme(theme), 'Expected Tishman theme');
}

/**
 * A simple wrapper around ThemeUI function values that
 * asserts the theme type as a `TishmanTheme`.
 *
 * This is useful for working with ThemeUI functional values.
 *
 * @see https://theme-ui.com/sx-prop/#functional-values
 *
 * @example
 * <Box sx={{bg: calc((theme) => theme.colors.primary}} />
 */
export function calc<
  VariantType extends TishmanVariantType | undefined = undefined,
  ReturnValue =
    | ResponsiveStyleValue<string | number>
    | TishmanCSSObject<VariantType>
    | undefined
>(fn: (theme: TishmanTheme) => ReturnValue) {
  return (theme: Theme): ReturnValue => {
    assertTishmanTheme(theme);
    return fn(theme);
  };
}

export {jsx, css, Styled} from 'theme-ui';
