/**@jsx jsx */
import {
  jsx,
  AnchorSection,
  FeaturedEvents,
  FeaturedEventProps,
  Box,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getEventDetailUri, getSanityFluidImageProps} from '~blocks/utils';

const DINE_FEATURED_EVENTS_QUERY = graphql`
  query DineFeaturedEvents {
    allSanityEvent(filter: {category: {eq: "Food & Drink"}}) {
      edges {
        node {
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

const DineFeaturedEventsBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element | null => {
  const {allSanityEvent} = useStaticQuery<GatsbyTypes.DineFeaturedEventsQuery>(
    DINE_FEATURED_EVENTS_QUERY,
  );
  const data = useMemo(() => {
    if (!allSanityEvent) throw new Error('Expected valid Event data');
    if (!allSanityEvent?.edges && !allSanityEvent?.edges.length)
      throw new Error('Expected list of events');

    return allSanityEvent?.edges.map(
      ({node}): FeaturedEventProps => {
        if (!node) throw new Error('Expected valid object');
        if (!node?.titleAndSlug?.title) throw new Error('Expected event title');
        if (!node?.titleAndSlug?.slug?.current)
          throw new Error('Expected event slug');
        if (!node?.id) throw new Error('Expected event id');
        if (!node?.location?.title) throw new Error('Expected event location');
        if (!node?.category) throw new Error('Expected event category');
        if (!node?.admissionType)
          throw new Error('Expected event admissionType');
        if (!node?.startEndDateTime?.formattedStartDateTime)
          throw new Error('Expected event formattedStartDateTime');
        if (!node?.startEndDateTime?.formattedEndDateTime)
          throw new Error('Expected event formattedEndDateTime');
        const {photo} = node;
        const image = getSanityFluidImageProps(photo);
        return {
          category: node.category,
          title: node.titleAndSlug.title,
          url: getEventDetailUri(node),
          formattedStartDateTime: node.startEndDateTime.formattedStartDateTime,
          formattedEndDateTime: node.startEndDateTime.formattedEndDateTime,
          location: node.location,
          admissionType: node.admissionType,
          ...image,
        };
      },
    );
  }, [allSanityEvent]);

  return data && data.length ? (
    <AnchorSection {...props}>
      <Box sx={{py: [0, 0, 9], px: 0, mx: 'auto', maxWidth: 1320}}>
        <FeaturedEvents data={data} />
      </Box>
    </AnchorSection>
  ) : null;
};

export default DineFeaturedEventsBlock;
