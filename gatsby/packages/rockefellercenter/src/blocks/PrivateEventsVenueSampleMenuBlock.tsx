/**@jsx jsx */
import {
  jsx,
  Container,
  PrivateEventPdfViewer,
  Section,
} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const PrivateEventsVenueSampleMenuBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityRainbowRoomVenueQuery;
}): JSX.Element => {
  const {sanityAttractionEventVenue} = data;

  const content = useMemo(() => {
    if (!sanityAttractionEventVenue?.sampleMenu)
      throw new Error('Expected sampleMenu');
    if (!sanityAttractionEventVenue?.sampleMenu?.pdf?.asset?.url)
      throw new Error('Expected sampleMenu pdf url');
    if (!sanityAttractionEventVenue?.sampleMenu?.menuPhotos)
      throw new Error('Expected sampleMenu menuPhotos');

    const pdfPhotos = sanityAttractionEventVenue?.sampleMenu?.menuPhotos.map(
      (image) => getSanityFluidImageProps(image),
    );

    const gallery = sanityAttractionEventVenue?.sampleMenu?.gallery?.images
      ? sanityAttractionEventVenue?.sampleMenu?.gallery?.images.map((image) => {
          const sanitizedImage = getSanityFluidImageProps(image);
          return {
            ...sanitizedImage,
            caption: image?.caption,
          };
        })
      : [];

    const pdf = {
      label: 'Download Menu',
      url: sanityAttractionEventVenue?.sampleMenu?.pdf?.asset?.url,
    };

    return {
      pdf,
      pdfPhotos,
      gallery,
    };
  }, [sanityAttractionEventVenue]);

  return (
    <Section>
      <Container sx={{maxWidth: 1280, py: [5, 7], px: [0, 4]}}>
        <PrivateEventPdfViewer {...content} />
      </Container>
    </Section>
  );
};

export default PrivateEventsVenueSampleMenuBlock;
