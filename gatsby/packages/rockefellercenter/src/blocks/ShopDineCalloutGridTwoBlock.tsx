/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const SHOP_DINE_CALLOUT_GRID_TWO_QUERY = graphql`
  query ShopDineCalloutGridTwo {
    dataJson(id: {eq: "shop-and-dine"}) {
      shopAndDineCalloutGridTwo {
        cards {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 980, maxHeight: 924, cropFocus: CENTER) {
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

const ShopDineCalloutGridTwoBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ShopDineCalloutGridTwoQuery>(
    SHOP_DINE_CALLOUT_GRID_TWO_QUERY,
  );

  invariant(dataJson, 'Shop and Dine Callout Grid JSON data is required!');

  const shopDineCalloutGridData = useMemo(() => {
    return {
      cards: dataJson.shopAndDineCalloutGridTwo.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
        title: card.title,
        caption: card.caption,
        description: card.description,
        links: card.links,
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: 4}}>
        <CalloutGrid>
          {shopDineCalloutGridData.cards.map((card) => (
            <CalloutGridCard key={card.index} {...card} />
          ))}
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default ShopDineCalloutGridTwoBlock;
