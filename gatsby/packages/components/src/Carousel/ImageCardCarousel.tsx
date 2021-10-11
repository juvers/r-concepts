/** @jsx jsx */
import {jsx, Flex, Container, SxStyleProp} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';
import {ImageCarouselCard} from './ImageCarouselCard';
import type {ImageCarouselCardProps} from './ImageCarouselCard';
import {Link} from '@tishman/components';

export interface ImageCardCarouselProps {
  title?: string | JSX.Element;
  data: ImageCarouselCardProps[];
  sx?: SxStyleProp;
  className?: string;
  carouselTitleSx?: SxStyleProp;
  seeAllLink?: {
    url: string;
    label?: string;
  };
}

/**
 * `ImageCardCarousel` will render a list of `data` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function ImageCardCarousel({
  data,
  title = 'More Upcoming Events',
  sx,
  className,
  carouselTitleSx,
  seeAllLink,
}: ImageCardCarouselProps): JSX.Element {
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
        <CarouselList
          name={typeof title === 'string' ? title : undefined}
          gap={[3, 4]}
          maxWidth="container"
        >
          {data.map((item, index) => (
            <ImageCarouselCard key={item.id || index} {...item} />
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
          <div
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {seeAllLink && (
              <Link variant="underline" href={seeAllLink.url} sx={{mr: 32}}>
                {seeAllLink.label || 'See Them All'}
              </Link>
            )}
            <CarouselNavigation />
          </div>
        </Container>
      </CarouselContextProvider>
    </Flex>
  );
}
