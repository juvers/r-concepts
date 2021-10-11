/** @jsx jsx */
import {
  jsx,
  Container,
  Box,
  CarouselContextProvider,
  CarouselList,
  CarouselNavigation,
  useFadeAnimationTrail,
} from '@tishman/components';
import {a} from 'react-spring';

import {
  SocialCarouselCard,
  SocialCarouselCardProps,
} from './SocialCarouselCard';

export interface SocialCarouselProps {
  cards: SocialCarouselCardProps[];
  /**
   * A callback for handling a change in active card id.
   *
   * The most likely reason for this to change is
   * when a card has been clicked.
   */
  onActiveCardChange?: (id: string | null) => void;
}
/**
 * `SocialCarousel` will render a list of `cards` in a `CarouselList`
 *  and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function SocialCarousel({
  cards,
  onActiveCardChange,
}: SocialCarouselProps): JSX.Element {
  const [trail, ref] = useFadeAnimationTrail({
    numberOfItems: cards.length,
    threshold: 0.4,
  });

  return (
    <Box sx={{position: 'relative'}} ref={ref}>
      <CarouselContextProvider>
        <Container
          sx={{
            alignSelf: 'center',
            display: 'flex',
            // right align mobile & tablet, left align desktop
            justifyContent: ['flex-end', null, 'flex-start'],
            mb: 4,
          }}
        >
          {/* move nav up to match design */}
          <CarouselNavigation
            sx={{
              position: ['absolute', null, 'static'],
              bottom: [0, null, 'unset'],
              transform: ['translateY(48px)', null, 'translateY(-25px)'],
            }}
          />
        </Container>
        <CarouselList gap={[3, 4]} maxWidth="container">
          {trail.map((props, index) => (
            <a.div key={cards[index].caption} style={props}>
              <SocialCarouselCard
                {...cards[index]}
                onClick={() => onActiveCardChange?.(cards[index].id)}
              />
            </a.div>
          ))}
        </CarouselList>
      </CarouselContextProvider>
    </Box>
  );
}
