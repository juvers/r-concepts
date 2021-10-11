/** @jsx jsx */
import {
  jsx,
  Flex,
  Section,
  Container,
  CrossLink,
  CrossLinkProps,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';

const PLAN_YOUR_VISIT_CROSS_LINK_QUERY = graphql`
  query PlanYourVisitCrossLink {
    dataJson(id: {eq: "plan-your-visit"}) {
      crossLinks {
        title
        caption
        image {
          src {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        link {
          label
          url
        }
      }
    }
  }
`;

const PlanYourVisitCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PlanYourVisitCrossLinkQuery>(
    PLAN_YOUR_VISIT_CROSS_LINK_QUERY,
  );
  const crosslinks = useMemo(() => {
    if (!dataJson) throw new Error('Expected valid cross link data');
    if (!dataJson?.crossLinks || !dataJson?.crossLinks.length)
      throw new Error('Expected cross link list');
    return dataJson?.crossLinks.map((cl) => {
      return {
        ...cl,
        fluid: cl.image.src.fluid,
        alt: cl.image.alt,
      };
    });
  }, [dataJson]);

  return (
    crosslinks && (
      <Section {...props}>
        <Container
          sx={{
            py: [3, 4, 6],
          }}
        >
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {crosslinks.map(
              (crossLink: CrossLinkProps): JSX.Element => (
                <CrossLink key={crossLink.title} {...crossLink} />
              ),
            )}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default PlanYourVisitCrossLinkBlock;
