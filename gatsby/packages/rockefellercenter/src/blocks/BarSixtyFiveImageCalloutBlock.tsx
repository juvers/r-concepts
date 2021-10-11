/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const BAR_65_IMAGE_CALLOUT_QUERY = graphql`
  query Bar65ImageCallout {
    dataJson(id: {eq: "bar-sixtyfive"}) {
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

const BarSixtyFiveImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.Bar65ImageCalloutQuery>(
    BAR_65_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Bar Sixty Five JSON data is required!');

  const bar65ImageCalloutProps = useMemo(() => {
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
    bar65ImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 6}}>
        <Container>
          <ImageCallout {...bar65ImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default BarSixtyFiveImageCalloutBlock;
