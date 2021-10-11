/** @jsx jsx */
import {
  jsx,
  IntrinsicImage,
  Flex,
  Box,
  Text,
  Button,
  Link,
} from '@tishman/components';
import {useState} from 'react';
import {FluidObject} from 'gatsby-image';
import {H} from '@hzdg/sectioning';

export interface FluidImageProps {
  fluid: FluidObject;
  alt: string;
}

export interface LocationProps {
  title?: string;
  address1?: string;
  address2?: string;
}

export interface BusinessListItemProps {
  /** Business List Item Category */
  category: {category: string};
  /** Business List Item Title */
  title: string;
  /** Business List Item Slug */
  slug: string;
  /** Business List Item Poster (must be a fluid image) */
  poster: FluidImageProps;
  /** Business List Item Excerpt, short description */
  excerpt: string;
  /** Business List Item Location */
  location?: LocationProps;
  url: string;
}

const BusinessListItem = ({
  category,
  title,
  poster,
  excerpt,
  location,
  url,
}: BusinessListItemProps): JSX.Element => {
  const [isVisible, toggleVisible] = useState<boolean>(false);

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'stretch', 'center'],
        flexDirection: ['column', 'column', 'row'],
        pb: 40,
        pt: 40,
        borderBottom: '1px solid #979797',
        maxWidth: 1070,
        margin: '0 auto ',
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 65%', '0 0 65%', '0 0 50%'],
          justifyContent: 'space-between',
          alignItems: ['flex-start', 'flex-start', 'center'],
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <Box mr={[0, 4]} my={[5, null, null]}>
          <Text
            variant="categoryEyebrow"
            mb={2}
            sx={{textTransform: 'capitalize', fontWeight: 'normal'}}
          >
            {category.category}
          </Text>
          <H
            sx={{
              variant: 'styles.h2',
              fontFamily: 'headingSecondary',
              mb: 3,
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
            }}
          >
            {title}
          </H>
          <Text
            sx={{
              variant: 'smallP',
              fontFamily: 'headingSecondary',
              my: 1,
              color: 'secondary',
              fontWeight: 800,
              display: [isVisible ? 'block' : 'none', 'block'],
            }}
          ></Text>
          {location?.title && <Text>{location.title}</Text>}
        </Box>
        <IntrinsicImage
          sx={{width: '100%', flexShrink: 0}}
          minWidth={190}
          maxWidth={328}
          ratio={190 / 270}
          fluid={poster.fluid}
          alt={poster.alt}
        />
      </Flex>
      <Box my={5} ml={[0, null, 6]} mr={[0, null, 6]}>
        <Button
          sx={{display: ['block', 'none'], mb: 3}}
          variant="text"
          onClick={() => toggleVisible(!isVisible)}
        >
          {isVisible ? 'Hide Details -' : 'See Details +'}
        </Button>
        <Text
          sx={{
            variant: 'smallP',
            mb: 4,
            display: [isVisible ? 'block' : 'none', 'block'],
          }}
        >
          {excerpt}
        </Text>
        <Link variant="underline" href={url}>
          LEARN MORE
        </Link>
      </Box>
    </Flex>
  );
};

export default BusinessListItem;
