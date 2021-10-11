/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardFull,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const COMMUNITY_CALLOUT_GRID_QUERY = graphql`
  query CommunityCalloutGrid {
    dataJson(id: {eq: "community"}) {
      calloutGrid {
        fullCard {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 1136, maxHeight: 488, cropFocus: CENTER) {
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
              fluid(maxWidth: 890, maxHeight: 890, cropFocus: CENTER) {
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

const CommunityCalloutCardGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.CommunityCalloutGridQuery>(
    COMMUNITY_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Community JSON data is required!');

  return (
    <Section {...props}>
      {dataJson.calloutGrid.fullCard && (
        <Container sx={{py: 4}}>
          <CalloutGridCardFull
            fluid={dataJson.calloutGrid.fullCard.image.src.fluid}
            alt={dataJson.calloutGrid.fullCard.image.alt}
            title={dataJson.calloutGrid.fullCard.title}
            caption={dataJson.calloutGrid.fullCard.caption}
            description={dataJson.calloutGrid.fullCard.description}
            links={dataJson.calloutGrid.fullCard.links}
          />
        </Container>
      )}
      <ThemeProvider theme={getThemeByName('Rock Center')}>
        <Container sx={{py: 4}}>
          <CalloutGrid>
            {dataJson.calloutGrid.cards.map(({image, ...card}, index) => (
              <CalloutGridCard
                key={index}
                index={index}
                fluid={image.src.fluid}
                alt={image.alt}
                {...card}
              />
            ))}
          </CalloutGrid>
        </Container>
      </ThemeProvider>
    </Section>
  );
};

export default CommunityCalloutCardGridBlock;
