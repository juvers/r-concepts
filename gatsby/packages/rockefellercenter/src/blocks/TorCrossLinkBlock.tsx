/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOR_CROSS_LINK_QUERY = graphql`
  query TorCrossLink {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
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

const TorCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TorCrossLinkQuery>(
    TOR_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Tor JSON data is required!');

  const torCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    torCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {torCrossLinkProps.map((crossLink) => (
              <CrossLink
                sx={{fontFamily: 'headingSecondary'}}
                key={crossLink.title}
                {...crossLink}
              />
            ))}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default TorCrossLinkBlock;
