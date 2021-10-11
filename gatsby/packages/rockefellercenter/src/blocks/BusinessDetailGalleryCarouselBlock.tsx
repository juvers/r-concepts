/** @jsx jsx */
import {useMemo} from 'react';
import {
  jsx,
  GalleryCarousel,
  Box,
  Button,
  Section,
  Link,
} from '@tishman/components';
import {getSanityFluidImageProps} from '~blocks/utils';

const categorySlug = (category: string): string => {
  if (category === 'shop') {
    return 'shops';
  } else if (category === 'amenity') {
    return 'amenities';
  } else if (category === 'dine') {
    return 'dine';
  } else {
    throw new Error(`unknown category ${category}`);
  }
};

const categoryLabel = (category: string): string => {
  if (category === 'shop') {
    return 'Shops';
  } else if (category === 'amenity') {
    return 'Amenities & Services';
  } else if (category === 'dine') {
    return 'Dine';
  } else {
    throw new Error(`unknown category ${category}`);
  }
};

const BusinessDetailGalleryCarouselBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityBusinessQuery;
}): JSX.Element | null => {
  const business = useMemo(() => {
    if (data.business?.imageGallery?.images) {
      const category = data.business.category.category;
      return {
        category,
        cards: data.business.imageGallery.images.map((image) => ({
          ...getSanityFluidImageProps(image),
          category,
        })),
      };
    }
  }, [data]);

  return business ? (
    <Section
      pt={[4, null]}
      px={[3, 0, 3]}
      sx={{maxWidth: '1376px', margin: 'auto'}}
    >
      <GalleryCarousel cards={business.cards} />
      <Box sx={{textAlign: 'center', py: 6, px: [0, null, 6]}}>
        <Link href={`/${categorySlug(business.category)}/`}>
          <Button>SEE ALL {categoryLabel(business.category)}</Button>
        </Link>
      </Box>
    </Section>
  ) : null;
};

export default BusinessDetailGalleryCarouselBlock;
