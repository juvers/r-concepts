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

const PRIVATE_EVENTS_FEATURED_STORIES_QUERY = graphql`
  query PrivateEventsFeaturedStories {
    sanityAttractionEvent(
      _id: {eq: "privateEvent"}
      _type: {eq: "attraction.event"}
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
    dataJson(id: {eq: "private-events"}) {
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

const BarSixtyFiveHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionEvent,
    dataJson,
  } = useStaticQuery<GatsbyTypes.PrivateEventsFeaturedStoriesQuery>(
    PRIVATE_EVENTS_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsFeaturedStoriesProps = useMemo(() => {
    if (!sanityAttractionEvent?.featuredStories)
      throw new Error(
        'Expected valid private events featured stories static data',
      );

    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: sanityAttractionEvent.featuredStories.map((story) =>
        getAtlasCardProps(story),
      ),
    };
  }, [sanityAttractionEvent, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    privateEventsFeaturedStoriesProps && (
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
              {privateEventsFeaturedStoriesProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.mediumP',
                mb: 3,
                color: 'accent',
              }}
            >
              {privateEventsFeaturedStoriesProps.caption}
            </Text>
            <Link
              variant="underline"
              sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
              href={privateEventsFeaturedStoriesProps.link.url}
            >
              {privateEventsFeaturedStoriesProps.link.label}
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
            {privateEventsFeaturedStoriesProps.featuredStories.map((story) => (
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

export default BarSixtyFiveHeroBlock;
