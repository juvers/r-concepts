/** @jsx jsx */
import {
  jsx,
  Flex,
  IntrinsicImage,
  SanityRichText,
  Box,
  Text,
} from '@tishman/components';
import {storyComponents} from './StoryComponents';
import {FluidObject} from 'gatsby-image';
import {BlockContentProps} from '@sanity/block-content-to-react';

interface ImageContentsBlockProps {
  fluid: FluidObject;
  alt: string;
  caption?: string;
  align: string;
  blocks: BlockContentProps['blocks'];
}

export const ImageContentsBlock = ({
  fluid,
  alt,
  caption,
  align,
  blocks,
}: ImageContentsBlockProps): JSX.Element => {
  return (
    <Flex
      sx={{
        flexDirection: [
          'column',
          null,
          align === 'left' ? 'row' : 'row-reverse',
        ],
        my: [6, 8],
        justifyContent: 'space-between',
        alignItems: ['stretch', null, 'center'],
        '> div': {flex: ['1 1 auto', null, '0 0 48%']},
      }}
    >
      <Box sx={{position: 'relative', mb: [6, null, 0]}}>
        <IntrinsicImage
          fluid={fluid}
          alt={alt}
          ratio={1}
          maxWidth={550}
          sx={{mx: 'auto'}}
        />
        {caption && (
          <Text
            sx={{
              position: 'absolute',
              fontSize: [1, 2],
              bottom: [2, 3],
              right: [2, 3],
              color: 'mediaCaption',
            }}
          >
            {caption}
          </Text>
        )}
      </Box>
      <SanityRichText blocks={blocks} components={storyComponents} />
    </Flex>
  );
};
