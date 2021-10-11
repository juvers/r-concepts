/** @jsx jsx */
import {jsx} from '@tishman/components';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';

import type {CarouselListProps} from './CarouselList';

export type CarouselProps = CarouselListProps;

/**
 * `Carousel` will render its children as a scrolling list,
 * focusing on them one at a time.
 *
 * @see https://tishman.netlify.app/components/carousels
 */
export function Carousel(props: CarouselProps): JSX.Element {
  return (
    <CarouselContextProvider>
      <CarouselList {...props} />
    </CarouselContextProvider>
  );
}
