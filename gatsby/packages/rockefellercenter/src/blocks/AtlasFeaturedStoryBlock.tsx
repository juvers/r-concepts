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

const ATLAS_FEATURED_STORY_QUERY = graphql`
  query AtlasFeaturedStory {
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

const AtlasFeaturedStoryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityStoryLp} = useStaticQuery<GatsbyTypes.AtlasFeaturedStoryQuery>(
    ATLAS_FEATURED_STORY_QUERY,
  );
  const atlasFeaturedStoryProps = useMemo(() => {
    if (!sanityStoryLp?.featuredStory)
      throw new Error('Expected valid featured story sanity data');
    const featuredStory = getAtlasCardProps(sanityStoryLp.featuredStory);
    return {featuredStory};
  }, [sanityStoryLp]);

  return (
    atlasFeaturedStoryProps && (
      <Section {...props}>
        <Container sx={{pt: 7, pb: 8, maxWidth: 1400}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: ['column', null, 'row'],
            }}
          >
            <Box
              sx={{
                flex: ['1 1 auto', null, '1 1 32%'],
                textAlign: ['center', null, 'left'],
              }}
            >
              <Text variant="featuredStoryEyebrow">Featured Story</Text>
              <H
                sx={{
                  variant: 'text.heroTitleSmall',
                  fontFamily: 'headingSecondary',
                }}
              >
                {atlasFeaturedStoryProps.featuredStory.title}
              </H>
              <Text variant="storyDate">
                {atlasFeaturedStoryProps.featuredStory.formattedPublishAt}
              </Text>
            </Box>
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
              <IntrinsicImage
                ratio={410 / 450}
                fluid={atlasFeaturedStoryProps.featuredStory.fluid}
                alt={atlasFeaturedStoryProps.featuredStory.alt}
              />
            </Box>
            <Box
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
                href={atlasFeaturedStoryProps.featuredStory.url}
              >
                Read Story
              </Link>
            </Box>
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default AtlasFeaturedStoryBlock;
