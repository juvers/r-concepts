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

const DIRECTIONS_CROSS_LINK_QUERY = graphql`
  query DirectionsCrossLink {
    dataJson(id: {eq: "directions"}) {
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

const DirectionsCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.DirectionsCrossLinkQuery>(
    DIRECTIONS_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is required!');

  const directionsCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    directionsCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {directionsCrossLinkProps.map(
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

export default DirectionsCrossLinkBlock;
