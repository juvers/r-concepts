/**@jsx jsx */
import {
  jsx,
  // CalloutGrid,
  Container,
  Section,
  ImageGridCard,
  Flex,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_AND_HISTORY_IMAGE_GRID_QUERY = graphql`
  query ArtandHistoryImageGrid {
    dataJson(id: {eq: "art-and-history"}) {
      imageGrid {
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

const ArtandHistoryImageGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtandHistoryImageGridQuery>(
    ART_AND_HISTORY_IMAGE_GRID_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');
  const artAndHistoryImageGridProps = useMemo(() => {
    return dataJson.imageGrid.cards.map((card) => ({
      fluid: card.image.src.fluid,
      alt: card.image.alt,
      caption: card.caption,
    }));
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container>
        <Flex
          sx={{
            // pt: [4, null, 8],
            pb: [4, null, 8],
            flexDirection: ['column', 'column', 'column', 'row'],
            justifyContent: 'space-evenly',
          }}
        >
          {artAndHistoryImageGridProps.map(
            (card, index): JSX.Element =>
              (index + 1) % 2 !== 0 ? (
                <ImageGridCard
                  sx={{mx: 'auto', mb: [4, 'none'], width: '100%'}}
                  maxWidth={['none', 550]}
                  fluid={card.fluid}
                  alt={card.alt}
                  caption={card.caption}
                  key={card.alt}
                />
              ) : (
                <ImageGridCard
                  ratio={[4 / 5, null, 3 / 5]}
                  maxWidth={['95%', 365]}
                  fluid={card.fluid}
                  sx={{
                    mx: 'auto',
                    my: [null, null, 2, 8],
                    width: '100%',
                  }}
                  alt={card.alt}
                  caption={card.caption}
                  key={card.alt}
                />
              ),
          )}
        </Flex>
      </Container>
    </Section>
  );
};

export default ArtandHistoryImageGridBlock;
