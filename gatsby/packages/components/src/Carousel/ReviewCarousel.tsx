/** @jsx jsx */
import {
  jsx,
  Container,
  Flex,
  Text,
  CarouselContextProvider,
  CarouselList,
  CarouselNavigation,
  TripAdvisorIconSvg,
} from '@tishman/components';

import {
  ReviewCarouselCard,
  ReviewCarouselCardProps,
} from './ReviewCarouselCard';

export interface ReviewCarouselProps {
  cards: ReviewCarouselCardProps[];
}
/**
 * `ReviewCarousel` will render a list of `cards` in a `CarouselList`
 *  and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function ReviewCarousel({cards}: ReviewCarouselProps): JSX.Element {
  return (
    <Container>
      <Flex
        sx={{
          flexDirection: 'column',
          position: 'relative',
          py: [4, 7],
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
            alignItems: ['flex-start', 'center'],
            mb: [5, 6],
          }}
        >
          <TripAdvisorIconSvg sx={{mr: 3}} />
          <Text
            sx={{
              variant: 'text.body',
              fontSize: [2, 5],
              letterSpacing: 1,
              fontWeight: 'medium',
              mb: 0,
            }}
          >
            Via TripAdvisor
          </Text>
        </Flex>
        <CarouselContextProvider>
          <CarouselList name={'TODO'} gap={0} autoSize="100%">
            {cards.map((card) => (
              <ReviewCarouselCard key={card.author} {...card} />
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
