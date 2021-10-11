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
import invariant from 'invariant';

const WORKING_COMMUNITY_CROSS_LINK_QUERY = graphql`
  query WorkingCommunityCrossLink {
    dataJson(id: {eq: "working-community"}) {
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

const WorkingCommunityCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WorkingCommunityCrossLinkQuery>(
    WORKING_COMMUNITY_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Working Community JSON data is required');
  const workingCommunityCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: [3, 4, 6]}}>
        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', null, 'row'],
          }}
        >
          {workingCommunityCrossLinkProps.map(
            (crossLink: CrossLinkProps): JSX.Element => (
              <CrossLink key={crossLink.title} {...crossLink} />
            ),
          )}
        </Flex>
      </Container>
    </Section>
  );
};

export default WorkingCommunityCrossLinkBlock;
