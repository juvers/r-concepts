/**@jsx jsx */
import {
  jsx,
  Container,
  PrivateEventComparisonTable,
  Section,
} from '@tishman/components';
import {useMemo} from 'react';
import invariant from 'invariant';

interface Map {
  [key: string]: string;
}

const venueTitles: Map = {
  rainbowRoomVenue: 'Rainbow Room',
  barSixtyFiveVenue: 'Bar SixtyFive',
  theGalleryVenue: 'The Gallery',
  privateDiningRoomVenue: 'Private Dining Room',
  '620LoftGardenVenue': '620 Loft & Garden',
};

const PrivateEventsVenueCompareBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityRainbowRoomVenueQuery;
}): JSX.Element => {
  const {allSanityAttractionEventVenue, dataJson} = data;

  invariant(dataJson, 'Private Events JSON data is required!');

  const getVenueTitle = (id: string): string => venueTitles[id];

  const specs = useMemo(() => {
    if (
      !allSanityAttractionEventVenue?.nodes &&
      !allSanityAttractionEventVenue.nodes.length
    )
      throw new Error('Expected list of private event venue nodes');

    return allSanityAttractionEventVenue.nodes.map((venue) => {
      if (!venue) throw new Error('Expected venue data');
      if (!venue.floorPlan) throw new Error('Expected venue floorPlan data');
      if (!venue.floorPlan.squareFeet)
        throw new Error('Expected venue floorPlan squareFeet');
      if (!venue.id) throw new Error('Expected venue id');

      const title = getVenueTitle(venue.id);

      return {
        squareFeet: venue.floorPlan.squareFeet,
        ceilings: venue.floorPlan.ceilings,
        dimensions: venue.floorPlan.dimensions,
        title,
      };
    });
  }, [allSanityAttractionEventVenue]);

  const capacity = useMemo(() => {
    return dataJson.capacity?.map(({title, capacities}) => ({
      title,
      capacities: capacities.map(({label, value}) => ({label, value})),
    }));
  }, [dataJson]);

  return (
    <Section>
      <Container sx={{maxWidth: 1280, py: [5, 7]}}>
        <PrivateEventComparisonTable specs={specs} capacity={capacity} />
      </Container>
    </Section>
  );
};

export default PrivateEventsVenueCompareBlock;
