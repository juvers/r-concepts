/** @jsx jsx */
import {a} from 'react-spring';
import {
  jsx,
  Flex,
  Container,
  Box,
  useFadeAnimation,
  useFadeAnimationTrail,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CarouselContextProvider} from './CarouselContext';
import {CarouselList} from './CarouselList';
import {CarouselNavigation} from './CarouselNavigation';
import {IconicExperiencesCarouselCard} from './IconicExperiencesCarouselCard';
import {Link} from '../Link';
import type {IconicExperiencesCarouselCardProps} from './IconicExperiencesCarouselCard';

export interface IconicExperiencesCarouselProps {
  title?: string;
  link: {
    url: string;
    label: string;
  };
  data: IconicExperiencesCarouselCardProps[];
}

/**
 * `IconicExperiencesCarousel` will render a list of `data` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function IconicExperiencesCarousel({
  title = 'Iconic experiences.',
  link,
  data,
}: IconicExperiencesCarouselProps): JSX.Element {
  const [props, ref] = useFadeAnimation();
  const [trail, carosulRef] = useFadeAnimationTrail({
    numberOfItems: data.length,
    threshold: 0.4,
  });
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        position: 'relative',
        pt: [4, 7],
        pb: [4, 5],
      }}
      ref={carosulRef}
    >
      <Box sx={{px: [3, 4], mx: [0, 'auto']}}>
        <a.div
          ref={ref}
          style={{
            willChange: 'transform opacity',
            ...props,
          }}
        >
          <H
            sx={{
              variant: 'styles.h1',
              fontSize: [6, 7], // FIXME: mirrors styles.h1, but using the variant won't get the 7 value to appear
              mb: 3,
              fontFamily: 'headingSecondary',
              color: 'accent',
            }}
          >
            {title}
          </H>
          <Link
            href={link.url}
            variant={'underline'}
            sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
          >
            {link.label}
          </Link>
        </a.div>
      </Box>
      <CarouselContextProvider>
        <Container
          sx={{
            alignSelf: 'center',
            display: 'flex',
            // right align mobile, left align desktop
            justifyContent: ['flex-end', 'flex-start'],
            mb: 4,
          }}
        >
          {/* move nav up to match design */}
          <CarouselNavigation
            sx={{transform: 'translateY(-25px)', button: {color: 'accent'}}}
          />
        </Container>
        <CarouselList name={title} maxWidth="container">
          {trail.map((props, index) => (
            <a.div key={index} style={props}>
              <IconicExperiencesCarouselCard {...data[index]} />
            </a.div>
          ))}
        </CarouselList>
      </CarouselContextProvider>
    </Flex>
  );
}
