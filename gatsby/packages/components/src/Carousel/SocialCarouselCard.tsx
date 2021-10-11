/** @jsx jsx */
import {animated, useSpring} from 'react-spring';
import useHover from '@hzdg/use-hover';
import Img from 'gatsby-image';
import type {MouseEventHandler} from 'react';
import {jsx, Box, useThemeUI, IntrinsicBox, Button} from '@tishman/components';

export interface SocialCarouselCardProps {
  id: string;
  /**
   * A `url string` value currently being returned from Tradable Bits api.
   * Note: this carousel card does not use gatsby fluid image object!
   */
  image: string;
  /** the caption of the social media post */
  caption: string;
  /** Optional handler for when the card button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * `SocialCarouselCard` displays social media images
 * which are currently being pulled from TradableBits
 *  It can be used as an item in a Carousel, or by itself.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function SocialCarouselCard({
  image,
  caption,
  onClick,
}: SocialCarouselCardProps): JSX.Element {
  const [isHovering, hoverProps] = useHover();

  const borderAnimationProps = useSpring({
    to: {
      transform: `scale(${isHovering ? 1.09 : 1})`,
      opacity: isHovering ? 1 : 0,
    },
  });

  const imageAnimationProps = useSpring({
    to: {
      transform: `scale(${isHovering ? 1.09 : 1})`,
    },
  });

  const {theme} = useThemeUI();

  const AnimatedImg = animated(Img);

  return (
    <Button
      variant="socialCarouselCardButton"
      onClick={onClick}
      {...hoverProps}
    >
      <IntrinsicBox ratio={1 / 1}>
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <IntrinsicBox
            ratio={1 / 1}
            minWidth={[200, 320]}
            maxWidth={[200, 320]}
            sx={{
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <AnimatedImg
              fluid={{
                aspectRatio: 1,
                src: image,
                sizes: `320px`,
                srcSet: image,
              }}
              style={imageAnimationProps}
              // use theme color if not available default to true which uses
              // gatsby's own grey default color
              backgroundColor={
                (typeof theme?.colors?.backgroundDisabled === 'string' &&
                  theme?.colors?.backgroundDisabled) ||
                true
              }
              alt={caption}
            />
          </IntrinsicBox>
          <animated.div
            style={borderAnimationProps}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              p: 2,
              border: '1px solid',
              borderColor: 'accent',
            }}
          ></animated.div>
        </Box>
      </IntrinsicBox>
    </Button>
  );
}
