/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  createListView,
  ListFilterBar,
  useScrollTo,
} from '@tishman/components';
import {useCallback, useRef, useState} from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import invariant from 'invariant';
import Podcast from '~components/podcast';
import IntroText from '~components/IntroText';

import type {ComponentPropsWithoutRef} from 'react';
import type {ListFilterBarProps} from '@tishman/components';

const NEWSSTAND_STUDIOS_PODCAST_QUERY = graphql`
  query NewsstandStudiosPodcast {
    sanityPodcastLp {
      podcasts {
        authors
        category
        titleAndSlug {
          title
          slug {
            current
          }
        }
        excerpt
        id
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        podcastSource {
          apple
          audible
          spotify
          soundcloud
        }
      }
    }
    dataJson(id: {eq: "newsstand-studios"}) {
      podcastIntroTitle
      podcastIntroCaption
    }
  }
`;

export interface NewsstandStudioPodcastListBlockProps<LeftNavState, CtaState>
  extends Pick<
      ListFilterBarProps<string, LeftNavState, CtaState>,
      'leftNav' | 'cta'
    >,
    ComponentPropsWithoutRef<typeof Section> {}

export default function NewsstandStudioPodcastListBlock<
  LeftNavState,
  CtaState
>({
  cta,
  leftNav,
  ...sectionProps
}: NewsstandStudioPodcastListBlockProps<LeftNavState, CtaState>): JSX.Element {
  const {
    dataJson,
    sanityPodcastLp,
  } = useStaticQuery<GatsbyTypes.NewsstandStudiosPodcastQuery>(
    NEWSSTAND_STUDIOS_PODCAST_QUERY,
  );

  invariant(dataJson, 'Newsstand Studios podcast json data missing');

  const [useListData] = useState(() =>
    createListView({
      filterBy: {'All Categories': 'category'},
      items: sanityPodcastLp?.podcasts?.map((node, index) => {
        invariant(node?.poster.asset?.fluid, 'podcast poster data is missing');
        return {
          category: node.category,
          title: node.titleAndSlug.title,
          authors: [...node.authors],
          poster: {fluid: node.poster.asset.fluid, alt: node.poster.alt},
          excerpt: node.excerpt,
          appleLink: node.podcastSource?.apple,
          audibleLink: node.podcastSource?.audible,
          spotifyLink: node.podcastSource?.spotify,
          key: node.titleAndSlug.slug.current || `${index}`,
        };
      }),
    }),
  );
  const {options, filter, items} = useListData();

  const scrollTo = useScrollTo({forceAnimation: true});
  const listRef = useRef<HTMLDivElement>(null);
  const handleFilterChange = useCallback(
    (...[key, value]: Parameters<typeof filter>) => {
      filter(key, value);
      scrollTo(listRef);
    },
    [filter, scrollTo],
  );

  return (
    <Section {...sectionProps}>
      <Container sx={{py: 4}}>
        <IntroText
          title={dataJson.podcastIntroTitle}
          caption={dataJson.podcastIntroCaption}
          desktopOrientation="row"
          center={true}
          sx={{
            'h1, h2, h3, h4, h5, h6': {
              fontSize: [7, 8, 9],
            },
            mt: [2, 4, 6],
            mb: [6, 0],
          }}
        />
      </Container>
      <ListFilterBar
        options={options}
        onFilterChange={handleFilterChange}
        leftNav={leftNav}
        cta={cta}
      />
      <Container sx={{py: 4}} ref={listRef}>
        {items.map(({key, ...item}) => (
          <Podcast {...item} key={key} />
        ))}
      </Container>
    </Section>
  );
}
