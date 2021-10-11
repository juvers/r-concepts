/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const SHOP_DINE_WIDE_CTA_QUERY = graphql`
  query ShopDineWideCta {
    dataJson(id: {eq: "shop-and-dine"}) {
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

const ShopDineWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ShopDineWideCtaQuery>(
    SHOP_DINE_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Shop and Dine Wide Cta JSON data is required');
  const shopDineWideCtaData = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: [3, 5]}}>
        <WideCta {...shopDineWideCtaData} />
      </Container>
    </Section>
  );
};

export default ShopDineWideCtaBlock;
