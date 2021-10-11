/** @jsx jsx */
import {jsx, GalleryCarousel, Container} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const EventGalleryCarouselBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityEventQuery;
}): JSX.Element | null => {
  const eventImageGalleryProps = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data.event) throw new Error('Expected valid event data');
    // if no imageGallery, don't render anything
    if (
      !data.event.imageGallery ||
      !data.event.imageGallery.images ||
      data.event.imageGallery.images.length === 0
    ) {
      return null;
    }
    // else check for proper images data
    return data.event.imageGallery.images.map((image) => {
      const fluidImageProps = getSanityFluidImageProps(image);
      return {
        ...fluidImageProps,
        caption: image?.caption,
      };
    });
  }, [data]);

  return (
    eventImageGalleryProps && (
      <Container sx={{maxWidth: 1400, my: 5, px: [3, 0]}}>
        <GalleryCarousel cards={eventImageGalleryProps} />
      </Container>
    )
  );
};

export default EventGalleryCarouselBlock;
