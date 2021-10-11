/**@jsx jsx */
import {
  jsx,
  Container,
  PrivateEventGallery,
  Section,
} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const PrivateEventsVenueGalleryBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityRainbowRoomVenueQuery;
}): JSX.Element => {
  const {sanityAttractionEventVenue} = data;
  const images = useMemo(() => {
    if (!sanityAttractionEventVenue?.imageGallery)
      throw new Error('Expected imageGallery');
    if (!sanityAttractionEventVenue?.imageGallery?.images)
      throw new Error('Expected imageGallery images');

    return sanityAttractionEventVenue?.imageGallery?.images.map((image) => {
      const sanitizedImage = getSanityFluidImageProps(image);
      return {
        caption: image?.caption,
        ...sanitizedImage,
      };
    });
  }, [sanityAttractionEventVenue]);

  return (
    <Section>
      <Container sx={{maxWidth: 1280, py: [5, 7], px: [0, 4]}}>
        <PrivateEventGallery images={images} />
      </Container>
    </Section>
  );
};

export default PrivateEventsVenueGalleryBlock;
