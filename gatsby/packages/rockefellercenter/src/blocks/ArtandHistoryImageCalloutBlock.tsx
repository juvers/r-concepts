/**@jsx jsx */
import {jsx, ImageCallout, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_AND_HISTORY_IMAGE_CALLOUT_QUERY = graphql`
  query ArtandHistoryImageCallout {
    dataJson(id: {eq: "art-and-history"}) {
      imageCallout {
        title
        caption
        description
        image {
          src {
            fluid(maxWidth: 646, maxHeight: 894) {
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

const ArtandHistoryImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtandHistoryImageCalloutQuery>(
    ART_AND_HISTORY_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');
  const artAndHistoryImageCalloutProps = useMemo(() => {
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
    <Section {...props} sx={{py: [6, 8]}}>
      <Container>
        <ImageCallout {...artAndHistoryImageCalloutProps} />
      </Container>
    </Section>
  );
};

export default ArtandHistoryImageCalloutBlock;
