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

const NEWSSTAND_STUDIOS_CALLOUT_GRID_QUERY = graphql`
  query NewsstandStudiosCalloutGrid {
    dataJson(id: {eq: "newsstand-studios"}) {
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
            url
            label
          }
        }
      }
    }
  }
`;

const NewsstandStudiosCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.NewsstandStudiosCalloutGridQuery>(
    NEWSSTAND_STUDIOS_CALLOUT_GRID_QUERY,
  );

  invariant(
    dataJson,
    'Newstand Studios Callout Grid json data is missing or invalid',
  );

  const newsstandStudiosCalloutGridProps = useMemo(() => {
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
    newsstandStudiosCalloutGridProps && (
      <Section
        {...props}
        sx={{
          mb: 0,
        }}
      >
        <Container
          sx={{
            mt: 5,
            pb: 0,
            px: [3, 5, 7, 9],
            maxWidth: 'content',
          }}
        >
          <CalloutGrid>
            {newsstandStudiosCalloutGridProps.cards.map(
              (card): JSX.Element => (
                <CalloutGridCard key={card.index} {...card} />
              ),
            )}
          </CalloutGrid>
        </Container>
      </Section>
    )
  );
};

export default NewsstandStudiosCalloutGridBlock;
