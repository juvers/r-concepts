/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import ShopDineHeroBlock from '~blocks/ShopDineHeroBlock';
import ShopDineCalloutGridBlock from '~blocks/ShopDineCalloutGridBlock';
import ShopDineWideCtaBlock from '~blocks/ShopDineWideCtaBlock';
import ShopDineCalloutGridTwoBlock from '~blocks/ShopDineCalloutGridTwoBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Navy',
  pageName: 'Shop and Dine',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const query = graphql`
  query ShopDineMeta {
    meta: dataJson(id: {eq: "shop-and-dine"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function ShopDinePage(): JSX.Element {
  return (
    <Layout>
      <ShopDineHeroBlock id="shop-dine-hero" />
      <ShopDineCalloutGridBlock
        id="shop-dine-callout-grid"
        theme="Rock Center"
      />
      <ShopDineWideCtaBlock id="shop-dine-wide-cta" theme="Rock Center Cream" />
      <ShopDineCalloutGridTwoBlock
        id="shop-dine-callout-grid-2"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
