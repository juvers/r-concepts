/** @jsx jsx */
import {
  jsx,
  Flex,
  Container,
  SxStyleProp,
  TicketComparisonCard,
  TicketComparisonCardProps,
  TicketFeaturesDescriptions,
} from '@tishman/components';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';

export interface TicketComparisonCarouselProps {
  tickets: TicketComparisonCardProps[];
  featureList: TicketFeaturesDescriptions;
  sx?: SxStyleProp;
  className?: string;
}

/**
 * `TicketComparisonCarousel` will render two tickets
 * with `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function TicketComparisonCarousel({
  tickets,
  featureList,
  sx,
  className,
}: TicketComparisonCarouselProps): JSX.Element {
  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'column',
        position: 'relative',
        pt: [4, 4, 7],
        pb: [4, 6],
        ...sx,
      }}
    >
      <CarouselContextProvider>
        <CarouselList
          gap={[3, 4]}
          maxWidth="container"
          sx={{alignItems: 'flex-end'}}
        >
          {tickets &&
            tickets.length &&
            tickets.map((ticket) => (
              <TicketComparisonCard
                key={ticket.title}
                {...ticket}
                featureList={featureList}
              />
            ))}
        </CarouselList>
        <Container
          sx={{
            alignSelf: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            mt: [4, 0],
            mb: [3, 0],
            position: 'static',
          }}
        >
          <CarouselNavigation />
        </Container>
      </CarouselContextProvider>
    </Flex>
  );
}
