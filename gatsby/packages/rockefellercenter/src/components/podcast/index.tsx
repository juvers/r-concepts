/** @jsx jsx */
import {
  jsx,
  IntrinsicImage,
  Flex,
  Box,
  Text,
  Button,
  Link,
  AppleIconSvg,
  SpotifyIconSvg,
  AudibleIconSvg,
} from '@tishman/components';
import {useState} from 'react';
import {FluidObject} from 'gatsby-image';
import {H} from '@hzdg/sectioning';

export interface FluidImageProps {
  fluid: FluidObject;
  alt?: string;
}

export interface PodcastProps {
  /** Podcast Category */
  category: string;
  /** Podcast Title */
  title: string;
  /** List of podcast authors */
  authors: (string | undefined)[];
  /** Podcast Poster (must be a fluid image) */
  poster: FluidImageProps;
  /** Podcast Excerpt, short description */
  excerpt: string;
  /** podcast's apple link (only items not required for this component) */
  appleLink?: string;
  /** podcast's spotify link (only items not required for this component) */
  spotifyLink?: string;
  /** podcast's audible link (only items not required for this component) */
  audibleLink?: string;
}

const Podcast = ({
  category,
  title,
  poster,
  authors,
  excerpt,
  appleLink,
  spotifyLink,
  audibleLink,
}: PodcastProps): JSX.Element => {
  const [isVisible, toggleVisible] = useState<boolean>(false);
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'center'],
        flexDirection: ['column', 'row'],
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 auto', '0 0 65%', '0 0 50%'],
          justifyContent: 'space-between',
          alignItems: ['flex-start', 'center'],
          flexDirection: ['column', 'row'],
        }}
      >
        <Box mr={[0, 4]}>
          <Text variant="categoryEyebrow" mb={2}>
            {category}
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
          <Text mb={4}>{`Featuring ${authors
            ?.join(', ')
            .replace(/,(?!.*,)/gim, ', and')}`}</Text>
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
      <Box my={4} ml={[0, 4, 7]} mr={[0, null, 7]}>
        <Button
          sx={{display: ['block', 'none']}}
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
        <Text
          sx={{
            mt: 4,
            mb: 2,
            fontSize: 1,
            letterSpacing: 4,
            fontWeight: 400,
            textTransform: 'uppercase',
          }}
        >
          Listen on:
        </Text>
        <Flex sx={{alignItems: 'center'}}>
          {appleLink && (
            <Link sx={{mr: 3}} href={appleLink}>
              <AppleIconSvg
                sx={{height: '30px', width: '30px', color: 'text'}}
              />
            </Link>
          )}
          {spotifyLink && (
            <Link sx={{mr: 3}} href={spotifyLink}>
              <SpotifyIconSvg
                sx={{height: '30px', width: '30px', color: 'text'}}
              />
            </Link>
          )}
          {audibleLink && (
            <Link sx={{mr: 3}} href={audibleLink}>
              <AudibleIconSvg
                sx={{height: '30px', width: '30px', color: 'text'}}
              />
            </Link>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Podcast;
