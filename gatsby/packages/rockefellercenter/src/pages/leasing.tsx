/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import LeasingContactBlock from '~blocks/LeasingContactBlock';
import LeasingFeaturedGalleryBlock from '~blocks/LeasingFeaturedGalleryBlock';
import LeasingIntroBlock from '~blocks/LeasingIntroBlock';
import LeasingCrossLinkBlock from '~blocks/LeasingCrossLinkBlock';
import LeasingCalloutCardGridBlock from '~blocks/LeasingCalloutCardGridBlock';
import LeasingWideCtaBlock from '~blocks/LeasingWideCtaBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: 'Leasing',
  cta: {
    to: '/leasing-newsletter',
    label: 'Subscribe Now',
  },
};

export const query = graphql`
  query LeasingMeta {
    meta: dataJson(id: {eq: "leasing"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function LeasingPage(): JSX.Element {
  return (
    <Layout theme="Rock Center">
      <LeasingIntroBlock id="leasing-intro" theme="Rock Center" />
      <LeasingFeaturedGalleryBlock
        id="leasing-featured-gallery"
        theme="Rock Center"
      />
      <LeasingCalloutCardGridBlock
        id="leasing-callout-grid"
        theme="Rock Center"
      />
      <LeasingContactBlock id="leasing-contact" />
      <LeasingWideCtaBlock id="leasing-wide-cta" theme="Rock Center" />
      <LeasingCrossLinkBlock
        id="leasing-cross-link"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
