/** @jsx jsx */
import {jsx, Box, Text, IntrinsicImage, SxStyleProp} from '@tishman/components';
import {FluidObject} from 'gatsby-image';

export interface GalleryCarouselCardProps {
  fluid?: FluidObject;
  alt?: string;
  caption?: string;
  movieUrl?: string;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

/**
 * `GalleryCarousel` will render a list of `cards` in a `CarouselList`
 * with a `title` and a `CarouselNavigation`.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function GalleryCarouselCard({
  fluid,
  alt,
  caption,
  movieUrl,
  sx,
  className,
}: GalleryCarouselCardProps): JSX.Element {
  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        pb: [`${(266 / 320) * 100}%`, `${(680 / 1280) * 100}%`],
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        {fluid && (
          <IntrinsicImage
            ratio={[320 / 266, 1280 / 680]}
            fluid={fluid}
            alt={alt}
          />
        )}
        {movieUrl && (
          <video
            width="100%"
            height="100%"
            autoPlay
            loop
            muted
            playsInline
            controls
          >
            <source src={movieUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
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
    </Box>
  );
}
