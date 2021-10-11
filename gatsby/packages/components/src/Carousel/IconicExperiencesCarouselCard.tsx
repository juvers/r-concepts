/** @jsx jsx */
import Img, {FluidObject} from 'gatsby-image';
import {animated, useSpring} from 'react-spring';
import {H} from '@hzdg/sectioning';
import useHover from '@hzdg/use-hover';
import {
  jsx,
  Text,
  Box,
  Link,
  IntrinsicFlex,
  IntrinsicBox,
} from '@tishman/components';

export interface IconicExperiencesCarouselCardProps {
  /** The iconic experience title. */
  title: string;
  /** A plaintext description of the iconic experience. */
  description: string;
  /** A url to link of the iconic experience landing page. */
  url: string;
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  fluid: FluidObject;
  /** Iconic image alt text */
  alt: string;
}

/**
 * `IconicExperiencesCarouselCard` displays details about a Tishman attraction
 * ticket or experience in a 'card' format. It can be used as an item
 * in a Carousel, or by itself.
 *
 * @see https://tishman.netlify.app/components/carousel
 */
export function IconicExperiencesCarouselCard({
  title,
  description,
  url,
  fluid,
  alt,
}: IconicExperiencesCarouselCardProps): JSX.Element {
  const [isHovering, hoverProps] = useHover();

  // border animation needs to scale to make a square around image
  // since its a rectangle, I needed to fudge the scaling numbers
  // a little bit
  const borderAnimationProps = useSpring({
    to: {
      transform: isHovering
        ? `scaleX(1.07) scaleY(1.05)`
        : `scaleX(1) scaleY(1)`,
      opacity: isHovering ? 1 : 0,
    },
  });

  // Image animation should not have different scaleY, scaleX
  // as that would skew the aspect ratio of that image
  const imageAnimationProps = useSpring({
    to: {
      transform: `scale(${isHovering ? 1.09 : 1})`,
    },
  });

  const AnimatedImg = animated(Img);
  return (
    <Link
      sx={{display: 'inline-block', textDecoration: 'none'}}
      to={url}
      {...hoverProps}
    >
      <IntrinsicFlex
        ratio={320 / 450}
        px={2}
        py={3}
        minWidth={[200, 320]}
        maxWidth={[200, 320]}
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{position: 'relative'}}>
          <IntrinsicBox sx={{overflow: 'hidden'}} ratio={320 / 450}>
            <AnimatedImg style={imageAnimationProps} fluid={fluid} alt={alt} />
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
        <H
          sx={{
            variant: 'styles.h3',
            mx: 2,
            mt: [4, 5],
            mb: 2,
            textAlign: 'center',
            fontFamily: 'headingSecondary',
            color: 'accent',
          }}
        >
          {title}
        </H>
        <Text
          sx={{
            variant: 'text.smallP',
            m: 2,
            textAlign: 'center',
            color: 'accent',
          }}
        >
          {description}
        </Text>
      </IntrinsicFlex>
    </Link>
  );
}
