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
  useFadeAnimationTrail,
} from '@tishman/components';
import {a} from 'react-spring';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {getAtlasCardProps} from '~blocks/utils';
import invariant from 'invariant';
import HomeFeaturedStoryBlock from '~blocks/HomeFeaturedStoryBlock';

const HOME_FEATURED_STORIES_QUERY = graphql`
  query HomeFeaturedStories {
    featuredStories: sanityHomePage(_type: {eq: "homePage"}) {
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
    dataJson(id: {eq: "home-page"}) {
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

const HomeFeaturedStoriesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    featuredStories,
    dataJson,
  } = useStaticQuery<GatsbyTypes.HomeFeaturedStoriesQuery>(
    HOME_FEATURED_STORIES_QUERY,
  );

  invariant(dataJson, 'Home page JSON data is required!');

  const stories = featuredStories?.featuredStories;
  const homeFeaturedStoriesProps = useMemo(() => {
    if (!stories) throw new Error('Expected valid Atlas Stories data');

    return {
      title: dataJson.featuredStories.title,
      caption: dataJson.featuredStories.caption,
      link: dataJson.featuredStories.link,
      featuredStories: stories.map((story) => getAtlasCardProps(story)),
    };
  }, [stories, dataJson]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;

  const centerStories = homeFeaturedStoriesProps.featuredStories;
  const [trailIntro, introRef] = useFadeAnimationTrail({numberOfItems: 3});

  const components = [
    <H
      key="title"
      sx={{
        variant: 'text.mediumTitle',
        mb: 3,
        color: 'heroBackground',
      }}
    >
      {homeFeaturedStoriesProps.title}
    </H>,
    <Text
      key="subTitle"
      as="p"
      sx={{
        variant: 'text.mediumP',
        mb: 3,
        color: 'text',
      }}
    >
      {homeFeaturedStoriesProps.caption}
    </Text>,
    <Link
      key="link"
      variant="underline"
      sx={{
        color: 'heroBackground',
        '::after': {backgroundColor: 'heroBackground'},
      }}
      href={homeFeaturedStoriesProps.link.url}
    >
      {homeFeaturedStoriesProps.link.label}
    </Link>,
  ];

  return (
    homeFeaturedStoriesProps && (
      <Section {...props} sx={{py: 8}} ref={sectionRef}>
        <Container>
          <Box
            sx={{textAlign: 'center', maxWidth: 550, mx: 'auto'}}
            ref={introRef}
          >
            {trailIntro.map((props, index) => (
              <a.div key={index} style={props}>
                {components[index]}
              </a.div>
            ))}
          </Box>
          <HomeFeaturedStoryBlock theme="Rock Center Navy" />
          <Grid
            sx={{
              py: [5],
              gridTemplateColumns: ['1fr', null, 'repeat(2, 1fr)'],
              gap: [4, null, '40px 100px'],
              '> a:nth-of-type(even)': {
                // Move even blocks down on desktop to match design
                transform: ['translateY(0)', null, `translateY(80px)`],
              },
            }}
          >
            {centerStories.map((item) => (
              <AtlasCard
                key={item.title}
                {...item}
                useHoverAnimation={useHoverAnimation}
              />
            ))}
          </Grid>
        </Container>
      </Section>
    )
  );
};

export default HomeFeaturedStoriesBlock;
