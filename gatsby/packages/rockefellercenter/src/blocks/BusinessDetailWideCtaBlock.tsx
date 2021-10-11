/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const BusinessDetailWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.BusinessDetailWideCtaQuery>(
    BUSINESS_DETAIL_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Business Detail JSON data is required!');

  const businessDetailWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    businessDetailWideCtaProps && (
      <Section {...props}>
        <Container sx={{pt: 5, pb: [5, null, 7]}}>
          <WideCta {...businessDetailWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default BusinessDetailWideCtaBlock;

const BUSINESS_DETAIL_WIDE_CTA_QUERY = graphql`
  query BusinessDetailWideCta {
    dataJson(id: {eq: "business-detail"}) {
      wideCta {
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;
