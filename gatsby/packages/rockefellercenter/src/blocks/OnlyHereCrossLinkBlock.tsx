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

const ONLY_HERE_CROSS_LINK_QUERY = graphql`
  query OnlyHereCrossLink {
    dataJson(id: {eq: "only-here"}) {
      crossLinks {
        title
        caption
        image {
          src {
            fluid {
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

const OnlyHereCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.OnlyHereCrossLinkQuery>(
    ONLY_HERE_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Only Here Cross Link JSON data is required!');

  const onlyHereCrossLinkProps = useMemo(() => {
    return {
      crossLinks: dataJson.crossLinks.map((crossLink) => ({
        fluid: crossLink.image.src.fluid,
        alt: crossLink.image.alt,
        caption: crossLink.caption,
        title: crossLink.title,
        link: crossLink.link,
      })),
    };
  }, [dataJson]);

  return (
    onlyHereCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {onlyHereCrossLinkProps.crossLinks.map(
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

export default OnlyHereCrossLinkBlock;
