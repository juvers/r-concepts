/**@jsx jsx */
import {
  jsx,
  AnchorSection,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardFull,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const HOLIDAYS_CALLOUT_GRID_QUERY = graphql`
  query HolidaysCalloutGrid {
    dataJson(id: {eq: "holidays"}) {
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
        }
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
              fluid(maxWidth: 1200) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          height
          width
          customCardType
        }
      }
    }
  }
`;

const HolidaysCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HolidaysCalloutGridQuery>(
    HOLIDAYS_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Holidays JSON data is required!');

  const holidayCalloutGridProps = useMemo(() => {
    return {
      fullCard: dataJson?.calloutGrid?.fullCard && {
        index: 0,
        fluid: dataJson.calloutGrid.fullCard.image.src.fluid,
        alt: dataJson.calloutGrid.fullCard.image.alt,
        title: dataJson.calloutGrid.fullCard.title,
        caption: dataJson.calloutGrid.fullCard.caption,
        description: dataJson.calloutGrid.fullCard.description,
      },
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
    holidayCalloutGridProps && (
      <AnchorSection {...props}>
        <Container sx={{py: 7}}>
          {holidayCalloutGridProps.fullCard && (
            <CalloutGridCardFull {...holidayCalloutGridProps.fullCard} />
          )}
          <CalloutGrid offset={360} sx={{mb: [0, null, 0]}}>
            {holidayCalloutGridProps.cards.map((card) => (
              <CalloutGridCard
                key={card.title}
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

export default HolidaysCalloutGridBlock;
