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

const GESSO_FEATURED_STORIES_QUERY = graphql`
  query GessoFeaturedStories {
    sanityGessoAudioTour {
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
    dataJson(id: {eq: "gesso"}) {
      featuredStories {
        title
        caption
        link {
          url
          label
        }
      }
    }
  }
`;

const GessoFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityGessoAudioTour,
    dataJson,
  } = useStaticQuery<GatsbyTypes.GessoFeaturedStoriesQuery>(
    GESSO_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Gesso JSON data is required!');

  const gessoFeaturedStoriesProps = useMemo(() => {
    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: sanityGessoAudioTour?.featuredStories?.map((story) =>
        getAtlasCardProps(story),
      ),
    };
  }, [sanityGessoAudioTour, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    gessoFeaturedStoriesProps && (
      <Section {...props} sx={{py: 8}} ref={sectionRef}>
        <Container>
          <Box sx={{textAlign: 'center'}}>
            <H
              sx={{
                variant: 'styles.h1',
                mb: 3,
                fontFamily: 'headingSecondary',
                color: 'white',
              }}
            >
              {gessoFeaturedStoriesProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.mediumP',
                mb: 3,
                color: 'white',
              }}
            >
              {gessoFeaturedStoriesProps.caption}
            </Text>
            <Link
              variant="underline"
              sx={{color: 'white', '::after': {backgroundColor: 'white'}}}
              href={gessoFeaturedStoriesProps.link.url}
            >
              {gessoFeaturedStoriesProps.link.label}
            </Link>
          </Box>
          {gessoFeaturedStoriesProps.featuredStories && (
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
              {gessoFeaturedStoriesProps.featuredStories.map((story) => (
                <AtlasCard
                  key={story.title}
                  {...story}
                  useHoverAnimation={useHoverAnimation}
                />
              ))}
            </Grid>
          )}
        </Container>
      </Section>
    )
  );
};

export default GessoFeaturedStoriesBlock;
