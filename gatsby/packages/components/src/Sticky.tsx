/** @jsx jsx */
import {jsx, Box, useMergedRef, useBreakpointIndex} from '@tishman/components';
import {
  forwardRef,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';
import {position as sxPosition} from 'styled-system';
import useIntersection from '@hzdg/use-intersection';
import {getNearestScrollNode} from '@hzdg/dom-utils';
import {useAutoPosition} from './useAutoPosition';

import type {Ref, RefObject, MutableRefObject} from 'react';
import type {
  BoxProps,
  ResponsiveStyleValue,
  SxStyleProp,
} from '@tishman/components';
import type {Position} from './useAutoPosition';

const getResponsiveValue = <T,>(array: T[], breakpoint: number): T => {
  if (breakpoint > array.length) return array[array.length - 1];
  let result = array[breakpoint];
  while (result === null && ++breakpoint < array.length - 1) {
    result = array[breakpoint];
  }
  return result;
};

const splitLengthFromUnit = (length?: number | string): [number, string] => {
  if (typeof length === 'number') return [length, 'px'];
  const value = typeof length === 'string' ? parseFloat(length) : 0;
  const unit = length?.endsWith?.('%') ? '%' : 'px';
  return [value, unit];
};

const getRootMarginValue = (
  pos: ResponsiveStyleValue<string | number> | null | undefined,
  breakpoint: number,
  initialOffset = 0,
) => {
  const [value, unit] = Array.isArray(pos)
    ? splitLengthFromUnit(getResponsiveValue(pos, breakpoint) ?? initialOffset)
    : splitLengthFromUnit(pos ?? initialOffset);
  return `${-value + initialOffset}${unit}`;
};

/**
 * `useStickyPosition` returns a tuple containing a computed sticky state
 * and style like `{sticky: false, position: {top, right, bottom, left}}`,
 * and a callback ref that should be passed to a sticky element.
 *
 * The sticky state will be `true` when the element is fixed
 * to the viewport, and `false` when the element is inline or
 * fixed to the bottom of its containing element.
 *
 * The config properties `{top, right, bottom, left}` can be numbers,
 * pixel values, percentages, or `auto`. They may also be responsive arrays
 * of any of the same types.
 *
 * For any property that is configured `auto`, the computed position
 * will be calculated to offset the element from other elements
 * auto fixed or sticky to the same root element for the same property.
 */
export function useStickyPosition({
  position = 'sticky',
  ...config
}: Position = {}): [
  {sticky: boolean; position: Position},
  (node: HTMLElement | null) => void,
] {
  const disabled = position !== 'sticky';
  /**
   * The sticky element, stored as state.
   *
   * The setter is returned as the second value from `useStickyPosition`,
   * effectively making it a callback ref that will update position state
   * whenever it receives a new value.
   */
  const [element, setElement] = useState<HTMLElement | null>(null);
  /** The current matching breakpoint as defined in `theme.breakpoints`. */
  const breakpoint = useBreakpointIndex({node: element});
  /** The element to measure intersection against. */
  const scrollport = useMemo(() => getNearestScrollNode(element), [element]);

  /** The current position state, as computed by the position store. */
  const {top, right, bottom, left} = useAutoPosition(element, {
    position,
    ...config,
  });

  /**
   * A boolean `sticky` state that is updated whenever the position
   * of the element switches between fixed and another position.
   *
   * This is returned with the first value from `useStickyPosition`.
   */
  const [sticky, setSticky] = useState(false);

  /**
   * An enumerated position ref that can be one of three values:
   *   - `inline`: the element is in the flow of its container
   *   - `fixed`: the element is positioned relative to the root
   *   - `absolute`: the element is positioned relative to its container
   *
   * These correspond to the three possible *effective* states
   * of a `position: sticky` element:
   *   - Before an element becomes sticky, it is `inline`
   *   - When an element becomes sticky, it is `fixed`
   *   - When a sticky element meets its container's edge, it is `absolute`.
   *
   * Note that we assume the intial position is `inline`, though we don't
   * have a reliable way to know this for sure, since there is no native
   * support for detecting whether or not a sticky element is sticky.
   */
  const effectivePosition: RefObject<'inline' | 'fixed' | 'absolute'> = useRef(
    'inline',
  );

  /**
   * We wrap updates to `position` in a setter so that we can
   * compute a new sticky state when the value changes.
   */
  const setPosition = useCallback(
    (next: 'inline' | 'fixed' | 'absolute') => {
      if (next !== effectivePosition.current) {
        (effectivePosition as MutableRefObject<typeof next>).current = next;
        setSticky(disabled ? false : next === 'fixed');
      }
    },
    [disabled],
  );

  useEffect(() => {
    if (disabled) setPosition('inline');
  }, [disabled, setPosition]);

  /**
   * This root margin is used to observe intersection betweeen
   * the sticky element and the root element such that when
   * the sticky element is completely intersecting the root margins,
   * it can be assumed that the element is not fixed to the root element.
   */
  const fixedRootMargin = useMemo(() => {
    // Special case; we just care about hitting the top of the root.
    if (top != null && bottom == null && left == null && right == null) {
      const topValue = getRootMarginValue(top, breakpoint);
      if (topValue === '0px') return `${topValue} 0px -100% 0px`;
    }
    return [
      getRootMarginValue(top, breakpoint, -1),
      getRootMarginValue(right, breakpoint, -1),
      getRootMarginValue(bottom, breakpoint, -1),
      getRootMarginValue(left, breakpoint, -1),
    ].join(' ');
  }, [breakpoint, bottom, left, right, top]);

  /**
   * Observe intersection between the sticky element and the root element
   * _plus_ any position offset applied to the sticky element.
   *
   * Here, we determine whether or not the element is positioned by comparing
   * the interesction rect to the root bounds. If the rects don't
   * match (for the bounds that have position values), It may mean the element
   * is fixed relative to the root, or it may be absolute relative
   * to its containing element; we won't know for sure until
   * the second intersection observer updates.
   *
   * We assume that if it is positioned at all, it is most likely fixed,
   * and rely on the second intersection observer to refine the position
   * state for the case where it is actually positioned absolute.
   */
  useIntersection(
    ({
      isIntersecting,
      intersectionRatio: ratio,
      boundingClientRect: client,
      intersectionRect: rect,
    }) => {
      if (disabled) return;
      if (!isIntersecting) return setPosition('inline');
      // Special case: If `isInterescting` is `true`, but the ratio is `0`,
      // This means we only care about if the element hit the edge of the root
      // (i.e., the sticky element is positioned like `top: 0px`).
      if (ratio === 0) {
        setPosition('fixed');
      } else {
        const positioned =
          (top != null && client.top !== rect.top) ||
          (bottom != null && client.bottom !== rect.bottom) ||
          (left != null && client.left !== rect.left) ||
          (right != null && client.right !== rect.right);
        setPosition(positioned ? 'fixed' : 'inline');
      }
    },
    {
      // if the scrollport doesn't have a parent element, it must be
      // the root element, so we don't need to specify a root here.
      root: scrollport?.parentElement ? scrollport : null,
      rootMargin: fixedRootMargin,
      threshold: [0, 1],
    },
  )(element);

  /**
   * This root margin is used to observe intersection betweeen
   * the sticky element and the root element such that when
   * the sticky element is completely intersecting the root margin,
   * it can be assumed that the element is either positioned absolutely
   * within its sticky container, or static,
   */
  const absoluteRootMargin = useMemo(() => {
    return [
      getRootMarginValue(top, breakpoint),
      getRootMarginValue(right, breakpoint),
      getRootMarginValue(bottom, breakpoint),
      getRootMarginValue(left, breakpoint),
    ].join(' ');
  }, [breakpoint, bottom, left, right, top]);

  /**
   * Observe intersection between the sticky element and the root element
   * to determine if the element is absolutely positioned to the trailing edge
   * of its containing element.
   *
   * If the first interesction observer (above) determined that the
   * element is fixed rather than inline, but we _don't_ detect
   * 100% interesction here, then we know that the element must be
   * positioned absolute, relative to its container, and is being
   * pushed out of the root bounds by the trailing edge of the container.
   *
   * Conversely, if the first intersction observer has not determined
   * that the position is inline, but we _do_ detect 100% intersction here,
   * it must mean that the element is fixed (no longer absolute).
   */
  useIntersection(
    ({intersectionRatio: ratio}) => {
      if (disabled) return;
      if (effectivePosition.current === 'fixed' && ratio !== 1) {
        setPosition('absolute');
      } else if (effectivePosition.current !== 'inline' && ratio === 1) {
        setPosition('fixed');
      }
    },
    {root: scrollport, rootMargin: absoluteRootMargin, threshold: [0, 1]},
  )(element);

  return useMemo(() => {
    return [
      {sticky, position: {position, top, right, bottom, left}},
      setElement,
    ];
  }, [bottom, left, position, right, sticky, top]);
}

export interface StickyProps extends Omit<BoxProps, 'onChange'> {
  /** Set this to `true` to disable sticky behavior. */
  disabled?: boolean;
  /** A class to apply when this element is sticky. */
  stickyClassName?: string;
  /** Inline styles for when this element is sticky. */
  stickyStyle?: Record<string, unknown>;
  top?: ResponsiveStyleValue<string | number>;
  right?: ResponsiveStyleValue<string | number>;
  bottom?: ResponsiveStyleValue<string | number>;
  left?: ResponsiveStyleValue<string | number>;
  /** An optional callback for reacting to sticky state changes. */
  onChange?: (stuck: boolean) => void;
}

const StickyContext = createContext(false);

/** A hook to get a boolean `sticky` state from within a `Sticky` container. */
export const useStickyState = (): boolean => useContext(StickyContext);

/**
 * Use the `Sticky` component to add sticky positioning to a Box.
 * @see https://tishman.netlify.app/components/layout#sticky
 */
export const Sticky = forwardRef(function Sticky(
  {
    disabled,
    sx,
    className,
    style,
    stickyStyle,
    stickyClassName = 'sticky',
    children,
    top,
    right,
    bottom,
    left,
    onChange,
    ...props
  }: StickyProps,
  forwardedRef: Ref<HTMLElement>,
): JSX.Element {
  const [{sticky, position}, bindToStickyState] = useStickyPosition({
    position: disabled ? 'static' : 'sticky',
    top,
    right,
    bottom,
    left,
  });
  const mergedRef = useMergedRef(forwardedRef, bindToStickyState);
  const cb = useRef(onChange);
  cb.current = onChange;
  useMemo(() => cb.current?.(sticky), [sticky]);
  return (
    <Box
      ref={mergedRef}
      sx={{
        zIndex: disabled ? 'initial' : 'fixed',
        ...sx,
        ...(sxPosition(position) as SxStyleProp),
      }}
      className={
        sticky && stickyClassName
          ? (className?.split(' ') || [])
              .concat(stickyClassName)
              .filter(Boolean)
              .join(` `)
          : className
      }
      style={sticky && stickyStyle ? {...style, ...stickyStyle} : style}
      {...props}
    >
      <StickyContext.Provider value={sticky}>{children}</StickyContext.Provider>
    </Box>
  );
});
