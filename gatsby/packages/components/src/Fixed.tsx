/** @jsx jsx */
import {jsx, Box, useMergedRef} from '@tishman/components';
import {position as sxPosition} from 'styled-system';
import {forwardRef, useState, useMemo} from 'react';
import {useAutoPosition} from './useAutoPosition';

import type {Ref} from 'react';
import type {
  BoxProps,
  SxStyleProp,
  ResponsiveStyleValue,
} from '@tishman/components';
import type {Position} from './useAutoPosition';

type UseFixedPositionConfig = Omit<Position, 'position'>;

/**
 * `useFixedPosition` returns a tuple containing a computed position style
 * like `{top, right, bottom, left}` and a callback ref that should be
 * passed to a fixed element.
 *
 * The config properties `{top, right, bottom, left}` can be numbers,
 * pixel values, percentages, or `auto`. They may also be responsive arrays
 * of any of the same types.
 *
 * For any property that is configured `auto`, the computed position
 * will be calculated to offset the element from other elements
 * auto fixed or sticky to the same root element for the same property.
 */
export function useFixedPosition(
  config: UseFixedPositionConfig = {},
): [Position, (node: HTMLElement | null) => void] {
  /**
   * The fixed element, stored as state.
   *
   * The setter is returned as the second value from `useFixedPosition`,
   * effectively making it a callback ref that will update position state
   * whenever it receives a new value.
   */
  const [element, setElement] = useState<HTMLElement | null>(null);
  const {position, top, right, bottom, left} = useAutoPosition(element, {
    position: 'fixed',
    ...config,
  });
  return useMemo(() => {
    return [{position, top, right, bottom, left}, setElement];
  }, [position, top, right, bottom, left]);
}

export interface FixedProps extends BoxProps {
  top?: ResponsiveStyleValue<string | number>;
  right?: ResponsiveStyleValue<string | number>;
  bottom?: ResponsiveStyleValue<string | number>;
  left?: ResponsiveStyleValue<string | number>;
}

/**
 * Use the `Fixed` component to add fixed positioning to a Box.
 * @see https://tishman.netlify.app/components/layout#fixed
 */
export const Fixed = forwardRef(function Fixed(
  {children, sx, top, right, bottom, left, ...props}: FixedProps,
  forwardedRef: Ref<HTMLElement>,
): JSX.Element {
  const [position, positionRef] = useFixedPosition({top, right, bottom, left});
  const mergedRef = useMergedRef(forwardedRef, positionRef);
  return (
    <Box
      ref={mergedRef}
      sx={{zIndex: 'fixed', ...sx, ...(sxPosition(position) as SxStyleProp)}}
      {...props}
    >
      {children}
    </Box>
  );
});
