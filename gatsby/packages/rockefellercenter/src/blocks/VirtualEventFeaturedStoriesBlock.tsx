/** @jsx jsx */
import {
  jsx,
  Container,
  Grid,
  Section,
  AtlasCard,
  useThemeUI,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import {getAtlasCardProps} from '~blocks/utils';
import invariant from 'invariant';

const VirtualEventFeaturedStoriesBlock = (
  props: {data: GatsbyTypes.SanityEventVirtualQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data} = props;
  invariant(data, 'Virtual Event JSON data is required!');

  const virtualEventProps = useMemo(() => {
    return {
      featuredStories: data.virtualEvent?.featuredStories?.map((e) =>
        getAtlasCardProps(e),
      ),
    };
  }, [data.virtualEvent]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  return (
    <Section {...props} sx={{py: 8}} ref={sectionRef}>
      <Container>
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
          {virtualEventProps.featuredStories?.map((story) => (
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

export default VirtualEventFeaturedStoriesBlock;
