/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';

const ERROR_CROSS_LINK_QUERY = graphql`
  query ErrorCrossLink {
    dataJson(id: {eq: "404"}) {
      crossLinkTitle
      crossLinks {
        image {
          src {
            fluid {
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

const ErrorCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ErrorCrossLinkQuery>(
    ERROR_CROSS_LINK_QUERY,
  );

  invariant(dataJson, '404 JSON data is required!');

  const errorCrossLinkProps = useMemo(() => {
    const crosslinks = dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));

    const title = dataJson.crossLinkTitle;

    return {
      title,
      crosslinks,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pb: [3, 4, 6]}}>
        <H
          sx={{
            variant: 'styles.h1',
            fontFamily: 'headingSecondary',
            mb: 6,
            pt: 4,
          }}
        >
          {errorCrossLinkProps.title}
        </H>
        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', null, 'row'],
          }}
        >
          {errorCrossLinkProps.crosslinks.map((crossLink) => (
            <CrossLink key={crossLink.title} {...crossLink} />
          ))}
        </Flex>
      </Container>
    </Section>
  );
};

export default ErrorCrossLinkBlock;
