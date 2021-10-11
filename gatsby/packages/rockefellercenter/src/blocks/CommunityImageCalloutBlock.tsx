/**@jsx jsx */
import {jsx, Section, Container, ImageCallout} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const COMMUNITY_IMAGE_CALLOUT_QUERY = graphql`
  query CommunityImageCallout {
    dataJson(id: {eq: "community"}) {
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

const CommunityImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.CommunityImageCalloutQuery>(
    COMMUNITY_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Community Image Callout JSON data is required');

  const communityImageCalloutProps = useMemo(() => {
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
      <Container sx={{py: 4}}>
        <ImageCallout {...communityImageCalloutProps} />
      </Container>
    </Section>
  );
};

export default CommunityImageCalloutBlock;
