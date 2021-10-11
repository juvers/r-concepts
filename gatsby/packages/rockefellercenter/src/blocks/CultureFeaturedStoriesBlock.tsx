/** @jsx jsx */
import {
  jsx,
  Container,
  Grid,
  Box,
  Text,
  Section,
  Link,
  AtlasCard,
  useThemeUI,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {getAtlasCardProps} from '~blocks/utils';
import invariant from 'invariant';

const CULTURE_FEATURED_STORIES_QUERY = graphql`
  query CultureFeaturedStories {
    # TODO: Update to use featured stories instead of just grabbing first 4
    allSanityStory(limit: 4, sort: {fields: publishAt, order: DESC}) {
      edges {
        node {
          titleAndSlug {
            slug {
              current
            }
            title
          }
          category
          excerpt
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
    dataJson(id: {eq: "culture"}) {
      featuredStories {
        title
        caption
        link {
          label
          url
        }
      }
    }
  }
`;

const CultureFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    allSanityStory,
    dataJson,
  } = useStaticQuery<GatsbyTypes.CultureFeaturedStoriesQuery>(
    CULTURE_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const cultureFeaturedStoriesProps = useMemo(() => {
    if (!allSanityStory?.edges)
      throw new Error('Expected valid culture featured stories sanity data');

    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: allSanityStory.edges.map((e) =>
        getAtlasCardProps(e.node),
      ),
    };
  }, [allSanityStory, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    cultureFeaturedStoriesProps && (
      <Section {...props} sx={{py: 8}} ref={sectionRef}>
        <Container>
          <Box sx={{textAlign: 'center'}}>
            <H
              sx={{
                variant: 'styles.h1',
                mb: 3,
                fontFamily: 'headingSecondary',
                color: 'accent',
              }}
            >
              {cultureFeaturedStoriesProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.mediumP',
                mb: 3,
                color: 'accent',
              }}
            >
              {cultureFeaturedStoriesProps.caption}
            </Text>
            <Link
              variant="underline"
              sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
              href={cultureFeaturedStoriesProps.link.url}
            >
              {cultureFeaturedStoriesProps.link.label}
            </Link>
          </Box>
          <Grid
            sx={{
              py: [5, null, 8],
              gridTemplateColumns: ['1fr', null, 'repeat(2, 1fr)'],
              gap: [4, null, '0px 100px'],
              '> a:nth-of-type(even)': {
                // Move even blocks down on desktop to match design
                transform: ['translateY(0)', null, `translateY(80px)`],
              },
            }}
          >
            {cultureFeaturedStoriesProps.featuredStories.map((story) => (
              <AtlasCard
                key={story.title}
                {...story}
                useHoverAnimation={useHoverAnimation}
              />
            ))}
          </Grid>
        </Container>
      </Section>
    )
  );
};

export default CultureFeaturedStoriesBlock;
