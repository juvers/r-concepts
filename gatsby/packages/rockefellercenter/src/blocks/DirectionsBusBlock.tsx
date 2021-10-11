/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import DirectionsGridwithImage from '~components/DirectionsGridwithImage';
import invariant from 'invariant';

const DIRECTIONS_BUS_BLOCK_QUERY = graphql`
  query DirectionsBusBlock {
    dataJson(id: {eq: "directions"}) {
      directionBusGrid {
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

const DirectionsBusBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.DirectionsBusBlockQuery>(
    DIRECTIONS_BUS_BLOCK_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is required');

  const directionsBusProps = useMemo(() => {
    return {
      title: dataJson.directionBusGrid.title,
      routes: dataJson.directionBusGrid.routes.map((route) => {
        return {
          name: route.name,
          directions: route.directions,
        };
      }),
      fluid: dataJson.directionBusGrid.image.src.fluid,
      alt: dataJson.directionBusGrid.image.alt,
    };
  }, [dataJson]);

  return (
    directionsBusProps && (
      <Section {...props}>
        <Container sx={{pb: [3, null, 6], pt: 3}}>
          <DirectionsGridwithImage {...directionsBusProps} />
        </Container>
      </Section>
    )
  );
};

export default DirectionsBusBlock;
