/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const LEASING_CROSS_LINK_QUERY = graphql`
  query LeasingCrossLink {
    dataJson(id: {eq: "leasing"}) {
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

const LeasingCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingCrossLinkQuery>(
    LEASING_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingCrossLinkProps = useMemo(() => {
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
          {leasingCrossLinkProps.map((crossLink) => (
            <CrossLink key={crossLink.title} {...crossLink} />
          ))}
        </Flex>
      </Container>
    </Section>
  );
};

export default LeasingCrossLinkBlock;
