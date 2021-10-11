/** @jsx jsx */
import useIntersection from '@hzdg/use-intersection';
import {useEffect, useRef} from 'react';
import invariant from 'invariant';

import type {IntersectionHandler} from '@hzdg/use-intersection';

/** A symbol that represents the default intersction observer root. */
const DEFAULT_ROOT_SENTINEL = {};

/**
 * A map of target elements to their latest intersection observer entry
 * and associated callback for handling intersection.
 */
type IntersectionHeapEntries = Map<
  Element,
  [IntersectionObserverEntry, IntersectionHandler]
>;

/**
 * Sort an `IntersectionHeapEntries` map
 * by `intersectionRatio`, from largest to smallest.
 */
const sortEntries = (
  entries: IntersectionHeapEntries,
): IntersectionHeapEntries => {
  return new Map(
    [...entries].sort(
      ([, [a]], [, [b]]) => b.intersectionRatio - a.intersectionRatio,
    ),
  );
};

/**
 * Get the first entry in an `IntersectionHeapEntries` map.
 *
 * Note: this assumes the map has already been sorted via `sortEntries`.
 */
const getFirstEntry = (
  entries: IntersectionHeapEntries,
): IntersectionObserverEntry | undefined => {
  const top = entries.values().next();
  return top.done ? undefined : top.value[0];
};

/**
 * A heap of `IntersectionObserverEntry` objects,
 * where each object in the heap is unique by `target`,
 * and the top of the heap is the object with the highest `intersectionRatio`.
 */
class IntersectionHeap {
  private entries: IntersectionHeapEntries = new Map();
  private top?: IntersectionObserverEntry;
  toString() {
    return Array.from(this.entries.keys()).map(({id}) => id);
  }
  /** Search through the heap to find the top entry. */
  sift(): IntersectionObserverEntry | undefined {
    const currentTop = this.top;
    this.entries = sortEntries(this.entries);
    this.top = getFirstEntry(this.entries);
    if (this.top && this.top !== currentTop) {
      const heapEntry = this.entries.get(this.top.target);
      invariant(heapEntry, 'IntersectionHeap entry is unexpectedly missing!');
      const [entry, handler] = heapEntry;
      handler(entry);
    }
    return this.top;
  }
  /** Add the `entry`, or replace an entry with the same `target`. */
  add(entry: IntersectionObserverEntry, handler: IntersectionHandler): void {
    this.entries.set(entry.target, [entry, handler]);
    if (!this.top || this.top.intersectionRatio < entry.intersectionRatio) {
      this.top = entry;
      handler(entry);
    } else {
      this.sift();
    }
  }
  /** Delete the entry with the same `target` as the given `entry`. */
  delete(entry: IntersectionObserverEntry): void {
    this.entries.delete(entry.target);
    if (this.top?.target === entry.target) {
      this.sift();
    }
  }
}

/**
 * A map of `Element` roots to `IntersectionHeap` objects,
 * where the entries in each heap are unique by target element,
 * and the top entry in each heap has the highest `intersectionRatio`.
 */
const intersectionHeaps = new WeakMap<
  Element | typeof DEFAULT_ROOT_SENTINEL,
  IntersectionHeap
>();

/**
 * `useMaxIntersection` is a React hook for components that care about
 * when their intersection with a root element has the
 * __highest intersection ratio__ compared to other `useMaxIntersection`
 * elements that are also intersecting the same root.
 *
 * Returns a callback ref that should be passed to the observed element.
 */
export function useMaxIntersection(
  /**
   * `handler` will receive an `IntersectionObserverEntry` object
   * each time the observed element's intersection with the root element
   * has the __highest intersection ratio__ when compared to other elements
   * intersecting the same root.
   */
  handler: IntersectionHandler,
  /**
   * Optional configuration for the intersection observer.
   */
  config?: IntersectionObserverInit,
): (node: HTMLElement | null) => void {
  const root = config?.root ?? DEFAULT_ROOT_SENTINEL;
  const latestEntry = useRef<IntersectionObserverEntry | null>(null);
  useEffect(
    () => () => {
      // Clean up the latest entry that was inserted into the heap
      // whenever the `root` changes or on unmount.
      if (latestEntry.current) {
        intersectionHeaps.get(root)?.delete(latestEntry.current);
      }
    },
    [root],
  );
  return useIntersection((entry) => {
    const heap = intersectionHeaps.get(root) ?? new IntersectionHeap();
    intersectionHeaps.set(root, heap);
    if (entry.isIntersecting) {
      latestEntry.current = entry;
      heap.add(entry, handler);
    } else {
      latestEntry.current = null;
      heap.delete(entry);
    }
  }, config);
}
