import {useLayoutEffect, useState} from 'react';
import {getDocument} from '@hzdg/dom-utils';

import type {RefCallback} from 'react';

interface BlockableElement extends HTMLElement {
  /**
   * A function that will unblock the blocked element and destroy itself.
   * This doubles as a unique identifier in the `useBlockedDocument`
   * layout effect to make sure that unblocking is only applied when
   * the blocking was done by the same instance of `useBlockedDocument`.
   */
  __UNBLOCK__?: () => void;
}

/**
 * We keep a map of elements to their original styles
 * so that multiple instances of `useBlockedDocument` don't
 * mistake existing blocked styles for the original styles.
 */
const originalStylesMap: WeakMap<
  BlockableElement,
  Partial<BlockableElement['style']>
> = new WeakMap();

/**
 * A cached measurement of the scrollbar width.
 *
 * We use this to prevent content from shifting in browsers
 * that don't have floating scrollbars when the scrollbar
 * is added or removed by showing or hiding overflow.
 */
let scrollbarWidth: string | undefined;

const setBlockedStyles = (element: BlockableElement) => {
  if (!originalStylesMap.has(element)) {
    originalStylesMap.set(element, {
      overflowX: element.style.overflowX,
      overflowY: element.style.overflowY,
      marginRight: element.style.marginRight,
      pointerEvents: element.style.pointerEvents,
      userSelect: element.style.userSelect,
      webkitUserSelect: element.style.webkitUserSelect,
    });
  }

  if (!scrollbarWidth) {
    const innerWidth = element.offsetWidth;
    element.style.overflowY = 'hidden';
    element.style.overflowX = 'hidden';
    scrollbarWidth = `${element.offsetWidth - innerWidth}px`;
  } else {
    element.style.overflowY = 'hidden';
    element.style.overflowX = 'hidden';
  }

  // We add a right margin equivalent to the width of the scrollbar
  // to prevent the content from shifting to fill the space that was
  // formerly occupied by the scrollbar.
  element.style.marginRight = scrollbarWidth;
  element.style.pointerEvents = 'none';
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
};

const restoreOriginalStyles = (element: BlockableElement) => {
  const originalStyles = originalStylesMap.get(element);
  if (originalStyles) Object.assign(element.style, originalStyles);
};

/**
 * `useBlockedDocument` will prevent scrolling, pointer events,
 * and text selection on the owner document of the element
 * that is passed to the returned ref callback, unless `blocked` is falsy.
 *
 * This is useful for building overlays where interactivity outside
 * of the overlay should be disabled while the overlay is visible.
 *
 * Note that `blocked` is falsy by default,
 * so pass a truthy value to enable blocking.
 *
 * @example
 *
 * function BlockedDocument() {
 *   const ref = useBlockedDocument(true);
 *   return <div ref={ref} />;
 * }
 */
export function useBlockedDocument<T extends Element = Element>(
  blocked = false,
): RefCallback<T> {
  const [element, setElement] = useState<T | null>(null);
  const blockableElement = getDocument(element)
    ?.documentElement as BlockableElement | null;
  useLayoutEffect(() => {
    if (blocked && blockableElement) {
      setBlockedStyles(blockableElement);
      return (blockableElement.__UNBLOCK__ = function unblock() {
        if (blockableElement.__UNBLOCK__ === unblock) {
          delete blockableElement.__UNBLOCK__;
          restoreOriginalStyles(blockableElement);
        }
      });
    }
  }, [blocked, blockableElement]);
  return setElement;
}
