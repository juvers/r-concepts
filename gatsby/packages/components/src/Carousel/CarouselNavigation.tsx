/** @jsx jsx */
import {jsx, Flex, Button, ArrowSvg} from '@tishman/components';
import VisuallyHidden from '@reach/visually-hidden';
import {useCarouselContext} from './CarouselContext';

import type {ComponentProps} from 'react';

/**
 * `CarouselNavigation` will render 'next' and 'previous' buttons
 * that update the page state from the nearest `CarouselContextProvider`.
 *
 * @see CarouselContextProvider
 * @see Carousel
 * @see https://tishman.netlify.app/components/carousels
 */

interface CarouselNavigationProps extends ComponentProps<typeof Flex> {
  onArrowClick?: (param: boolean) => void;
}

export function CarouselNavigation({
  onArrowClick,
  ...props
}: CarouselNavigationProps): JSX.Element {
  const {hasNext, hasPrevious, goto} = useCarouselContext();
  return (
    <Flex {...props} aria-hidden>
      <Button
        variant="icon"
        disabled={!hasPrevious}
        tabIndex={-1}
        onClick={() => {
          if (onArrowClick) onArrowClick(false);
          goto.previous();
        }}
        sx={{
          cursor: 'pointer',
          ':not(:disabled):hover svg': {
            transform: `translateX(-5px) scale(${24 / 18}) rotate(180deg)`,
          },
        }}
      >
        <VisuallyHidden>Previous Item</VisuallyHidden>
        <ArrowSvg
          aria-hidden
          sx={{
            transition: 'transform 0.3s ease-in-out',
            transform: `scale(${24 / 18}) rotate(180deg)`,
          }}
        />
      </Button>
      <Button
        variant="icon"
        disabled={!hasNext}
        tabIndex={-1}
        onClick={() => {
          if (onArrowClick) onArrowClick(true);
          goto.next();
        }}
        sx={{
          cursor: 'pointer',
          ':not(:disabled):hover svg': {
            transform: `translateX(5px) scale(${24 / 18}) `,
          },
        }}
      >
        <VisuallyHidden>Next Item</VisuallyHidden>
        <ArrowSvg
          aria-hidden
          sx={{
            transition: 'transform 0.3s ease-in-out',
            transform: `scale(${24 / 18})`,
          }}
        />
      </Button>
    </Flex>
  );
}
