/**@jsx jsx */
import {
  jsx,
  Section,
  Link,
  Text,
  Box,
  Container,
  Flex,
  SidewaysArrowSVG,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo, ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';

const ROCK_SALES_STUDENT_GROUPS_QUERY = graphql`
  query RockGroupSalesStudentGroups {
    dataJson(id: {eq: "rock-group-sales"}) {
      studentGroups {
        title
        captionOne
        captionTwo
        link {
          url
          label
        }
        pdf {
          url
          label
        }
      }
    }
  }
`;

const RockGroupSalesStudentGroupsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RockGroupSalesStudentGroupsQuery>(
    ROCK_SALES_STUDENT_GROUPS_QUERY,
  );

  invariant(
    dataJson,
    'Rock Group Sales Student Groups Block JSON data is required!',
  );

  const rockGroupSalesStudentGroupsData = useMemo(() => {
    return {
      title: dataJson.studentGroups.title,
      captionOne: dataJson.studentGroups.captionOne,
      captionTwo: dataJson.studentGroups.captionTwo,
      link: dataJson.studentGroups.link,
      pdf: dataJson.studentGroups.pdf,
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
            {rockGroupSalesStudentGroupsData.title}
          </H>
          <Text sx={{variant: 'text.mediumP', mb: 3}}>
            {rockGroupSalesStudentGroupsData.captionOne}
          </Text>
          <Text sx={{variant: 'text.mediumP', mb: 5}}>
            {rockGroupSalesStudentGroupsData.captionTwo}
          </Text>
          <Link
            variant="underline"
            href={rockGroupSalesStudentGroupsData.link.url}
            sx={{
              mb: 4,
              display: 'inline-block',
            }}
          >
            <Flex>
              <Text mr={2}>{rockGroupSalesStudentGroupsData.link.label}</Text>
              <SidewaysArrowSVG aria-hidden sx={{alignSelf: 'center'}} />
            </Flex>
          </Link>
          <br />
          <Link
            variant="underline"
            href={rockGroupSalesStudentGroupsData.pdf.url}
            sx={{
              mb: 4,
              display: 'inline-block',
            }}
          >
            <Flex>
              <Text mr={2}>{rockGroupSalesStudentGroupsData.pdf.label}</Text>
              <SidewaysArrowSVG aria-hidden sx={{alignSelf: 'center'}} />
            </Flex>
          </Link>
        </Box>
      </Container>
    </Section>
  );
};

export default RockGroupSalesStudentGroupsBlock;
