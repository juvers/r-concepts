/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RINK_CROSS_LINK_QUERY = graphql`
  query RinkCrossLink {
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
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

const RinkCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RinkCrossLinkQuery>(
    RINK_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Rink JSON data is required!');

  const rinkCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    rinkCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {rinkCrossLinkProps.map((crossLink) => (
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

export default RinkCrossLinkBlock;
