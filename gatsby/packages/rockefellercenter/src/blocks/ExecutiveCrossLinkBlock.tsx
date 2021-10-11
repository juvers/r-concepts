/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const EXECUTIVE_CROSS_LINK_QUERY = graphql`
  query ExecutiveCrossLink {
    dataJson(id: {eq: "executive"}) {
      crossLinks {
        image {
          src {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;

const ExecutiveCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ExecutiveCrossLinkQuery>(
    EXECUTIVE_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Executive JSON data is required!');

  const executiveCrossLinkProps = useMemo(() => {
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
          {executiveCrossLinkProps.map((crossLink) => (
            <CrossLink key={crossLink.title} {...crossLink} />
          ))}
        </Flex>
      </Container>
    </Section>
  );
};

export default ExecutiveCrossLinkBlock;
