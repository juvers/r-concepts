/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const HOLIDAYS_IMAGE_CALLOUT_QUERY = graphql`
  query HolidaysImageCallout {
    dataJson(id: {eq: "holidays"}) {
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

const HolidaysImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HolidaysImageCalloutQuery>(
    HOLIDAYS_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Holiday JSON data is required!');

  const holidaysImageCalloutProps = useMemo(() => {
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
    holidaysImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 8}}>
        <Container>
          <ImageCallout {...holidaysImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default HolidaysImageCalloutBlock;
