/** @jsx jsx */
import {jsx, Section, Container, IntrinsicImage} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const DIRECTIONS_STATIC_ILLUSTRATION_BLOCK_QUERY = graphql`
  query DirectionsStaticIllustrationBlock {
    dataJson(id: {eq: "directions"}) {
      directionStaticIllustration {
        image {
          src {
            fluid(maxWidth: 1990) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const DirectionsStaticIllustrationBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.DirectionsStaticIllustrationBlockQuery>(
    DIRECTIONS_STATIC_ILLUSTRATION_BLOCK_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is needed');
  const directionsStaticIllustrationProps = useMemo(() => {
    return {
      fluid: dataJson.directionStaticIllustration.image.src.fluid,
      alt: dataJson.directionStaticIllustration.image.alt,
    };
  }, [dataJson]);

  return (
    directionsStaticIllustrationProps && (
      <Section {...props}>
        <Container sx={{pb: [5, null, 6], pt: 3}}>
          <IntrinsicImage
            ratio={1020 / 480}
            {...directionsStaticIllustrationProps}
          />
        </Container>
      </Section>
    )
  );
};

export default DirectionsStaticIllustrationBlock;
