/**@jsx jsx */
import {
  jsx,
  CalloutGrid,
  CalloutGridCard,
  Container,
  AnchorSection,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WEDDINGS_CALLOUT_GRID_QUERY = graphql`
  query WeddingCalloutGrid {
    dataJson(id: {eq: "wedding"}) {
      calloutGrid {
        title
        caption
        cards {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 1200) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          links {
            label
            url
          }
        }
      }
    }
  }
`;

const WeddingsCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingCalloutGridQuery>(
    WEDDINGS_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingCalloutGridProps = useMemo(() => {
    return {
      title: dataJson.calloutGrid.title,
      caption: dataJson.calloutGrid.caption,
      cards: dataJson.calloutGrid.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
        title: card.title,
        description: card.description,
        caption: card.caption,
        links: card.links && card.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    weddingCalloutGridProps && (
      <AnchorSection {...props}>
        <Container sx={{pt: [6, 8]}}>
          <CalloutGrid
            title={weddingCalloutGridProps.title}
            caption={weddingCalloutGridProps.caption}
          >
            {weddingCalloutGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </AnchorSection>
    )
  );
};

export default WeddingsCalloutGridBlock;
