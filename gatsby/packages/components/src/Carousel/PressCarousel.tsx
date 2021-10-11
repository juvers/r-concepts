/** @jsx jsx */
import {
  jsx,
  Container,
  Flex,
  CarouselContextProvider,
  CarouselList,
  CarouselNavigation,
} from '@tishman/components';

import {PressCarouselCard, PressCarouselCardProps} from './PressCarouselCard';

export interface PressCarouselProps {
  name: string;
  cards: PressCarouselCardProps[];
}
/**
 * `PressCarousel` will render a list of `cards` in a `CarouselList`
 *  and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function PressCarousel({
  cards,
  name = 'Press',
}: PressCarouselProps): JSX.Element {
  return (
    <Container sx={{px: [3, 5]}}>
      <Flex
        sx={{
          flexDirection: 'column',
          position: 'relative',
          py: [4, 7],
        }}
      >
        <CarouselContextProvider>
          <CarouselList name={name} gap={0} autoSize="100%">
            {cards.map((card) => (
              <PressCarouselCard key={card.source} {...card} />
            ))}
          </CarouselList>
          <Container
            sx={{
              alignSelf: 'center',
              display: 'flex',
              justifyContent: 'flex-end',
              mt: [4, 0],
              mb: [3, 0],
              position: ['static', 'absolute'],
            }}
          >
            <CarouselNavigation />
          </Container>
        </CarouselContextProvider>
      </Flex>
    </Container>
  );
}
