/** @jsx jsx */
import {jsx, Flex, Container} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';
import {TicketCarouselCard} from './TicketCarouselCard';

import type {TicketCarouselCardProps} from './TicketCarouselCard';

export interface TicketCarouselProps {
  data: TicketCarouselCardProps[];
  title?: string;
}

/**
 * `TicketCarousel` will render a list of `data` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function TicketCarousel({
  title = 'Ticket Offerings',
  data,
}: TicketCarouselProps): JSX.Element {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        position: 'relative',
        pt: [4, 7],
        pb: [4, 5],
      }}
    >
      <Container px={[3, 4]}>
        <H
          sx={{
            variant: 'styles.h1',
            fontSize: [6, 7], // FIXME: mirrors styles.h1, but using the variant won't get the 7 value to appear
            mb: [3, 5],
            fontFamily: 'headingSecondary',
          }}
        >
          {title}
        </H>
      </Container>
      <CarouselContextProvider>
        <CarouselList name={title} gap={[3, 4]} maxWidth="container">
          {data.map((item, index) => (
            <TicketCarouselCard key={index} {...item} />
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
  );
}
