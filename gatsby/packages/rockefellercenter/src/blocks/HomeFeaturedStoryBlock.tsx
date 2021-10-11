/** @jsx jsx */
import {
  jsx,
  Flex,
  Section,
  Container,
  Box,
  Text,
  IntrinsicImage,
  Link,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getAtlasCardProps} from '~blocks/utils';
import {H} from '@hzdg/sectioning';
import {a, useSpring, config} from 'react-spring';
import useIntersection from '@hzdg/use-intersection';

const HOME_FEATURED_STORY_QUERY = graphql`
  query HomeFeaturedStory {
    sanityStoryLp(_type: {eq: "storyLP"}) {
      featuredStory {
        excerpt
        titleAndSlug {
          title
          slug {
            current
          }
        }
        category
        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;

const HomeFeaturedStoryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityStoryLp} = useStaticQuery<GatsbyTypes.HomeFeaturedStoryQuery>(
    HOME_FEATURED_STORY_QUERY,
  );
  const atlasFeaturedStoryProps = useMemo(() => {
    if (!sanityStoryLp?.featuredStory)
      throw new Error('Expected valid featured story sanity data');
    const featuredStory = getAtlasCardProps(sanityStoryLp.featuredStory);
    return {featuredStory};
  }, [sanityStoryLp]);

  const [wipeAnimation, animateWipe] = useSpring(() => ({height: 0}));

  const [fadeAnimation, animateFade] = useSpring(() => ({
    config: {...config.slow, clamp: true},
    opacity: 0,
    y: 40,
  }));

  const ref = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      const intersects = isIntersecting || (rootBounds?.top ?? 0) >= rect.top;
      void animateWipe({height: intersects ? 0 : rect.height});
      void animateFade({opacity: intersects ? 1 : 0, y: intersects ? 0 : 40});
    },
    {threshold: 0.6},
  );

  return (
    atlasFeaturedStoryProps && (
      <Section {...props} ref={ref}>
        <Container sx={{pt: 7, maxWidth: 1400}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: ['column', null, 'row'],
            }}
          >
            <a.div
              style={fadeAnimation}
              sx={{
                flex: ['1 1 auto', null, '1 1 32%'],
                textAlign: ['center', null, 'left'],
              }}
            >
              <Text variant="featuredStoryEyebrow">Featured Story</Text>
              <H
                sx={{
                  variant: 'styles.h1',
                  letterSpacing: 3,
                  fontFamily: 'headingSecondary',
                }}
              >
                {atlasFeaturedStoryProps.featuredStory.title}
              </H>
              <Text variant="storyDate">
                {atlasFeaturedStoryProps.featuredStory.formattedPublishAt}
              </Text>
            </a.div>
            <Box
              sx={{
                flex: ['1 1 auto', null, '1 1 36%'],
                width: '100%',
                position: 'relative',
                p: 3,
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: 'muted',
                mx: [0, null, 5],
                my: [4, null, 0],
              }}
            >
              <a.div
                style={wipeAnimation}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bg: 'background',
                  zIndex: 1,
                }}
              />
              <IntrinsicImage
                ratio={410 / 450}
                fluid={atlasFeaturedStoryProps.featuredStory.fluid}
                alt={atlasFeaturedStoryProps.featuredStory.alt}
              />
            </Box>
            <a.div
              style={fadeAnimation}
              sx={{
                flex: ['1 1 auto', null, '1 1 32%'],
                textAlign: ['center', null, 'left'],
              }}
            >
              <Text mb={3}>
                {atlasFeaturedStoryProps.featuredStory.excerpt}
              </Text>
              <Link
                variant="underline"
                sx={{
                  color: 'heroBackground',
                  '::after': {
                    backgroundColor: 'heroBackground',
                  },
                }}
                href={atlasFeaturedStoryProps.featuredStory.url}
              >
                Read Story
              </Link>
            </a.div>
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default HomeFeaturedStoryBlock;
