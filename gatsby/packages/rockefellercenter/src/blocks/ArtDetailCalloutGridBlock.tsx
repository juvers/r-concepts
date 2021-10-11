/**@jsx jsx */
import {
  jsx,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardProps,
  Container,
  Section,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_DETAIL_CALLOUT_GRID_QUERY = graphql`
  query ArtDetailCalloutGrid {
    dataJson(id: {eq: "art-detail"}) {
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

const ArtDetailCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtDetailCalloutGridQuery>(
    ART_DETAIL_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Art detail JSON data is required!');

  const artDetailCalloutProps = useMemo(() => {
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
    <Section {...props}>
      <Container sx={{pt: [7, 7, 7, 9], pb: [4, null, null, null]}}>
        <CalloutGrid>
          {artDetailCalloutProps.cards.map(
            (card: CalloutGridCardProps): JSX.Element => (
              <CalloutGridCard key={card.index} {...card} />
            ),
          )}
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default ArtDetailCalloutGridBlock;
