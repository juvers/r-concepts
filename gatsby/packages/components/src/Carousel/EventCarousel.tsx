/** @jsx jsx */
import {jsx, Flex, Container, SxStyleProp, Link} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';
import {EventCarouselCard} from './EventCarouselCard';

import type {EventCarouselCardProps} from './EventCarouselCard';

export interface EventCarouselProps {
  title?: string;
  data: EventCarouselCardProps[];
  sx?: SxStyleProp;
  className?: string;
  seeAllLink?: {
    url: string;
    label: string;
  };
  carouselTitleSx?: SxStyleProp;
}

/**
 * `EventCarousel` will render a list of `data` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function EventCarousel({
  data,
  title = 'More Upcoming Events',
  sx,
  className,
  seeAllLink,
  carouselTitleSx,
}: EventCarouselProps): JSX.Element {
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
      <Container px={[3, 4]}>
        <H
          sx={{
            variant: 'styles.h1',
            visibility: ['hidden', 'hidden', 'visible'],
            fontSize: 4, // FIXME: mirrors styles.h1, but using the variant won't get the 7 value to appear
            mb: [3, 5],
            fontFamily: 'headingSecondary',
            ...carouselTitleSx,
          }}
        >
          {title}
        </H>
      </Container>
      <CarouselContextProvider>
        <CarouselList name={title} gap={[3, 4]} maxWidth="container">
          {data.map((item, index) => (
            <EventCarouselCard key={item.id || index} {...item} />
          ))}
        </CarouselList>
        <Container
          sx={{
            alignSelf: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            mt: [4, 0],
            mb: [3, 0],
            position: ['static', 'static', 'absolute'],
          }}
        >
          <Flex
            sx={{
              justifyContent: seeAllLink ? 'flex-end' : 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: [0, 4],
            }}
          >
            {seeAllLink && (
              <Link variant="underline" href={seeAllLink.url} sx={{mr: 32}}>
                {seeAllLink.label}
              </Link>
            )}
            <CarouselNavigation />
          </Flex>
        </Container>
      </CarouselContextProvider>
    </Flex>
  );
}
