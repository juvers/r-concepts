/**@jsx jsx */
import {graphql, useStaticQuery} from 'gatsby';
import {
  jsx,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardFull,
  Container,
  AnchorSection,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PRIVATE_EVENTS_CALLOUT_GRID_QUERY = graphql`
  query PrivateEventsCalloutGrid {
    dataJson(id: {eq: "private-events"}) {
      calloutGrid {
        fullCard {
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
        cards {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 700) {
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

const PrivateEventsCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PrivateEventsCalloutGridQuery>(
    PRIVATE_EVENTS_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsCalloutGridProps = useMemo(() => {
    if (!dataJson.calloutGrid.fullCard)
      throw new Error(
        'Private events callout grid full card data is required!',
      );
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
    privateEventsCalloutGridProps && (
      <AnchorSection {...props}>
        <Container sx={{py: 7}}>
          <CalloutGridCardFull {...privateEventsCalloutGridProps.fullCard} />
          <CalloutGrid sx={{mb: [0, null, 0]}}>
            {privateEventsCalloutGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </AnchorSection>
    )
  );
};

export default PrivateEventsCalloutGridBlock;
