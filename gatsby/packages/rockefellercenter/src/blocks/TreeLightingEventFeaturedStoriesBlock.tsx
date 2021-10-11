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

const TREE_LIGHTING_EVENT_FEATURED_STORIES_QUERY = graphql`
  query TreeLightingEventFeaturedStories {
    storiesData: allSanityEventTreeLighting(limit: 1) {
      nodes {
        featuredStories {
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
    storiesCopyData: dataJson(
      id: {eq: "rockefeller-center-christmas-tree-lighting"}
    ) {
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

const TreeLightingEventFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    storiesData,
    storiesCopyData,
  } = useStaticQuery<GatsbyTypes.TreeLightingEventFeaturedStoriesQuery>(
    TREE_LIGHTING_EVENT_FEATURED_STORIES_QUERY,
  );

  invariant(storiesCopyData, 'Tree Lighting JSON data is required!');

  const treeLightingStoriesProps = useMemo(() => {
    return {
      title: storiesCopyData.featuredStories.title,
      caption: storiesCopyData.featuredStories.caption,
      link: storiesCopyData.featuredStories.link,
      featuredStories: storiesData.nodes[0].featuredStories?.map((e) =>
        getAtlasCardProps(e),
      ),
    };
  }, [storiesData, storiesCopyData]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
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
            {treeLightingStoriesProps.title}
          </H>
          <Text
            as="p"
            sx={{
              variant: 'text.mediumP',
              mb: 3,
              color: 'accent',
            }}
          >
            {treeLightingStoriesProps.caption}
          </Text>
          <Link
            variant="underline"
            sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
            href={treeLightingStoriesProps.link.url}
          >
            {treeLightingStoriesProps.link.label}
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
          {treeLightingStoriesProps.featuredStories?.map((story) => (
            <AtlasCard
              key={story.title}
              {...story}
              useHoverAnimation={useHoverAnimation}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default TreeLightingEventFeaturedStoriesBlock;
