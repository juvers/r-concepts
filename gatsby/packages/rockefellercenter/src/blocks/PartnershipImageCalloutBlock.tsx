/**@jsx jsx */
import {jsx, Section, Container, ImageCallout} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PARTNERSHIP_IMAGE_CALLOUT_QUERY = graphql`
  query PartnershipImageCallout {
    dataJson(id: {eq: "partnerships"}) {
      partnershipImageCallout {
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

const PartnershipImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PartnershipImageCalloutQuery>(
    PARTNERSHIP_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Partnership JSON data is required!');

  return (
    <Section {...props}>
      <Container sx={{py: [4, 6]}}>
        <ImageCallout
          title={dataJson.partnershipImageCallout.title}
          caption={dataJson.partnershipImageCallout.caption}
          fluid={dataJson.partnershipImageCallout.image.src.fluid}
          alt={dataJson.partnershipImageCallout.image.alt}
          link={dataJson.partnershipImageCallout.link}
          description={dataJson.partnershipImageCallout.description}
        />
      </Container>
    </Section>
  );
};

export default PartnershipImageCalloutBlock;
