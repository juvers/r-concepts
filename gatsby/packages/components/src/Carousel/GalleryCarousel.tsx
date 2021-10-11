/** @jsx jsx */
import {
  jsx,
  Box,
  CarouselContextProvider,
  CarouselList,
  CarouselNavigation,
  SxStyleProp,
} from '@tishman/components';
import {
  GalleryCarouselCard,
  GalleryCarouselCardProps,
} from './GalleryCarouselCard';

export interface GalleryCarouselProps {
  cards: GalleryCarouselCardProps[];
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

/**
 * `GalleryCarousel` will render a list of `cards` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function GalleryCarousel({
  cards,
  sx,
  className,
}: GalleryCarouselProps): JSX.Element {
  if (cards?.length === 1) {
    return <GalleryCarouselCard {...cards[0]} sx={sx} className={className} />;
  }
  return (
    <CarouselContextProvider>
      <Box sx={{position: 'relative', mx: [0, 5], ...sx}} className={className}>
        <CarouselNavigation
          sx={{
            position: 'absolute',
            top: ['100%', '50%'],
            mt: [2, 0],
            transform: ['translateY(0)', 'translateY(-50%)'],
            left: [0, -5],
            right: [0, -5],
            justifyContent: ['center', 'space-between'],
          }}
        />
        <CarouselList gap={0} autoSize="100%">
          {cards.map((card) => (
            <GalleryCarouselCard
              key={card.alt ? card.alt : card.movieUrl}
              {...card}
            />
          ))}
        </CarouselList>
      </Box>
    </CarouselContextProvider>
  );
}
