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

const SPECIAL_OFFER_CALLOUT_GRID_QUERY = graphql`
  query SpecialOfferCalloutGrid {
    dataJson(id: {eq: "special-offers"}) {
      shopAndDineCalloutGridOne {
        cards {
          title
          description
          caption
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
        fullCard {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 1142, maxHeight: 488, cropFocus: CENTER) {
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

const SpecialOfferCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.SpecialOfferCalloutGridQuery>(
    SPECIAL_OFFER_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Shop and Dine Callout Grid JSON data is required!');

  const shopDineCalloutGridData = useMemo(() => {
    return {
      cards: dataJson.shopAndDineCalloutGridOne.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
        title: card.title,
        caption: card.caption,
        description: card.description,
        links: card.links && card.links.map((link) => link),
      })),
      fullCard: {
        index: 0,
        fluid: dataJson.shopAndDineCalloutGridOne.fullCard.image.src.fluid,
        alt: dataJson.shopAndDineCalloutGridOne.fullCard.image.alt,
        title: dataJson.shopAndDineCalloutGridOne.fullCard.title,
        caption: dataJson.shopAndDineCalloutGridOne.fullCard.caption,
        description: dataJson.shopAndDineCalloutGridOne.fullCard.description,
        links: dataJson.shopAndDineCalloutGridOne.fullCard.links,
      },
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: 6, pb: 4}}>
        <CalloutGrid>
          {shopDineCalloutGridData.cards.map((card) => (
            <CalloutGridCard key={card.index} {...card} />
          ))}
        </CalloutGrid>
        <CalloutGridCardFull
          sx={{pt: [6, 34], pb: [3, 5]}}
          {...shopDineCalloutGridData.fullCard}
        />
      </Container>
    </Section>
  );
};

export default SpecialOfferCalloutGridBlock;
