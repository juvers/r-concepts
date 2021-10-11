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

const LEASING_CALLOUT_GRID_QUERY = graphql`
  query LeasingCalloutGrid {
    dataJson(id: {eq: "leasing"}) {
      calloutGrid {
        cards {
          title
          description
          caption
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

const LeasingCalloutCardGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingCalloutGridQuery>(
    LEASING_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingCalloutCardGridProps = useMemo(() => {
    return {
      cards: dataJson.calloutGrid.cards.map((card, index) => ({
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
        <CalloutGrid sx={{mb: [0, 0]}}>
          {leasingCalloutCardGridProps.cards.map((card) => (
            <CalloutGridCard
              key={card.index}
              {...card}
              maxWidth={540}
              ratio={540 / 529}
            />
          ))}
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default LeasingCalloutCardGridBlock;
