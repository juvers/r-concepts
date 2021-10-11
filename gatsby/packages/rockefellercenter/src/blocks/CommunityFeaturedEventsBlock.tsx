/**@jsx jsx */
import {jsx, Section, Container, FeaturedEvents} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getEventDetailUri, getSanityFluidImageProps} from '~blocks/utils';

const COMMUNITY_FEATURED_EVENTS_QUERY = graphql`
  query CommunityFeaturedEvents {
    sanityCommunityLp(_id: {eq: "communityLP"}, _type: {eq: "communityLP"}) {
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

const CommunityFeaturedEventsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element | null => {
  const {
    sanityCommunityLp,
  } = useStaticQuery<GatsbyTypes.CommunityFeaturedEventsQuery>(
    COMMUNITY_FEATURED_EVENTS_QUERY,
  );

  const events = sanityCommunityLp?.featuredEvents;
  const featuredData = useMemo(() => {
    if (!events) throw new Error('Expected valid Event data');

    return events.map((event) => {
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
  }, [events]);

  return featuredData.length ? (
    <Section {...props}>
      <Container sx={{py: 4}}>
        <FeaturedEvents data={featuredData} />
      </Container>
    </Section>
  ) : null;
};

export default CommunityFeaturedEventsBlock;
