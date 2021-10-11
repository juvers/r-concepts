/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PRIVATE_EVENTS_IMAGE_CALLOUT_2_QUERY = graphql`
  query PrivateEventsImageCallout2 {
    dataJson(id: {eq: "private-events"}) {
      imageCallout2 {
        title
        caption
        description
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

const PrivateEventsImageCallout2Block = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.PrivateEventsImageCallout2Query>(
    PRIVATE_EVENTS_IMAGE_CALLOUT_2_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsImageCalloutProps = useMemo(() => {
    return {
      fluid: dataJson.imageCallout2.image.src.fluid,
      alt: dataJson.imageCallout2.image.alt,
      title: dataJson.imageCallout2.title,
      caption: dataJson.imageCallout2.caption,
      link: dataJson.imageCallout2.link,
      description: dataJson.imageCallout2.description,
    };
  }, [dataJson]);

  return (
    privateEventsImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 8}}>
        <Container>
          <ImageCallout {...privateEventsImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default PrivateEventsImageCallout2Block;
