/** @jsx jsx */
import Img, {FluidObject} from 'gatsby-image';
import {useSpring, animated} from 'react-spring';
import useHover from '@hzdg/use-hover';
import {jsx, Flex, Box, Text, Link} from '@tishman/components';
import {H} from '@hzdg/sectioning';

export interface AtlasCardProps {
  /** The URL of article. */
  url: string;
  /** The article's title. */
  title: string;
  /** The article's short description field. */
  excerpt: string;
  /**
   * The article's poster src
   */
  fluid: FluidObject;
  /**
   * The article's poster alt text
   */
  alt: string;
  /** Whether or not to show hover animation
   * This boolean is passed from Atlas/index.tsx
   */
  useHoverAnimation: boolean;
  /**
   * The article's category
   */
  category: string;
  /**
   * The article's publish date
   */
  formattedPublishAt: string;
}

export const AtlasCard = ({
  url,
  title,
  excerpt,
  fluid,
  alt,
  category,
  formattedPublishAt,
  useHoverAnimation,
}: AtlasCardProps): JSX.Element | null => {
  const [isHovering, hoverProps] = useHover();

  const imageAnimation = useSpring({
    to: {
      transform: isHovering
        ? 'translate3d(0, 0, 0)'
        : 'translate3d(0, 100%, 0)',
      opacity: isHovering ? 0.5 : 0,
    },
  });

  return (
    <Link
      {...hoverProps}
      href={url}
      sx={{
        color: 'accent',
        display: 'inline-block',
        textDecoration: 'none',
      }}
    >
      <Flex
        sx={{
          textAlign: 'center',
          position: 'relative',
          minHeight: 446,
          maxWidth: 410,
          mx: 'auto',
          px: 4,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',

          '::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            width: '100%',
            backgroundColor: 'text',
          },
        }}
      >
        <animated.div
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            opacity: [0.5, null, 0],
          }}
          style={useHoverAnimation ? imageAnimation : undefined}
        >
          <Img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            fluid={fluid}
            alt={alt}
          />
        </animated.div>
        <Box
          sx={{
            position: 'relative',
            background: 'transparent',
          }}
        >
          <Box sx={{textAlign: 'center'}}>
            <H
              sx={{
                variant: 'text.featuredStoryEyebrow',
              }}
            >
              {category}
            </H>
          </Box>
          <H
            sx={{
              variant: 'text.mediumTitle',
              position: 'relative',
              my: 5,
              '::after': {
                content: '""',
                position: 'absolute',
                bottom: -3,
                left: '50%',
                height: 1,
                transform: 'translateX(-50%)',
                width: 114,
                backgroundColor: 'text',
              },
            }}
          >
            {title}
          </H>
          <Text
            as="p"
            sx={{
              variant: 'text.smallP',
              maxWidth: 330,
              mx: 'auto',
            }}
          >
            {excerpt}
          </Text>
          <Text variant="storyDate">{formattedPublishAt}</Text>
        </Box>
      </Flex>
    </Link>
  );
};
