/**@jsx jsx */
import {
  jsx,
  AtlasCard,
  Container,
  Section,
  Grid,
  Box,
  useThemeUI,
} from '@tishman/components';
import {useMemo} from 'react';
import {H} from '@hzdg/sectioning';
import useSize from '@hzdg/use-size';
import type {ComponentPropsWithoutRef} from 'react';
import {getAtlasCardProps} from '~blocks/utils';

const StoryRelatedStoriesBlock = (
  props: {data: GatsbyTypes.SanityStoryQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {story, recentStories} = props.data;

  const relatedStoriesProps = useMemo(() => {
    if (!story?.featuredStories || story?.featuredStories.length === 0) {
      // If the story does not have  featured stories (related stories).
      // display 2 most recent stories in this block instead
      if (!recentStories?.nodes)
        throw new Error('Expected valid recent stories data');

      const stories = recentStories.nodes.map((node) =>
        getAtlasCardProps(node),
      );
      return {
        title: 'Recent',
        stories,
      };
    } else {
      // else show the featured stories (related stories) in this block
      const stories = story.featuredStories.map((story) =>
        getAtlasCardProps(story),
      );
      return {
        title: 'Related',
        stories,
      };
    }
  }, [story, recentStories]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    relatedStoriesProps && (
      <Section
        {...props}
        sx={{py: [5, null, 8], my: [5, null, 8]}}
        ref={sectionRef}
      >
        <Container>
          <Box sx={{textAlign: 'center'}}>
            <H
              sx={{
                variant: 'text.featuredStoryEyebrow',
              }}
            >
              {relatedStoriesProps.title}
            </H>
          </Box>
          <Grid
            sx={{
              pt: 4,
              pb: [5, null, 8],
              gridTemplateColumns: ['1fr', null, 'repeat(2, 1fr)'],
              gap: [4, null, '0px 100px'],
              '> a:nth-of-type(even)': {
                // Move even blocks down on desktop to match design
                transform: ['translateY(0)', null, `translateY(80px)`],
              },
            }}
          >
            {relatedStoriesProps.stories.map((story) => (
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

export default StoryRelatedStoriesBlock;
