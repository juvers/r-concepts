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

const CULTURE_CALLOUT_GRID_QUERY = graphql`
  query CultureCalloutGrid {
    dataJson(id: {eq: "culture"}) {
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

const CultureCalloutCardGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.CultureCalloutGridQuery>(
    CULTURE_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Culture JSON data is required!');

  const cultureCalloutCardGridProps = useMemo(() => {
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
    cultureCalloutCardGridProps && (
      <Section {...props}>
        <Container sx={{py: 4}}>
          <CalloutGrid>
            {cultureCalloutCardGridProps.cards.map((card) => (
              <CalloutGridCard key={card.index} {...card} />
            ))}
          </CalloutGrid>
        </Container>
      </Section>
    )
  );
};

export default CultureCalloutCardGridBlock;
