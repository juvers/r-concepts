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
} from '@tishman/components';
import {Fragment, useEffect} from 'react';
import {FluidObject} from 'gatsby-image';

interface FeaturedEventsProps {
  data: FeaturedEventProps[];
}

export interface FeaturedEventProps {
  category: string;
  title: string;
  formattedStartDateTime: string;
  formattedEndDateTime: string;
  location: {
    title: string;
  };
  admissionType: string;
  alt: string;
  url: string;
  fluid: FluidObject;
}

export const FeaturedEvents = ({
  data,
}: FeaturedEventsProps): JSX.Element | null => {
  const {page, goto, setPages} = usePagination({pages: data.length});

  useEffect(() => setPages(data.length), [setPages, data.length]);
  return (
    <Fragment>
      <Flex
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: ['initial', 'center'],
          display: ['none', 'none', 'flex'],
        }}
      >
        <Box sx={{mr: 9}}>
          <Text sx={{variant: 'text.featuredEventMarquee'}}>Events</Text>
        </Box>
        <Flex
          sx={{
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
            my: [4, 0],
            mr: [3, 5, 6],
            ml: [3, 0],
          }}
        >
          <Box>
            {data.length &&
              data.map((event: FeaturedEventProps, index: number) => (
                <EventDetails
                  key={event.title}
                  index={index}
                  {...event}
                  onHover={goto}
                />
              ))}
            <Box sx={{pt: 5}}>
              <Link variant="underline" href="/events/">
                See all RC Events
              </Link>
            </Box>
          </Box>
        </Flex>
        <Box
          sx={{
            flex: ['1 1 auto', '0 0 50%', '0 0 60%'],
            position: 'relative',
            p: [0, 3],
            borderStyle: ['none', 'solid'],
            borderWidth: '2px',
            borderColor: 'accent',
            maxWidth: 507,
          }}
        >
          <Link
            href={data[page].url}
            aria-label={data[page].title}
            sx={{
              display: 'block',
              position: 'relative',
            }}
          >
            {data.length &&
              data.map((event: FeaturedEventProps, index: number) => (
                <IntrinsicImage
                  key={index}
                  ratio={475 / 666}
                  fluid={event.fluid}
                  alt={event.alt}
                  sx={{
                    borderColor: 'accent',
                    display: ['none', 'block'],
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: page === index ? 1 : 0,
                    transition: 'opacity .2s linear',
                  }}
                />
              ))}
          </Link>
        </Box>
      </Flex>
      <EventCarousel
        title=""
        data={data}
        sx={{display: ['flex', 'flex', 'none']}}
      />
    </Fragment>
  );
};
