/** @jsx jsx */
import {jsx} from '@tishman/components';
import {useContext, createContext} from 'react';
import {usePagination} from '~usePagination';

import type {ReactNode} from 'react';
import type {Pagination, UsePaginationProps} from '~usePagination';

export const CarouselContext = createContext<Pagination | null>(null);
CarouselContext.displayName = 'CarouselContext';

/**
 * `useCarouselContext` will return the `Pagination` state from the nearest
 * `CarouselContextProvider`, or error if none is found.
 *
 * @see CarouselContextProvider
 * @see CarouselList
 * @see CarouselNavigation
 * @see usePagination
 * @see https://tishman.netlify.app/components/carousels
 */
export const useCarouselContext = (): Pagination => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error(
      'Cannot use carousel context outside of a `CarouselContextProvider`!',
    );
  }
  return context;
};

export interface CarouselContextProviderProps {
  children?: ReactNode;
  initialValue?: UsePaginationProps;
}

/**
 * `CarouselContextProvider` will create a carousel `Pagination` context
 * that can be used by other components to build a Carousel UI.
 *
 * @see useCarouselContext
 * @see CarouselList
 * @see CarouselNavigation
 * @see https://tishman.netlify.app/components/carousel
 */
export function CarouselContextProvider({
  children,
  initialValue,
}: CarouselContextProviderProps): JSX.Element {
  return (
    <CarouselContext.Provider value={usePagination(initialValue)}>
      {children}
    </CarouselContext.Provider>
  );
}
