/**@jsx jsx */
import {jsx, Section, Text, Box, Container} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo, ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';

const ROCK_SALES_CORPORATE_GROUPS_QUERY = graphql`
  query RockGroupSalesCorporateGroups {
    dataJson(id: {eq: "rock-group-sales"}) {
      corporateGroups {
        title
        captionOne
        captionTwo
      }
    }
  }
`;

const RockGroupSalesCorporateGroupsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RockGroupSalesCorporateGroupsQuery>(
    ROCK_SALES_CORPORATE_GROUPS_QUERY,
  );

  invariant(
    dataJson,
    'Rock Group Sales Corporate Groups Block JSON data is required!',
  );

  const rockGroupSalesCorporateGroupsData = useMemo(() => {
    return {
      title: dataJson.corporateGroups.title,
      captionOne: dataJson.corporateGroups.captionOne,
      captionTwo: dataJson.corporateGroups.captionTwo,
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
            {rockGroupSalesCorporateGroupsData.title}
          </H>
          <Text sx={{variant: 'text.mediumP', mb: 3}}>
            {rockGroupSalesCorporateGroupsData.captionOne}
          </Text>
          <Text sx={{variant: 'text.mediumP'}}>
            {rockGroupSalesCorporateGroupsData.captionTwo}
          </Text>
        </Box>
      </Container>
    </Section>
  );
};

export default RockGroupSalesCorporateGroupsBlock;
