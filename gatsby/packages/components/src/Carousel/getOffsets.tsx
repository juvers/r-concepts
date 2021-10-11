import {getWindow} from '@hzdg/dom-utils';
import {getScrollOffsetForElement} from '~useScrollTo';

const getOffsetLeft = (
  element: HTMLElement | null,
  scrollElement: HTMLElement | null,
  scrollPaddingLeft: number,
): number =>
  Math.max(
    0,
    Math.round(
      (getScrollOffsetForElement(element, scrollElement)?.left ?? 0) -
        scrollPaddingLeft,
    ),
  );

const getStyleUnitless = (style?: string): (number | null)[] => {
  if (typeof style === 'string') {
    const styles = style.split(' ');
    return styles.map((s) => {
      try {
        const result = parseFloat(s);
        return isNaN(result) ? null : Math.round(result);
      } catch {
        /* boop! */
      }
      return null;
    });
  }
  return [null];
};

/**
 * Collect carousel item offsets relative to the `scrollport`,
 * and calculate page offsets based on `pageSize`.
 *
 * `pageSize` sets the number of items that should be included in a page.
 * If not set or not a positive number, then the number of items per page
 * will be one item per page, with the exception of the last page,
 * which will contain as many items as can fit within the scrollport.
 */
export const getOffsets = (
  scrollport: HTMLElement | null,
  pageSize?: number,
): {pageOffsets: number[]; itemOffsets: number[]} => {
  if (!scrollport) return {pageOffsets: [], itemOffsets: []};

  // We need to account for any scroll padding
  // that might effect the left offset values of the items,
  // so we will get the computed styles of the scrollport.
  const win = getWindow(scrollport);

  // Get the size of the gap between items.
  let [gap] = getStyleUnitless(
    win?.getComputedStyle(scrollport)?.getPropertyValue('column-gap'),
  );
  gap = gap ?? 0;

  // Get the size of the left scroll padding.
  let [scrollPaddingLeft] = getStyleUnitless(
    win?.getComputedStyle(scrollport, ':before')?.getPropertyValue('width'),
  );
  scrollPaddingLeft = gap + (scrollPaddingLeft ?? 0);

  // Get the size of the right scroll padding.
  let [scrollPaddingRight] = getStyleUnitless(
    win?.getComputedStyle(scrollport, ':after')?.getPropertyValue('width'),
  );
  // HACK: Add the left offset to compensate for the positioning
  // that may have added to the the element to force the right
  // overscroll padding to be visible in the scrollport.
  // See the `::after` element in `CarouselList` for more.
  const [scrollPaddingRightOffset] = getStyleUnitless(
    win?.getComputedStyle(scrollport, ':after')?.getPropertyValue('left'),
  );
  scrollPaddingRight =
    (scrollPaddingRight ?? 0) + (scrollPaddingRightOffset ?? 0);

  // We reverse the list of child nodes to make a simple stack.
  // The stack gives us a faster data structure than the array
  // when searching for optimal page sizes.
  const nodesToCheck = [...scrollport.childNodes].reverse();
  const nextPageOffsets = [];
  const nextItemOffsets = [];

  if (pageSize && pageSize > 0) {
    // If `pageSize` is positive, we just run through the
    // stack of nodes, creating pages containing `pageSize`
    // number of nodes until we run out of nodes to check.
    let currentPageSize = 0;
    let currentPageOffsetLeft = 0;
    while (nodesToCheck.length) {
      const node = nodesToCheck.pop() as HTMLElement;
      const offsetLeft = getOffsetLeft(node, scrollport, scrollPaddingLeft);
      nextItemOffsets.push(offsetLeft);
      if (currentPageSize === 0) currentPageOffsetLeft = offsetLeft;
      currentPageSize += 1;
      if (currentPageSize === pageSize || !nodesToCheck.length) {
        nextPageOffsets.push(currentPageOffsetLeft);
        currentPageSize = 0;
      }
    }
  } else {
    // If `pageSize` is not defined or not positive, we assume
    // we want one item per page, with the exception of the
    // last page, which will contain as many items as can fit
    // in the scrollport.
    const scrollWidth =
      scrollport.offsetWidth - scrollPaddingLeft - scrollPaddingRight;
    let lastPageWidth = 0;
    while (nodesToCheck.length) {
      const node = nodesToCheck.pop() as HTMLElement;
      const offsetLeft = getOffsetLeft(node, scrollport, scrollPaddingLeft);
      nextItemOffsets.push(offsetLeft);
      nextPageOffsets.push(offsetLeft);
      if (!nodesToCheck.length) lastPageWidth = Math.round(node.offsetWidth);
    }

    // Backtrack from the last page offset, removing page offsets
    // until we have accumulated enough items in the last remaining
    // page to fill the scrollport.
    if (nextPageOffsets.length > 1) {
      let cumulativePageWidth = 0;
      let prevPageOffset: number | null = null;
      do {
        const pageOffset = nextPageOffsets.pop() as number;
        const pageWidth = prevPageOffset
          ? prevPageOffset - pageOffset
          : lastPageWidth;
        cumulativePageWidth += pageWidth;
        if (cumulativePageWidth >= scrollWidth) {
          const overflow = cumulativePageWidth - scrollWidth;
          // We use 1 to give a litle wiggle room for rounding errors.
          if (overflow > 1) {
            nextPageOffsets.push(pageOffset);
          }
          nextPageOffsets.push(pageOffset + overflow + gap);
          break;
        }
        prevPageOffset = pageOffset;
      } while (nextPageOffsets.length);
    }
  }

  return {pageOffsets: nextPageOffsets, itemOffsets: nextItemOffsets};
};
