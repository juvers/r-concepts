/**@jsx jsx */
import {jsx, Section, Container, ImageCallout} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const HISTORY_IMAGE_CALLOUT_QUERY = graphql`
  query HistoryImageCallout {
    dataJson(id: {eq: "history"}) {
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

const HistoryImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HistoryImageCalloutQuery>(
    HISTORY_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'History JSON data is required!');

  const historyImageCalloutProps = useMemo(() => {
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
    <Section {...props}>
      <Container sx={{py: [6, 8]}}>
        <ImageCallout {...historyImageCalloutProps} />
      </Container>
    </Section>
  );
};

export default HistoryImageCalloutBlock;
