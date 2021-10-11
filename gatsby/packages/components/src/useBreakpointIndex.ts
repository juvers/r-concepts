import {useThemeUI} from '@tishman/components';
import {useState, useLayoutEffect, useEffect} from 'react';
import {getWindow} from '@hzdg/dom-utils';

export interface UseBreakpointIndexOptions {
  defaultIndex?: number;
  node?: Node | null;
}

/**
 * A hook to get the index of the currently active theme breakpoint.
 *
 * This is very similar to the hook defined by @theme-ui/match-media,
 * except it takes an optional reference node argument. This argument
 * lets the hook work in nested contexts (like iframes in docs).
 *
 * @see https://theme-ui.com/packages/match-media/
 */
export function useBreakpointIndex({
  node,
  defaultIndex = 0,
}: UseBreakpointIndexOptions = {}): number {
  const {
    theme: {breakpoints},
  } = useThemeUI();
  const [index, setIndex] = useState(defaultIndex);
  const [window, setWindow] = useState<Window | null>(() => getWindow(node));
  useLayoutEffect(() => setWindow(getWindow(node)), [node]);
  useEffect(() => {
    if (!window) return;
    const onResize = () => {
      const newValue = breakpoints.filter(
        (bp) => window.matchMedia(`screen and (min-width: ${bp})`).matches,
      ).length;
      if (index !== newValue) setIndex(newValue);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoints, index, window]);
  return index;
}
