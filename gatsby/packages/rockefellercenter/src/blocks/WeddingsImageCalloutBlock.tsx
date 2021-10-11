/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WEDDINGS_IMAGE_CALLOUT_QUERY = graphql`
  query WeddingImageCallout {
    dataJson(id: {eq: "wedding"}) {
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

const WeddingsImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingImageCalloutQuery>(
    WEDDINGS_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingImageCalloutProps = useMemo(() => {
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
    weddingImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 8}}>
        <Container>
          <ImageCallout {...weddingImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default WeddingsImageCalloutBlock;
