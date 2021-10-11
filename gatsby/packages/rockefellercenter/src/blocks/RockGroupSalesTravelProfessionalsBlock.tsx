/**@jsx jsx */
import {
  jsx,
  Section,
  Flex,
  Link,
  Text,
  Box,
  Container,
  SidewaysArrowSVG,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo, ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';

const ROCK_SALES_TRAVEL_PROFESSIONALS_QUERY = graphql`
  query RockGroupSalesTravelProfessionals {
    dataJson(id: {eq: "rock-group-sales"}) {
      travelProfessionals {
        title
        caption
        link {
          url
          label
        }
      }
    }
  }
`;

const RockGroupSalesTravelProfessionalsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RockGroupSalesTravelProfessionalsQuery>(
    ROCK_SALES_TRAVEL_PROFESSIONALS_QUERY,
  );

  invariant(
    dataJson,
    'Rock Group Sales Travel Professionals Block JSON data is required!',
  );

  const rockGroupSalesTravelProfessionalslData = useMemo(() => {
    return {
      title: dataJson.travelProfessionals.title,
      caption: dataJson.travelProfessionals.caption,
      link: dataJson.travelProfessionals.link,
    };
  }, [dataJson]);
  return (
    <Section {...props}>
      <Container sx={{maxWidth: 987, py: [5, 6], px: [3, 4]}}>
        <Box>
          <H
            sx={{
              variant: 'styles.h2',
              fontFamily: 'headingSecondary',
              mb: 3,
            }}
          >
            {rockGroupSalesTravelProfessionalslData.title}
          </H>
          <Text sx={{variant: 'text.mediumP', mb: 5}}>
            {rockGroupSalesTravelProfessionalslData.caption}
          </Text>

          <Link
            variant="underline"
            href={rockGroupSalesTravelProfessionalslData.link.url}
            sx={{
              mb: 4,
              display: 'inline-block',
            }}
          >
            <Flex>
              <Text mr={2}>
                {rockGroupSalesTravelProfessionalslData.link.label}
              </Text>
              <SidewaysArrowSVG aria-hidden sx={{alignSelf: 'center'}} />
            </Flex>
          </Link>
        </Box>
      </Container>
    </Section>
  );
};

export default RockGroupSalesTravelProfessionalsBlock;
