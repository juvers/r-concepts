/**@jsx jsx */
import {
  jsx,
  Section,
  FeaturedEventsWithCarousel,
  Box,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getEventDetailUri, getSanityFluidImageProps} from '~blocks/utils';

const HOME_FEATURED_EVENTS_QUERY = graphql`
  query HomeFeaturedEvents {
    featuredEvents: sanityHomePage(_type: {eq: "homePage"}) {
      featuredEvents {
        ... on SanityEventTreeLighting {
          startEndDateTime {
            formattedStartDateTime: startDateTime(formatString: "MMM D, h a")
            formattedEndDateTime: endDateTime(formatString: "MMM D, h a")
          }
          admissionType
          category
          location {
            title
          }
          photo {
            caption
            alt
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
          id
          type: _type
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
        ... on SanityEventVirtual {
          startEndDateTime {
            formattedStartDateTime: startDateTime(formatString: "MMM D, h a")
            formattedEndDateTime: endDateTime(formatString: "MMM D, h a")
          }
          admissionType
          category
          location {
            title
          }
          photo {
            caption
            alt
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
          id
          type: _type
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }

        ... on SanityEvent {
          startEndDateTime {
            formattedStartDateTime: startDateTime(formatString: "MMM D, h a")
            formattedEndDateTime: endDateTime(formatString: "MMM D, h a")
          }
          admissionType
          category
          location {
            title
          }
          photo {
            caption
            alt
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
          id
          type: _type
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
    }
  }
`;

const HomeFeaturedEventsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element | null => {
  const {featuredEvents} = useStaticQuery<GatsbyTypes.HomeFeaturedEventsQuery>(
    HOME_FEATURED_EVENTS_QUERY,
  );

  const eventsData = featuredEvents?.featuredEvents;
  const events = useMemo(() => {
    if (!eventsData) throw new Error('Expected valid Event data');

    return eventsData.map((event) => {
      if (!event) throw new Error('Expected valid object');
      if (!event?.titleAndSlug?.title) throw new Error('Expected event title');
      if (!event?.titleAndSlug?.slug?.current)
        throw new Error('Expected event slug');
      if (!event?.id) throw new Error('Expected event id');
      if (!event?.location?.title) throw new Error('Expected event location');
      if (!event?.category) throw new Error('Expected event category');
      if (!event?.admissionType)
        throw new Error('Expected event admissionType');
      if (!event?.startEndDateTime?.formattedStartDateTime)
        throw new Error('Expected event formattedStartDateTime');
      if (!event?.startEndDateTime?.formattedEndDateTime)
        throw new Error('Expected event formattedEndDateTime');
      const {photo} = event;
      const image = getSanityFluidImageProps(photo);
      return {
        category: event.category,
        title: event.titleAndSlug.title,
        url: getEventDetailUri(event),
        formattedStartDateTime: event.startEndDateTime.formattedStartDateTime,
        formattedEndDateTime: event.startEndDateTime.formattedEndDateTime,
        location: event.location,
        admissionType: event.admissionType,
        ...image,
      };
    });
  }, [eventsData]);

  return events && events.length ? (
    <Section {...props}>
      <Box
        sx={{
          py: [4, null, 5],
          my: 2,
          px: [0, 4, 4],
          mx: 'auto',
          maxWidth: 1320,
        }}
      >
        <FeaturedEventsWithCarousel events={events} />
      </Box>
    </Section>
  ) : null;
};

export default HomeFeaturedEventsBlock;
