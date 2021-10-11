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

const BAR_65_CALLOUT_GRID_QUERY = graphql`
  query Bar65CalloutGrid {
    dataJson(id: {eq: "bar-sixtyfive"}) {
      calloutGrid {
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

const BarSixtyFiveCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.Bar65CalloutGridQuery>(
    BAR_65_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Bar Sixty Five JSON data is required!');

  const bar65CalloutProps = useMemo(() => {
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
    bar65CalloutProps && (
      <AnchorSection {...props}>
        <Container sx={{pt: 7, pb: 1}}>
          <CalloutGrid>
            {bar65CalloutProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </AnchorSection>
    )
  );
};

export default BarSixtyFiveCalloutGridBlock;
