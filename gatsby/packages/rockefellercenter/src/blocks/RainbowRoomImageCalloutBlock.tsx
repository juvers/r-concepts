/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RAINBOW_ROOM_IMAGE_CALLOUT_QUERY = graphql`
  query RainbowRoomImageCallout {
    dataJson(id: {eq: "rainbow-room"}) {
      imageCallout {
        title
        caption
        description
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

const RainbowRoomImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RainbowRoomImageCalloutQuery>(
    RAINBOW_ROOM_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Rainbow Room JSON data is required!');

  const rainbowRoomImageCalloutProps = useMemo(() => {
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
    rainbowRoomImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 8}}>
        <Container>
          <ImageCallout {...rainbowRoomImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default RainbowRoomImageCalloutBlock;
