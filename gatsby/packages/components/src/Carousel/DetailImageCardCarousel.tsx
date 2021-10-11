/** @jsx jsx */
import {jsx, Flex, Container, Box, SxStyleProp} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';
import {DetailImageCarouselCard} from './DetailImageCarouselCard';
import type {DetailImageCarouselCardProps} from './DetailImageCarouselCard';
import {Link} from '@tishman/components';

export interface DetailImageCardCarouselProps {
  title?: string | JSX.Element;
  data: DetailImageCarouselCardProps[];
  sx?: SxStyleProp;
  className?: string;
  carouselTitleSx?: SxStyleProp;
  seeAllLink?: {
    url: string;
    label?: string;
  };
}

/**
 * `DetailImageCardCarousel` will render a list of `data` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function DetailImageCardCarousel({
  data,
  title,
  sx,
  className,
  carouselTitleSx,
  seeAllLink,
}: DetailImageCardCarouselProps): JSX.Element {
  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'column',
        position: 'relative',
        p: 4,
        ...sx,
      }}
    >
      {title && (
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
      )}
      <CarouselContextProvider>
        <CarouselList
          name={typeof title === 'string' ? title : undefined}
          gap={[3, 4]}
          maxWidth="container"
        >
          {data.map((item, index) => (
            <DetailImageCarouselCard key={item.id || index} {...item} />
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
          <Box
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
          </Box>
        </Container>
      </CarouselContextProvider>
    </Flex>
  );
}
