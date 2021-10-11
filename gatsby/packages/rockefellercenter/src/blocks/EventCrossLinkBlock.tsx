/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const EVENT_CROSS_LINK_QUERY = graphql`
  query EventCrossLink {
    dataJson(id: {eq: "event"}) {
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

const EventCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.EventCrossLinkQuery>(
    EVENT_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Event JSON data is required!');

  const eventCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    eventCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {eventCrossLinkProps.map((crossLink) => (
              <CrossLink key={crossLink.title} {...crossLink} />
            ))}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default EventCrossLinkBlock;
