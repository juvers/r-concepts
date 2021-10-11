import {useThemeUI, useBreakpointIndex} from '@tishman/components';

import type {
  TishmanTheme,
  UseBreakpointIndexOptions,
} from '@tishman/components';

type Values<T> = ((theme: TishmanTheme | null) => T[]) | T[];

/**
 * A hook to compute a responsive value based on the active theme breakpoint.
 *
 * This is very similar to the hook defined by @theme-ui/match-media,
 * except it takes an optional reference node argument. This argument
 * lets the hook work in nested contexts (like iframes in docs).
 *
 * @see https://theme-ui.com/packages/match-media/
 */
export function useResponsiveValue<T>(
  values: Values<T>,
  options?: UseBreakpointIndexOptions,
): T {
  const {theme} = useThemeUI();
  const array = typeof values === 'function' ? values(theme) : values;
  const index = useBreakpointIndex(options);
  return array[index >= array.length ? array.length - 1 : index];
}
