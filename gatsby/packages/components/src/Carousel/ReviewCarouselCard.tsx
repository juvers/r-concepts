/** @jsx jsx */
import {jsx, Box, Text} from '@tishman/components';

export interface ReviewCarouselCardProps {
  quote: string;

  author: string;
}

/**
 * `ReviewCarouselCard` displays social media images
 * which are currently being pulled from TradableBits
 *  It can be used as an item in a Carousel, or by itself.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function ReviewCarouselCard({
  quote,
  author,
}: ReviewCarouselCardProps): JSX.Element {
  return (
    <Box sx={{maxWidth: 900}}>
      <Text
        sx={{
          variant: 'text.heading',
          fontFamily: 'headingSecondary',
          color: 'text',
          fontSize: [6, 8],
          letterSpacing: 0,
          mb: 4,
        }}
      >
        {quote}
      </Text>
      <Text
        sx={{
          variant: 'text.heading',
          fontFamily: 'headingSecondary',
          color: 'text',
          fontSize: [2, 5],
          letterSpacing: 1,
          mb: 4,
        }}
      >{`—${author}`}</Text>
    </Box>
  );
}
