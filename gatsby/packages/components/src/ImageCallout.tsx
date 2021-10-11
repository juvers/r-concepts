/** @jsx jsx */
import {jsx, Flex, Box, Text, Link, IntrinsicImage} from '@tishman/components';
import {FluidObject} from 'gatsby-image';
import {H} from '@hzdg/sectioning';

export interface ImageCalloutProps {
  /** Callout fluid image */
  fluid: FluidObject;
  /** Callout title. */
  title: string;
  /** Callout caption */
  caption?: string;
  /** Callout alt */
  alt: string;
  /** Callout link, must include url and label */
  link: {
    url: string;
    label: string;
  };
  /** Callout description */
  description: string;
}

export const ImageCallout = ({
  fluid,
  title,
  alt,
  caption,
  link,
  description,
}: ImageCalloutProps): JSX.Element | null => {
  return (
    <Flex
      sx={{
        flexDirection: ['column', 'row'],
        justifyContent: 'space-between',
        alignItems: ['initial', 'center'],
      }}
    >
      <Box
        sx={{
          flex: ['1 1 auto', '0 0 50%', '0 0 60%'],
          position: 'relative',
          p: [0, 3],
          borderStyle: ['none', 'solid'],
          borderWidth: '2px',
          borderColor: 'white',
        }}
      >
        <IntrinsicImage ratio={635 / 879} fluid={fluid} alt={alt} />
        {caption && (
          <Text
            sx={{
              position: 'absolute',
              fontSize: [1, 2],
              bottom: [2, 3],
              right: [2, 3],
              color: 'mediaCaption',
              zIndex: 5,
            }}
          >
            {caption}
          </Text>
        )}
      </Box>
      <Flex
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
          my: [4, 0],
          ml: [3, 5, 6],
          mr: [3, 0],
        }}
      >
        <Box>
          <H sx={{variant: 'text.imageCalloutTitle'}}>{title}</H>
          <Text variant="mediumP" mb={[4]}>
            {description}
          </Text>
          <Link href={link.url} variant="underline">
            {link.label}
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};
