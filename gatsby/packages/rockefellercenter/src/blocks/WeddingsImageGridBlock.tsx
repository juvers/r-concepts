/**@jsx jsx */
import {
  jsx,
  CalloutGrid,
  Container,
  Section,
  ImageGridCard,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WEDDINGS_IMAGE_GRID_QUERY = graphql`
  query WeddingImageGrid {
    dataJson(id: {eq: "wedding"}) {
      imageGrid {
        cards {
          image {
            src {
              fluid(maxWidth: 700) {
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

const WeddingsImageGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingImageGridQuery>(
    WEDDINGS_IMAGE_GRID_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingImageGridProps = useMemo(() => {
    return dataJson.imageGrid.cards.map((card) => ({
      fluid: card.image.src.fluid,
      alt: card.image.alt,
      caption: card.caption,
    }));
  }, [dataJson]);

  return (
    weddingImageGridProps && (
      <Section {...props}>
        <Container sx={{pb: [4, 8], maxWidth: 1000}}>
          {/* special case, design has right one higher than left one */}
          <CalloutGrid
            offset={120}
            sx={{
              gap: 5,
              mb: [0],
              direction: 'rtl',
              '> *': {
                direction: 'ltr',
              },
            }}
          >
            {weddingImageGridProps.map(
              (card): JSX.Element => (
                <ImageGridCard key={card.alt} {...card} />
              ),
            )}
          </CalloutGrid>
        </Container>
      </Section>
    )
  );
};

export default WeddingsImageGridBlock;
