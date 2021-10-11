/** @jsx jsx */
import {jsx} from '@tishman/components';
import {memo, useMemo} from 'react';
import useIntersection from '@hzdg/use-intersection';

export interface ScrollSentinelProps {
  /**
   * How far from the bottom of the scrollport to activate the sentinel,
   * where `0` means right at the bottom edge, and `1` means the top edge.
   */
  threshold?: number;
  /**
   * A callback that is called with an `active` boolean whenever
   * the sentinel changes state.
   */
  onChange?: (active: boolean) => void;
}

/**
 * An invisible div that calls an `onChange` callback when
 * its position has been scrolled beyond a given `threshold`
 * with respect to the scrollport.
 *
 * The `threshold` prop defines how far from the bottom of the scrollport
 * to activate the sentinel, where `0` means the bottom edge,
 * and `1` means the top edge.
 */
export const ScrollSentinel = memo(function ScrollSentinel({
  onChange,
  threshold = 0,
}: ScrollSentinelProps): JSX.Element {
  const rootMargin = useMemo(
    () => `${threshold * 100}% 0px ${1 - threshold * 100}% 0px`,
    [threshold],
  );
  const intersectionRef = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      onChange?.(isIntersecting || (rootBounds?.top ?? 0) >= rect.top);
    },
    {rootMargin},
  );
  return <div ref={intersectionRef} />;
});
