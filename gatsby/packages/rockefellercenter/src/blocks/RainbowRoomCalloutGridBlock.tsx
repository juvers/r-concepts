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

const RAINBOW_ROOM_CALLOUT_GRID_QUERY = graphql`
  query RainbowRoomCalloutGrid {
    dataJson(id: {eq: "rainbow-room"}) {
      calloutGrid {
        cards {
          title
          caption
          description
          links {
            url
            label
          }
          image {
            src {
              fluid(maxWidth: 700) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
        }
      }
    }
  }
`;

const RainbowRoomCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RainbowRoomCalloutGridQuery>(
    RAINBOW_ROOM_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Rainbow Room JSON data is required!');

  const rainbowRoomCalloutGridProps = useMemo(() => {
    return {
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
    rainbowRoomCalloutGridProps && (
      <AnchorSection {...props} sx={{pb: 1}}>
        <Container>
          <CalloutGrid>
            {rainbowRoomCalloutGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </AnchorSection>
    )
  );
};

export default RainbowRoomCalloutGridBlock;
