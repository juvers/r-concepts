/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const SpecialOffersWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.SpecialOffersWideCtaQuery>(
    SPECIAL_OFFERS_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Business Detail JSON data is required!');

  const specialOffersWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    specialOffersWideCtaProps && (
      <Section {...props}>
        <Container sx={{pt: 3, pb: [5, null, 3]}}>
          <WideCta {...specialOffersWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default SpecialOffersWideCtaBlock;

const SPECIAL_OFFERS_WIDE_CTA_QUERY = graphql`
  query SpecialOffersWideCta {
    dataJson(id: {eq: "special-offers"}) {
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
