/**@jsx jsx */
import {
  jsx,
  CalloutGrid,
  CalloutGridCard,
  Container,
  Section,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const BusinessDetailCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.BusinessDetailCalloutGridQuery>(
    BUSINESS_DETAIL_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Business Detail JSON data is required!');

  const businessDetailCalloutGridProps = useMemo(() => {
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
    businessDetailCalloutGridProps && (
      <Section {...props}>
        <Container py={3} px={[4, 6, null]}>
          <CalloutGrid sx={{maxWidth: 1070, margin: 'auto'}}>
            {businessDetailCalloutGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </Section>
    )
  );
};

export default BusinessDetailCalloutGridBlock;

const BUSINESS_DETAIL_CALLOUT_GRID_QUERY = graphql`
  query BusinessDetailCalloutGrid {
    dataJson(id: {eq: "business-detail"}) {
      calloutGrid {
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
            label
            url
          }
        }
      }
    }
  }
`;
