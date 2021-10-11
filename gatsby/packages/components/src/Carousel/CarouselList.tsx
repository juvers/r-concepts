/** @jsx jsx */
import {Children, useCallback, useEffect, useRef, useState} from 'react';
import {jsx, Grid, Box, useThemeUI} from '@tishman/components';
import {system, get} from 'styled-system';
import {useScrollPosition} from '@hzdg/scroll-monitor';
import {FocusScope} from '@hzdg/focus-scope';
import useSize from '@hzdg/use-size';
import {useCarouselContext} from './CarouselContext';
import {getClosestPage} from './getClosestPage';
import {getOffsets} from './getOffsets';
import {useScrollTo} from '~useScrollTo';

import type {MaxWidthProps, GridAutoColumnsProps} from 'styled-system';
import type {GridProps, SxStyleProp, TishmanTheme} from '@tishman/components';
import type {ReactNode, ReactElement, ComponentProps} from 'react';
import type {FocusManager} from '@hzdg/focus-scope';

/** Get the id of the carousel item rendered at the given `index`. */
const getCarouselItemId = (child: ReactNode, index: number): string =>
  String((child as ReactElement).key ?? `carousel-item-${index}`);

/** Get the index of the carousel item with the given `id`. */
const getCarouselItemIndex = (id: string | null): number =>
  parseInt(id?.split('-').pop() ?? '-1', 10);

const isNumber = (n: unknown) => typeof n === 'number' && !isNaN(n);
const px = (n: number | string) => (isNumber(n) ? `${n}px` : n);

/**
 * A styled-system function that renders custom css properties
 * with responsive breakpoints for a carousel.
 *
 * The custom properties rendered include:
 *  - `--gap`, which corresponds to the `gap` `CarouselList` prop.
 *  - `--gap-start`, which corresponds to the `gapStart` `CarouselList` prop.
 *  - `--gap-end`, which corresponds to the `gapEnd` `CarouselList` prop.
 *  - `--auto-size`, which corresponds to the `autoSize` `CarouselList` prop.
 *  - `--max-width` which corresponds to the `maxWidth` `CarouselList` prop.
 */
const customCarouselProperties: (
  config: {
    theme: TishmanTheme;
  } & Pick<
    CarouselListProps,
    'gap' | 'gapStart' | 'gapEnd' | 'autoSize' | 'maxWidth'
  >,
) => SxStyleProp = system({
  gap: {
    property: '--gap' as 'columnGap',
    scale: 'space',
    defaultScale: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    transform: (n, scale) => px(isNumber(n) ? get(scale, n, n) : n),
  },
  gapStart: {
    property: '--gap-start' as 'columnGap',
    scale: 'space',
    defaultScale: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    transform: (n, scale) => px(isNumber(n) ? get(scale, n, n) : n),
  },
  gapEnd: {
    property: '--gap-end' as 'columnGap',
    scale: 'space',
    defaultScale: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    transform: (n, scale) => px(isNumber(n) ? get(scale, n, n) : n),
  },
  autoSize: {
    property: '--auto-size' as 'gridAutoColumns',
    scale: 'sizes',
    transform: (n, scale) => (n === 'auto' ? undefined : px(get(scale, n, n))),
  },
  maxWidth: {
    property: '--max-width' as 'maxWidth',
    scale: 'sizes',
    transform: (n, scale) => (n === 'auto' ? undefined : px(get(scale, n, n))),
  },
});

export interface CarouselListProps extends ComponentProps<typeof Grid> {
  children: ReactNode;
  /**
   * An optional name for the carousel.
   * Default is `'Carousel'`.
   */
  name?: string;
  /**
   * Optional max width for the carousel. If defined, then when
   * the carousel is in a container that is larger than `maxWidth`,
   * carousel items will snap to the left edge of the `maxWidth`
   * instead of the left edge of the container.
   */
  maxWidth?: MaxWidthProps['maxWidth'];
  /**
   * Optional size constraint to apply to each item.
   * Defaults to `'max-content'`.
   *
   * Note that this works like the CSS property `grid-auto-columns`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns
   */
  autoSize?: GridAutoColumnsProps['gridAutoColumns'];
  /**
   * Optional gap between the items. Defaults to `theme.space[4]`.
   *
   * Note that this works like the CSS property `column-gap`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap
   */
  gap?: GridProps['gap'];
  /** Optional gap before the first item. Defaults to `gap`. */
  gapStart?: GridProps['gap'];
  /** Optional gap after the last item. Defaults to `gap`. */
  gapEnd?: GridProps['gap'];
  /**
   * Sets the snap position for items within the carousel.
   *
   * Defaults to `'start'`, and may be one or a comma-delimited list of two of
   *`'none'`, `'start'`, `'end'`, `'center'`.
   *
   * Note that this is the CSS property `scroll-snap-align`,
   * and it is applied to all items in the carousel.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align
   */
  scrollSnapAlign?: 'none' | 'start' | 'end' | 'center';
  /**
   * Sets the number of items that should be included in a page.
   *
   * If not set or not a positive number, then the number of items
   * per page will be one item per page, with the exception
   * of the last page, which will contain as many items as can fit
   * within the scrollport.
   *
   * Note that `pageSize` does not change the snapping behavior,
   * which always prefers snapping to individual items, but it does
   * change _pagination_ behavior, such as navigating with arrow keys,
   * `CarouselNavigation` components, or methods from `useCarouselContext`.
   */
  pageSize?: number;
  /** The initial page to start on. */
  initialPage?: number;
}

/**
 * `CarouselList` will render its children in a scrollable horizontal row,
 * snapping to the child nearest to the left side of the container.
 * It will also synchronize its scroll position with state from the
 * nearest `CarouselContextProvider`, and update scroll position
 * on focus changes within its children.
 *
 * @see CarouselContextProvider
 * @see CarouselNavigation
 * @see Carousel
 * @see https://tishman.netlify.app/components/carousel
 *
 */
export function CarouselList({
  __debug,
  children,
  pageSize,
  initialPage,
  maxWidth,
  gap = 4,
  gapStart = gap,
  gapEnd = gap,
  autoSize = 'max-content',
  scrollSnapAlign = 'start',
  name = 'Carousel',
  sx,
  ...props
}: CarouselListProps & {__debug?: boolean}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState(() =>
    getOffsets(ref.current, pageSize),
  );
  const {page, goto, setGoto, setPage, setPages} = useCarouselContext();
  const scrollTo = useScrollTo({domTarget: ref, behavior: 'smooth'});
  const {theme} = useThemeUI();
  const initialized = useRef<boolean>(false);

  /**
   * On Tab, update focus and scroll to the card that has focus.
   * On arrows left or right, scroll to the previous or next page of items.
   */
  const handleKeyPress = useCallback(
    (event: KeyboardEvent, focusManager: FocusManager) => {
      switch (event.key) {
        case 'Tab': {
          if (event.defaultPrevented) return;
          // Treat tab key presses as advancing focus to the next
          // (or previous, with shift) focusable element, and scroll to
          // the card that has focus.
          if (event.shiftKey) {
            const element = focusManager.focusPrevious({preventScroll: true});
            if (element) {
              if (!event.defaultPrevented) event.preventDefault();
              const manager = focusManager.findClosestManager(element);
              if (manager) {
                scrollTo({
                  left:
                    offsets.itemOffsets[getCarouselItemIndex(manager.id)] ?? 0,
                });
              }
            }
          } else {
            const element = focusManager.focusNext({preventScroll: true});
            if (element) {
              if (!event.defaultPrevented) event.preventDefault();
              const manager = focusManager.findClosestManager(element);
              if (manager) {
                scrollTo({
                  left:
                    offsets.itemOffsets[getCarouselItemIndex(manager.id)] ?? 0,
                });
              }
            }
          }
          break;
        }
        case 'ArrowRight': {
          // Treat right arrow presses as moving to the next page.
          event.preventDefault();
          goto.next();
          break;
        }
        case 'ArrowLeft': {
          // Treat left arrow presses as moving to the previous page.
          event.preventDefault();
          goto.previous();
          break;
        }
      }
    },
    [goto, scrollTo, offsets],
  );

  /** Update offsets whenever `pageSize` changes. */
  useEffect(() => {
    if (ref.current) {
      const nextOffsets = getOffsets(ref.current, pageSize);
      setOffsets(nextOffsets);
      setPages(nextOffsets.pageOffsets.length);
    }
  }, [pageSize, setPages]);

  /**
   * Force a scroll position change to attempt to keep the nearest
   * page aligned whenever `offsets` change or when `initialPage` is defined.
   */
  useEffect(() => {
    if (ref.current && offsets.pageOffsets.length) {
      if (!initialized.current && initialPage) {
        initialized.current = true;
        ref.current.scrollTo({
          left: offsets.pageOffsets[initialPage] ?? 0,
          behavior: 'auto',
        });
      } else if (ref.current.scrollLeft) {
        ref.current.scrollTo({
          left:
            offsets.pageOffsets[
              getClosestPage(ref.current.scrollLeft, offsets.pageOffsets)
            ] ?? 0,
          behavior: 'auto',
        });
      }
    }
  }, [initialPage, offsets]);

  /**
   * Replace the default `goto` method on `CarouselState` with `scrollTo`.
   *
   * This is coupled with the scroll position effect below to allow
   * scroll position to become the source of truth for page state.
   */
  useEffect(
    () =>
      setGoto((index: number) => {
        // Use `scrollTo` as the new `goto`, so other components using
        // this context will update scroll position when using `goto`
        // instead of updating the page state directly.
        scrollTo({left: offsets.pageOffsets[index] ?? 0});
      }),
    [setGoto, offsets, scrollTo],
  );

  /**
   * Synchronize page state in the Carousel context with
   * `CarouselList` scroll position.
   *
   * This is coupled with the 'setGoto' effect above to allow
   * scroll position to become the source of truth for page state.
   */
  useScrollPosition(ref, ({left}) => {
    setPage(getClosestPage(left ?? 0, offsets.pageOffsets, page));
  });

  /**
   * Update the page count and offsets
   * whenever the `CarouselList` size changes.
   */
  useSize(ref, () => {
    if (ref.current) {
      const nextOffsets = getOffsets(ref.current, pageSize);
      setOffsets(nextOffsets);
      setPages(nextOffsets.pageOffsets.length);
    }
  });

  const count = Children.count(children);

  return (
    <FocusScope
      as={Box}
      onKeyPress={handleKeyPress}
      sx={{
        width: '100%',
        position: 'relative',
        ...customCarouselProperties({
          theme,
          gap,
          gapStart,
          gapEnd,
          autoSize,
          maxWidth,
        }),
        '--count': count,
        '--scroll-margin': 'calc(50% - var(--max-width, 100%) / 2)',
        '--scroll-padding-left': `max(
          var(--gap-start, 0px),
          var(--gap-start, 0px) + var(--scroll-margin)
        )`,
        '--scroll-padding-right': `max(
          var(--gap-end, 0px),
          var(--gap-end, 0px) + var(--scroll-margin)
        )`,
      }}
    >
      <Grid
        as="ul"
        ref={ref}
        role="region"
        aria-label={name}
        tabIndex={0}
        sx={{
          ...sx,
          position: 'relative',
          gridAutoFlow: 'column',
          columnGap: 'var(--gap)',
          overflowX: 'scroll',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
          scrollPaddingLeft: 'var(--scroll-padding-left)',
          // We make a grid template that includes overscroll items
          // as the first and last items in the grid.
          gridTemplateColumns: `
            calc(var(--scroll-padding-left) - var(--gap))
            repeat(var(--count), var(--auto-size))
            calc(var(--scroll-padding-right) - var(--gap))
          `,
          '::before': {
            // We add a pseudo-element before the carousel items
            // to add overscroll padding equivalent to the
            // left scroll padding.
            // See `--scroll-padding-left` on the `FocusScope` for more.
            scrollSnapAlign,
            content: '""',
            pointerEvents: 'none',
            ...(process.env.NODE_ENV !== 'production' && __debug
              ? {bg: 'pink', opacity: 0.1}
              : {}),
          },
          '::after': {
            // We add a pseudo-element after the carousel items
            // to add overscroll padding equivalent to the
            // right scroll padding.
            // See `--scroll-padding-right` on the `FocusScope` for more.
            scrollSnapAlign,
            content: '""',
            pointerEvents: 'none',
            ...(process.env.NODE_ENV !== 'production' && __debug
              ? {bg: 'pink', opacity: 0.1}
              : {}),
            // HACK: We position this element and add 1px of space to force
            // the right overscroll padding to be visible in the scrollport.
            // See https://www.brunildo.org/test/overscrollback.html
            position: 'relative',
            top: 0,
            bottom: 0,
            right: '1px',
            width: 'calc(100% + 1px)',
          },
        }}
        {...props}
      >
        {Children.map(children, (child, index) => (
          // We wrap items in their own `FocusScope` so that we can orchestrate
          // focus changes and active item selection in the `Carousel`.
          // See https://hz-core.netlify.app/focus-scope
          <FocusScope
            as="li"
            key={index}
            id={getCarouselItemId(child, index)}
            // This wrapper also sets the item's scroll snap alignment.
            // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align
            sx={{scrollSnapAlign}}
          >
            {child}
          </FocusScope>
        ))}
      </Grid>
      {process.env.NODE_ENV !== 'production' && __debug ? (
        <Box
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            border: '1px solid pink',
            top: 0,
            bottom: 0,
            width: '100%',
          }}
        >
          {[
            {bg: 'pink', left: `var(--gap-start)`},
            {bg: 'pink', right: `var(--gap-end)`},
            {bg: 'red', left: `var(--scroll-padding-left)`},
            {bg: 'red', right: `var(--scroll-padding-right)`},
          ].map((p, i) => (
            <Box
              key={i}
              sx={{position: 'absolute', top: 0, bottom: 0, width: '1px', ...p}}
            />
          ))}
        </Box>
      ) : null}
    </FocusScope>
  );
}
