/** @jsx jsx */
import {
  jsx,
  Section,
  useMergedRef,
  useMaxIntersection,
} from '@tishman/components';
import {forwardRef, useCallback} from 'react';

import type {Ref, ComponentPropsWithoutRef} from 'react';

export interface IntersectionSectionProps
  extends ComponentPropsWithoutRef<typeof Section>,
    IntersectionObserverInit {
  /** The id for this section. */
  id?: string;
  /**
   * A callback that is called when this section intersects the scrollport.
   *
   * It is passed the `id` for this section.
   */
  onIntersection?: (id?: string) => void;
}

const DEFAULT_THRESHOLD = Array.from(Array(11).keys(), (v) => v * 0.1);

/**
 * A `Section` that calls an `onIntersection` callback when it intersects
 * the `root` element.
 */
export const IntersectionSection = forwardRef(function IntersectionSection(
  {
    id,
    root,
    rootMargin,
    onIntersection,
    threshold = DEFAULT_THRESHOLD,
    ...props
  }: IntersectionSectionProps,
  forwardedRef: Ref<HTMLElement>,
) {
  // When this element intersects the root element with the
  // __highest intersection ratio__ compared to other elements
  // interescting the same root element, call the `onIntersection`
  // callback with the element `id`.
  const intersectionRef = useMaxIntersection(
    useCallback((entry) => onIntersection?.(entry.target.id), [onIntersection]),
    {threshold, rootMargin, root},
  );
  return (
    <Section
      ref={useMergedRef(forwardedRef, intersectionRef)}
      id={id}
      {...props}
    />
  );
});
