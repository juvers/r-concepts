/**@jsx jsx */
import {
  jsx,
  Container,
  PrivateEventPdfViewer,
  Section,
} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const PrivateEventsVenueVendorsBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityRainbowRoomVenueQuery;
}): JSX.Element => {
  const {sanityAttractionEventVenue} = data;

  const content = useMemo(() => {
    if (!sanityAttractionEventVenue?.vendor) throw new Error('Expected vendor');
    if (!sanityAttractionEventVenue?.vendor?.vendorListPdf?.asset?.url)
      throw new Error('Expected vendor pdf url');
    if (!sanityAttractionEventVenue?.vendor?.vendorListImages)
      throw new Error('Expected vendor vendorListImages');

    const pdfPhotos = sanityAttractionEventVenue?.vendor?.vendorListImages.map(
      (image) => getSanityFluidImageProps(image),
    );

    const pdf = {
      label: 'Download Vendor List',
      url: sanityAttractionEventVenue?.vendor?.vendorListPdf?.asset?.url,
    };

    return {
      pdf,
      pdfPhotos,
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

export default PrivateEventsVenueVendorsBlock;
