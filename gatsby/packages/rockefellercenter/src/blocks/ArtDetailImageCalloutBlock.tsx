/**@jsx jsx */
import {jsx, ImageCallout, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_DETAIL_IMAGE_CALLOUT_QUERY = graphql`
  query ArtDetailImageCallout {
    dataJson(id: {eq: "art-detail"}) {
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

const ArtDetailImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtDetailImageCalloutQuery>(
    ART_DETAIL_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Art detail JSON data is required!');

  const artDetailImageCalloutProps = useMemo(() => {
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
    <Section {...props} sx={{pt: [7, 6, 8], pb: [7, 6, 8]}}>
      <Container>
        <ImageCallout {...artDetailImageCalloutProps} />
      </Container>
    </Section>
  );
};

export default ArtDetailImageCalloutBlock;
