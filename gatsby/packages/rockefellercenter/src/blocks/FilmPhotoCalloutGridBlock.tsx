/**@jsx jsx */
import {
  jsx,
  Box,
  IntrinsicImage,
  CalloutGrid,
  Container,
  Section,
  CalloutGridCardProps,
} from '@tishman/components';

import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const FILM_PHOTO_CALLOUT_GRID_QUERY = graphql`
  query FilmPhotoCalloutGrid {
    dataJson(id: {eq: "film-photo"}) {
      filmPhotoCalloutGrid {
        title
        caption
        links {
          url
          label
        }
        cards {
          image {
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          caption
        }
      }
    }
  }
`;

export type FilmPhotoCalloutGridCardProps = Omit<
  CalloutGridCardProps,
  'title' | 'links' | 'caption' | 'description'
> & {
  caption?: string;
};
const FilmPhotoCalloutGridCard = ({
  index,
  fluid,
  alt,
  ratio = 476 / 504,
  maxWidth = 476,
}: FilmPhotoCalloutGridCardProps) => {
  const evenCard = index % 2 === 0;
  const lastCard = index === 2;
  return (
    <Box
      sx={{
        width: ['75%', '100%'],
        maxWidth: maxWidth,
        mb: lastCard ? [0] : [5, 8, 9],
        mr: evenCard ? 4 : 0,
        ml: evenCard ? 0 : ['auto', null, 4],
      }}
    >
      <IntrinsicImage
        ratio={ratio}
        maxWidth={maxWidth}
        fluid={fluid}
        alt={alt}
      />
    </Box>
  );
};

const FilmPhotoCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FilmPhotoCalloutGridQuery>(
    FILM_PHOTO_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Film Photo JSON data is required!');

  const filmPhotoCalloutGridProps = useMemo(() => {
    return {
      title: dataJson.filmPhotoCalloutGrid.title,
      caption: dataJson.filmPhotoCalloutGrid.caption,
      links: dataJson.filmPhotoCalloutGrid.links.map((link) => link),
      cards: dataJson.filmPhotoCalloutGrid.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: 9, mb: [0, null, -475]}}>
        <CalloutGrid
          title={filmPhotoCalloutGridProps.title}
          caption={filmPhotoCalloutGridProps.caption}
          links={filmPhotoCalloutGridProps.links}
          sx={{
            gridGap: '0 70px',
          }}
        >
          {filmPhotoCalloutGridProps.cards.map((card) => {
            return (
              <FilmPhotoCalloutGridCard
                ratio={476 / 504}
                maxWidth={476}
                key={`${card.alt}-${card.index}`}
                {...card}
              />
            );
          })}
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default FilmPhotoCalloutGridBlock;
