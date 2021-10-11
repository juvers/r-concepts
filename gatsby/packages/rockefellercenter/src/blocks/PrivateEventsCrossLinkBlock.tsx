/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PRIVATE_EVENTS_CROSS_LINK_QUERY = graphql`
  query PrivateEventsCrossLink {
    dataJson(id: {eq: "private-events"}) {
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

const PrivateEventsCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PrivateEventsCrossLinkQuery>(
    PRIVATE_EVENTS_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    privateEventsCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {privateEventsCrossLinkProps.map((crossLink) => (
              <CrossLink key={crossLink.title} {...crossLink} />
            ))}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default PrivateEventsCrossLinkBlock;
