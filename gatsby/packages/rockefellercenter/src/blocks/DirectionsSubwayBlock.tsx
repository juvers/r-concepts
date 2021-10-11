/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import DirectionsGridwithImage from '~components/DirectionsGridwithImage';
import invariant from 'invariant';

const DIRECTIONS_SUBWAY_BLOCK_QUERY = graphql`
  query DirectionsSubwayBlock {
    dataJson(id: {eq: "directions"}) {
      directionSubwayGrid {
        title
        routes {
          name
          directions
        }
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

const DirectionsSubwayBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.DirectionsSubwayBlockQuery>(
    DIRECTIONS_SUBWAY_BLOCK_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is required!');

  const directionsSubwayProps = useMemo(() => {
    return {
      title: dataJson.directionSubwayGrid.title,
      routes: dataJson.directionSubwayGrid.routes.map((route) => {
        return {
          name: route.name,
          directions: route.directions,
        };
      }),
      fluid: dataJson.directionSubwayGrid.image.src.fluid,
      alt: dataJson.directionSubwayGrid.image.alt,
    };
  }, [dataJson]);

  return (
    directionsSubwayProps && (
      <Section {...props}>
        <Container sx={{pb: [3, null, 6], pt: 3}}>
          <DirectionsGridwithImage {...directionsSubwayProps} />
        </Container>
      </Section>
    )
  );
};

export default DirectionsSubwayBlock;
