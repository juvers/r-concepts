/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  Link,
  AtlasCard,
  Text,
  useThemeUI,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import {getAtlasCardProps} from '~blocks/utils';
import invariant from 'invariant';

const BusinessDetailFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityBusiness,
    dataJson,
  } = useStaticQuery<GatsbyTypes.BusinessDetailFeaturedStoriesQuery>(
    BUSINESS_DETAIL_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Business JSON data is required!');

  const businessDetailFeaturedStoriesProps = useMemo(() => {
    if (!sanityBusiness?.featuredStories)
      throw new Error(
        'Expected valid Business 65 featured stories sanity data',
      );

    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: sanityBusiness.featuredStories.map((story) =>
        getAtlasCardProps(story),
      ),
    };
  }, [sanityBusiness, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    businessDetailFeaturedStoriesProps && (
      <Section sx={{py: 8}} {...props} ref={sectionRef}>
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
              {businessDetailFeaturedStoriesProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.mediumP',
                mb: 3,
                color: 'accent',
              }}
            >
              {businessDetailFeaturedStoriesProps.caption}
            </Text>
            <Link
              variant="underline"
              sx={{color: 'accent', '::after': {backgroundColor: 'accent'}}}
              href={businessDetailFeaturedStoriesProps.link.url}
            >
              {businessDetailFeaturedStoriesProps.link.label}
            </Link>
          </Box>
          {businessDetailFeaturedStoriesProps.featuredStories.map((story) => (
            <AtlasCard
              key={story.title}
              {...story}
              useHoverAnimation={useHoverAnimation}
            />
          ))}
        </Container>
      </Section>
    )
  );
};

export default BusinessDetailFeaturedStoriesBlock;

const BUSINESS_DETAIL_FEATURED_STORIES_QUERY = graphql`
  query BusinessDetailFeaturedStories {
    sanityBusiness {
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
    dataJson(id: {eq: "business-detail"}) {
      featuredStories {
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;
