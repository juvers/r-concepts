/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import PartnershipIntroBlock from '~blocks/PartnershipIntroBlock';
import PartnershipCalloutCardGridBlock from '~blocks/PartnershipCalloutCardGridBlock';
import PartnershipImageCalloutBlock from '~blocks/PartnershipImageCalloutBlock';
import PartnershipThreeColGridBlock from '~blocks/PartnershipThreeColGridBlock';
import PartnershipInquiryFormBlock from '~blocks/PartnershipInquiryFormBlock';
import PartnershipWideCtaBlock from '~blocks/PartnershipWideCtaBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Navy',
  logo: 'Rockefeller Center',
  pageName: 'Partnerships',
  cta: {
    to: '/contact/partnerships',
    label: 'Inquire',
  },
};

export const query = graphql`
  query PartnershipMeta {
    meta: dataJson(id: {eq: "partnerships"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function PartnershipsPage(): JSX.Element {
  return (
    <Layout theme="Rock Center">
      <PartnershipIntroBlock id="partnership-intro" theme="Rock Center Navy" />
      <PartnershipCalloutCardGridBlock
        id="partnership-callout-card-grid"
        theme="Rock Center Cream"
      />
      <PartnershipThreeColGridBlock id="tour-three-col-grid" />
      <PartnershipInquiryFormBlock theme="Rock Center Green" />
      <PartnershipWideCtaBlock theme="Rock Center" id="partnership-wide-cta" />
      <PartnershipImageCalloutBlock
        id="partnership-image-callout"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
