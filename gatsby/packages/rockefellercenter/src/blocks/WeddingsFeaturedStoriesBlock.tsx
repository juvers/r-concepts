/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  Link,
  AtlasCard,
  Text,
  Grid,
  useThemeUI,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {getAtlasCardProps} from '~blocks/utils';
import invariant from 'invariant';

const WEDDING_FEATURED_STORIES_QUERY = graphql`
  query WeddingFeaturedStories {
    sanityAttractionWedding(
      _id: {eq: "wedding"}
      _type: {eq: "attraction.wedding"}
    ) {
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
            fluid(maxWidth: 700) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
    dataJson(id: {eq: "wedding"}) {
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

const WeddingsFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionWedding,
    dataJson,
  } = useStaticQuery<GatsbyTypes.WeddingFeaturedStoriesQuery>(
    WEDDING_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingFeaturedStoriesProps = useMemo(() => {
    if (!sanityAttractionWedding?.featuredStories)
      throw new Error('Expected valid weddings featured stories sanity data');

    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: sanityAttractionWedding.featuredStories.map((story) =>
        getAtlasCardProps(story),
      ),
    };
  }, [sanityAttractionWedding, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    weddingFeaturedStoriesProps && (
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
              {weddingFeaturedStoriesProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.mediumP',
                mb: 3,
                color: 'accent',
              }}
            >
              {weddingFeaturedStoriesProps.caption}
            </Text>
            <Link
              variant="underline"
              sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
              href={weddingFeaturedStoriesProps.link.url}
            >
              {weddingFeaturedStoriesProps.link.label}
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
            {weddingFeaturedStoriesProps.featuredStories.map((story) => (
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

export default WeddingsFeaturedStoriesBlock;
