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
import {HoursAndAddressProps} from '@tishman/components';

export interface ArtListItemProps {
  /** Art List Item Category */
  category: string;
  /** Art List Item Title */
  title: string;
  /** Art List Item Slug */
  slug: string;
  /** Art List Item author(s) */
  authors: {
    name: string;
    nationality: string;
    birthYear: number;
    deathYear?: number;
    countryOfBirth?: string;
  }[];
  fluid: FluidObject;
  alt: string;
  /** Art List Item Excerpt, short description */
  excerpt: string;
  /** Art List Item Location */
  location: HoursAndAddressProps['location'];
}

const ArtListItem = ({
  category,
  title,
  fluid,
  alt,
  authors,
  excerpt,
  location,
  slug,
}: ArtListItemProps): JSX.Element => {
  const [isVisible, toggleVisible] = useState<boolean>(false);

  let authorName = '';

  authors &&
    authors.length > 0 &&
    authors.map((authorInstance, index) => {
      authorName +=
        index !== authors.length - 1
          ? `${authorInstance.name}` + ' and '
          : `${authorInstance.name}`;
    });

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'stretch', 'center'],
        flexDirection: ['column', 'column', 'row'],
        py: [null, null, 6],
        borderBottom: '1px solid #979797',
        maxWidth: 'calc(100% - 60px)',
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 65%', '0 0 65%', '0 0 55%'],
          justifyContent: 'space-between',
          alignItems: ['flex-start', 'flex-start', 'center'],
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <Box mr={[0, 4]} my={[5, null, null]}>
          {category && (
            <Text variant="categoryEyebrow" mb={2}>
              {category}
            </Text>
          )}
          <H sx={{variant: 'styles.h2', fontFamily: 'headingSecondary', mb: 3}}>
            {title}
          </H>
          {authorName && (
            <Text
              sx={{
                variant: 'smallP',
                fontFamily: 'headingSecondary',
                my: 1,
                color: 'secondary',
                fontWeight: 800,
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            >
              {authorName}
            </Text>
          )}
          {location?.title && <Text>{location.title}</Text>}
        </Box>
        <IntrinsicImage
          sx={{width: '100%', flexShrink: 0}}
          minWidth={190}
          maxWidth={328}
          ratio={190 / 270}
          fluid={fluid}
          alt={alt}
        />
      </Flex>
      <Box my={5} ml={[0, null, 6]} mr={[0, null, 3]}>
        <Button
          sx={{display: ['block', 'none'], mb: 3}}
          variant="text"
          onClick={() => toggleVisible(!isVisible)}
        >
          {isVisible ? 'Hide Details -' : 'See Details +'}
        </Button>
        {excerpt && (
          <Text
            sx={{
              variant: 'smallP',
              mb: 4,
              display: [isVisible ? 'block' : 'none', 'block'],
            }}
          >
            {excerpt}
          </Text>
        )}
        <Link variant="underline" href={`/art/${slug}/`}>
          LEARN MORE
        </Link>
      </Box>
    </Flex>
  );
};

export default ArtListItem;
