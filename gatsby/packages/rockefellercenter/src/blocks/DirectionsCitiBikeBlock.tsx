/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import DirectionsGridwithImage from '~components/DirectionsGridwithImage';
import invariant from 'invariant';

const DIRECTIONS_CITI_BIKE_BLOCK_QUERY = graphql`
  query DirectionsCitiBikeBlock {
    dataJson(id: {eq: "directions"}) {
      directionCitiBikeGrid {
        title
        description
        image {
          src {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const DirectionsCitiBikeBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.DirectionsCitiBikeBlockQuery>(
    DIRECTIONS_CITI_BIKE_BLOCK_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is needed');
  const directionsCitiBikeProps = useMemo(() => {
    return {
      title: dataJson.directionCitiBikeGrid.title,
      description: dataJson.directionCitiBikeGrid.description,
      fluid: dataJson.directionCitiBikeGrid.image.src.fluid,
      alt: dataJson.directionCitiBikeGrid.image.alt,
    };
  }, [dataJson]);

  return (
    directionsCitiBikeProps && (
      <Section {...props}>
        <Container sx={{pb: [5, null, 6], pt: 3}}>
          <DirectionsGridwithImage {...directionsCitiBikeProps} />
        </Container>
      </Section>
    )
  );
};

export default DirectionsCitiBikeBlock;
