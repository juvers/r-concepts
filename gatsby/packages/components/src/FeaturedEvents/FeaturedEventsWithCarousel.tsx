/**@jsx jsx */
import {
  jsx,
  Text,
  Flex,
  EventDetails,
  IntrinsicImage,
  EventCarousel,
  Box,
  usePagination,
  Link,
  FeaturedEventProps,
  useFadeAnimationTrail,
} from '@tishman/components';
import {Fragment} from 'react';
import {a, useSpring, useTransition} from 'react-spring';
import useIntersection from '@hzdg/use-intersection';

interface FeaturedEventsWithCarouselProps {
  events: FeaturedEventProps[];
}

export const FeaturedEventsWithCarousel = ({
  events,
}: FeaturedEventsWithCarouselProps): JSX.Element | null => {
  const {page, goto} = usePagination({pages: events.length});
  const [trails, ref] = useFadeAnimationTrail({
    numberOfItems: events.length,
    threshold: 0.4,
    initialYPosition: 0,
    initialXPosition: -60,
  });

  const [animationProps, animate] = useSpring(() => ({height: 0}));
  const imgRef = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      const intersects = isIntersecting || (rootBounds?.top ?? 0) >= rect.top;
      void animate({height: intersects ? 0 : rect.height});
    },
    {threshold: 0.4},
  );

  const fade = useTransition(events[page], {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  });

  if (!events) return null;

  return (
    <Fragment>
      <Flex
        ref={ref}
        sx={{
          flexDirection: ['column', null, null, 'row'],
          alignItems: ['initial', null, 'center', 'flex-start'],
        }}
      >
        <Flex sx={{ flexShrink:[null, 0], mr: [0, null, null, 5], pr: [3, 2], pl: [3, 0], mt: 6}}>
          <Text sx={{variant: 'text.featuredEventMarquee'}}>Events</Text>
        </Flex>
        <Box sx={{width: '100%'}}>
          <Flex
            sx={{
              px: [3, 0],
              pb: [0, null, 3],
              mb: 2,
              flexDirection: ['column', null, null, 'row'],
              justifyContent: 'space-between',
              alignItems: ['flex-start', null, 'center'],
            }}
          >
            <Text
              sx={{
                variant: 'text.heading',
                fontFamily: 'headingSecondary',
                flex: '0 0 auto',
                fontWeight: ['body', 'heading'],
                fontSize: [4, null, null, 6],
                letterSpacing: 0,
                my: [2, null, null, 0],
              }}
            >
              See what&apos;s happening here at the center of it all.
            </Text>
          </Flex>
          <Flex
            sx={{
              borderTop: '1px solid black',
              pt: 24,
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: ['none', 'none', 'flex'],
            }}
          >
            <Flex
              sx={{
                flex: '1 1 auto',
                my: [4, 0],
                mr: [3, 5, 6],
                ml: [3, 0],
              }}
            >
              <Box>
                {events.length &&
                  events.map((event: FeaturedEventProps, index: number) => (
                    <a.div key={event.title} style={trails[index]}>
                      <EventDetails index={index} {...event} onHover={goto} />
                    </a.div>
                  ))}
                <Box>
                  <Link variant="underline" href="/events">
                    SEE FULL CALENDAR
                  </Link>
                </Box>
              </Box>
            </Flex>
            <Box
              ref={imgRef}
              sx={{
                flex: ['1 1 auto', '0 0 50%', '0 0 60%'],
                position: 'relative',
                maxWidth: 389,
              }}
            >
              <a.div
                style={animationProps}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bg: 'background',
                  zIndex: 1,
                }}
              />
              {fade((style, event) => (
                <a.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    ...style,
                  }}
                >
                  <Link
                    href={event.url}
                    aria-label={event.title}
                    sx={{position: 'relative'}}
                  >
                    <IntrinsicImage
                      ratio={389 / 555}
                      fluid={event.fluid}
                      alt={event.alt}
                      sx={{
                        borderColor: 'accent',
                        display: ['none', 'block'],
                      }}
                    />
                  </Link>
                </a.div>
              ))}
            </Box>
          </Flex>
        </Box>
      </Flex>
      <EventCarousel
        data={events}
        seeAllLink={{label: 'SEE FULL CALENDAR', url: '/events'}}
        sx={{display: ['flex', 'flex', 'none'], pt: 0}}
      />
    </Fragment>
  );
};
