/**@jsx jsx */
import {
  jsx,
  Container,
  PrivateEventFloorPlan,
  Section,
} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const PrivateEventsVenueFloorPlanBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityRainbowRoomVenueQuery;
}): JSX.Element => {
  const {sanityAttractionEventVenue, meta} = data;

  const specs = useMemo(() => {
    if (!sanityAttractionEventVenue?.floorPlan)
      throw new Error('Expected floorPlan');
    if (!sanityAttractionEventVenue?.floorPlan?.photo)
      throw new Error('Expected floorPlan photo');
    if (!meta?.link) throw new Error('Expected floorPlan link');
    if (!meta?.link.url) throw new Error('Expected floorPlan link url');
    if (!meta?.link.label) throw new Error('Expected floorPlan link label');

    const {link} = meta;

    const capacity =
      sanityAttractionEventVenue.floorPlan?.capacity &&
      sanityAttractionEventVenue.floorPlan.capacity.length
        ? sanityAttractionEventVenue.floorPlan.capacity.map((c) => {
            if (!c) throw new Error('Expected floorPlan capacity');
            if (!c?.capacityType)
              throw new Error('Expected floorPlan capacityType');
            if (!c?.value) throw new Error('Expected floorPlan capacityType');
            return {
              capacityType: c.capacityType,
              value: c.value,
            };
          })
        : undefined;
    const sanitizedImage = getSanityFluidImageProps(
      sanityAttractionEventVenue.floorPlan.photo,
    );
    return {
      ...sanityAttractionEventVenue.floorPlan,
      capacity,
      ...sanitizedImage,
      link,
    };
  }, [sanityAttractionEventVenue, meta]);

  return (
    <Section>
      <Container sx={{maxWidth: 1280, py: [5, 7], px: [0, 4]}}>
        <PrivateEventFloorPlan {...specs} />
      </Container>
    </Section>
  );
};

export default PrivateEventsVenueFloorPlanBlock;
