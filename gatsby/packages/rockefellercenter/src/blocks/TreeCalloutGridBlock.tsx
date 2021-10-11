/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardFull,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TREE_CALLOUT_GRID_QUERY = graphql`
  query TreeCalloutGrid {
    dataJson(id: {eq: "rockefeller-center-christmas-tree-lighting"}) {
      calloutGrid {
        fullCard {
          title
          caption
          description
          image {
            src {
              fluid {
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
        cards {
          title
          caption
          description
          image {
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          links {
            url
            label
          }
        }
      }
    }
  }
`;

const TreeCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TreeCalloutGridQuery>(
    TREE_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Tree JSON data is required!');

  const treeCalloutGridProps = useMemo(() => {
    if (!dataJson.calloutGrid.fullCard)
      throw new Error('Tree callout grid full card data is required!');
    return {
      fullCard: {
        index: 0,
        fluid: dataJson.calloutGrid.fullCard.image.src.fluid,
        alt: dataJson.calloutGrid.fullCard.image.alt,
        title: dataJson.calloutGrid.fullCard.title,
        caption: dataJson.calloutGrid.fullCard.caption,
        description: dataJson.calloutGrid.fullCard.description,
        links:
          dataJson.calloutGrid.fullCard.links &&
          dataJson.calloutGrid.fullCard.links.map((link) => link),
      },
      cards: dataJson.calloutGrid.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
        title: card.title,
        caption: card.caption,
        description: card.description,
        links: card.links && card.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    treeCalloutGridProps && (
      <Section {...props}>
        <Container sx={{py: 7}}>
          <CalloutGrid offset={150}>
            {treeCalloutGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
          <CalloutGridCardFull {...treeCalloutGridProps.fullCard} />
        </Container>
      </Section>
    )
  );
};

export default TreeCalloutGridBlock;
