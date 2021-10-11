/** @jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Link,
  Text,
  TabMenu,
  usePagination,
  IntrinsicImage,
  IntrinsicBox,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

import type {FluidObject} from 'gatsby-image';
import type {SxStyleProp, IntrinsicImageProps} from '@tishman/components';

export interface FeaturedGalleryProps extends IntrinsicImageProps {
  /** Gallery Title */
  title: string;
  content: FeaturedGalleryContentProps[];
  /** Function that returns a list of category titles */
  getCategories: () => string[];
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

export interface FeaturedGalleryContentProps {
  category: string;
  caption: string;
  alt: string;
  links?: {
    url: string;
    label: string;
  }[];
  fluid: FluidObject;
}

export const FeaturedGallery = ({
  title,
  content,
  ratio = [285 / 200, null, 1140 / 490],
  className,
  getCategories,
  sx,
}: FeaturedGalleryProps): JSX.Element => {
  const categories = getCategories();
  const {page, goto} = usePagination({pages: categories.length});

  return (
    <Box
      sx={{
        mb: 4,
        width: '100%',
        ...sx,
      }}
      className={className}
    >
      <IntrinsicBox ratio={ratio} sx={{position: 'relative'}}>
        {content.map((img, i) => (
          <IntrinsicImage
            key={i}
            ratio={ratio}
            fluid={img.fluid}
            alt={img.alt}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: () => (page === i ? 1 : 0),
              transition: 'opacity 0.2s linear',
            }}
          />
        ))}
      </IntrinsicBox>
      <Flex
        sx={{
          my: [4, null, 5],
          mx: [2, 3],
          flexDirection: ['column', null, 'row'],
        }}
      >
        <H
          sx={{
            mr: 3,
            variant: 'styles.h2',
            fontSize: [5, null, 7],
            flex: ['none', null, '0 0 45%'],
            fontFamily: 'headingSecondary',
          }}
        >
          {title}
        </H>
        <Box sx={{flex: ['none', null, '1 1 auto'], mt: [3, 0]}}>
          <TabMenu tab={page} onTabChange={goto} labels={categories} />
          <Text sx={{mt: 4}}>{content[page].caption}</Text>
          <Flex mt={3}>
            {content[page].links &&
              content[page]?.links?.map(({url, label}) => (
                <Link variant={'underline'} sx={{mr: 3}} key={label} href={url}>
                  {label}
                </Link>
              ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
