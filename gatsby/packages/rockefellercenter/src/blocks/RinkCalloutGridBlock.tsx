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

const RINK_CALLOUT_GRID_QUERY = graphql`
  query RinkCalloutGrid {
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
      calloutGrid {
        title
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
          height
          width
          customCardType
        }
      }
    }
  }
`;

const RinkCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RinkCalloutGridQuery>(
    RINK_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Rink JSON data is required!');

  const rinkCalloutGridProps = useMemo(() => {
    return {
      title: dataJson.calloutGrid.title,
      cards: dataJson.calloutGrid.cards.map((card, index) => ({
        index: index,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
        title: card.title,
        caption: card.caption,
        description: card.description,
        links: card.links && card.links.map((link) => link),
        width: card.width,
        height: card.height,
        customCardType: card.customCardType,
      })),
    };
  }, [dataJson]);

  return (
    rinkCalloutGridProps && (
      <AnchorSection {...props}>
        <Container>
          <CalloutGrid title={rinkCalloutGridProps.title}>
            {rinkCalloutGridProps.cards.map((card) => (
              <CalloutGridCard
                key={card.index}
                {...card}
                maxWidth={card.width ?? undefined}
                ratio={
                  card.width && card.height
                    ? card.width / card.height
                    : undefined
                }
              />
            ))}
          </CalloutGrid>
        </Container>
      </AnchorSection>
    )
  );
};

export default RinkCalloutGridBlock;
