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
  query WeddingImageGrid2 {
    dataJson(id: {eq: "wedding"}) {
      imageGrid2 {
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

const WeddingsImageGrid2Block = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingImageGrid2Query>(
    WEDDINGS_IMAGE_GRID_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingImageGrid2Props = useMemo(() => {
    return dataJson.imageGrid2.cards.map((card) => ({
      fluid: card.image.src.fluid,
      alt: card.image.alt,
      caption: card.caption,
    }));
  }, [dataJson]);

  return (
    weddingImageGrid2Props && (
      <Section {...props}>
        <Container sx={{pb: [4, 8], maxWidth: 1000}}>
          <CalloutGrid offset={120} sx={{gap: 5, mb: [0]}}>
            {weddingImageGrid2Props.map(
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

export default WeddingsImageGrid2Block;
