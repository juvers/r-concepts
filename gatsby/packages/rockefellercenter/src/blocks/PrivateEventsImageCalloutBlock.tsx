/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PRIVATE_EVENTS_IMAGE_CALLOUT_QUERY = graphql`
  query PrivateEventsImageCallout {
    dataJson(id: {eq: "private-events"}) {
      imageCallout {
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

const PrivateEventsImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PrivateEventsImageCalloutQuery>(
    PRIVATE_EVENTS_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsImageCalloutProps = useMemo(() => {
    return {
      fluid: dataJson.imageCallout.image.src.fluid,
      alt: dataJson.imageCallout.image.alt,
      title: dataJson.imageCallout.title,
      caption: dataJson.imageCallout.caption,
      link: dataJson.imageCallout.link,
      description: dataJson.imageCallout.description,
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

export default PrivateEventsImageCalloutBlock;
