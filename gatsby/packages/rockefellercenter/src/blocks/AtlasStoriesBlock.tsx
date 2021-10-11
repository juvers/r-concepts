/** @jsx jsx */
import {
  jsx,
  Container,
  Grid,
  Box,
  Section,
  AtlasCard,
  useThemeUI,
  createListView,
  ListFilterBar,
  useScrollTo,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {useLocation, useNavigate} from '@reach/router';
import slugify from 'slugify';
import {getAtlasCardProps} from '~blocks/utils';

import type {ComponentPropsWithoutRef} from 'react';
import type {ListFilterBarProps} from '@tishman/components';

const ATLAS_STORIES_QUERY = graphql`
  query AtlasStories {
    allSanityStory(sort: {fields: publishAt, order: DESC}) {
      nodes {
        titleAndSlug {
          slug {
            current
          }
          title
        }
        category
        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
        excerpt
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

export interface AtlasStoriesBlockProps<LeftNavState, CtaState>
  extends Pick<
      ListFilterBarProps<string, LeftNavState, CtaState>,
      'leftNav' | 'cta'
    >,
    ComponentPropsWithoutRef<typeof Section> {}

export default function AtlasStoriesBlock<LeftNavState, CtaState>({
  cta,
  leftNav,
  ...sectionProps
}: AtlasStoriesBlockProps<LeftNavState, CtaState>): JSX.Element {
  const {allSanityStory} = useStaticQuery<GatsbyTypes.AtlasStoriesQuery>(
    ATLAS_STORIES_QUERY,
  );
  const [useListData] = useState(() =>
    createListView({
      filterBy: {'Explore Topics': 'category'},
      items: allSanityStory.nodes.map(getAtlasCardProps),
    }),
  );
  const {options, filter, items} = useListData();

  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = useScrollTo({forceAnimation: true});
  const listRef = useRef<HTMLDivElement>(null);
  const handleFilterChange = useCallback(
    (...[key, value]: Parameters<typeof filter>) => {
      filter(key, value);
      scrollTo(listRef);
      navigate(`#${slugify(value, {lower: true, remove: /and/g})}`, {
        replace: true,
      });
    },
    [filter, scrollTo, navigate],
  );
  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');
  const useHoverAnimation = sectionWidth > tabletBreakpoint;
  const [valueFromHash, setValueFromHash] = useState('');

  useLayoutEffect(() => {
    if (location.hash) {
      const [key, values] = options[0];
      const value =
        values.find(
          (value: string) =>
            `#${slugify(value, {lower: true, remove: /and/g})}` ===
            location.hash,
        ) || '';
      setValueFromHash(value);
      handleFilterChange(key, value);
    }
  }, [location.hash]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Section {...sectionProps} sx={{py: 8}} ref={sectionRef}>
      <Container>
        <Box sx={{textAlign: 'center'}}>
          <H sx={{variant: 'text.featuredStoryEyebrow'}}>Recent Stories</H>
        </Box>
      </Container>
      <ListFilterBar
        value={valueFromHash}
        options={options}
        onFilterChange={handleFilterChange}
        leftNav={leftNav}
        cta={cta}
      />
      <Container>
        <Grid
          ref={listRef}
          sx={{
            pb: [5, null, 8],
            gridTemplateColumns: ['1fr', null, 'repeat(2, 1fr)'],
            gap: [4, null, '0px 100px'],
            '> a:nth-of-type(even)': {
              // Move even blocks down on desktop to match design
              transform: ['translateY(0)', null, `translateY(80px)`],
            },
          }}
        >
          {items.map((item) => (
            <AtlasCard
              key={item.title}
              {...item}
              useHoverAnimation={useHoverAnimation}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
