/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import CommunityHeroBlock from '~blocks/CommunityHeroBlock';
import CommunityFeaturedEventsBlock from '~blocks/CommunityFeaturedEventsBlock';
import CommunityImageCalloutBlock from '~blocks/CommunityImageCalloutBlock';
import CommunityCalloutCardGridBlock from '~blocks/CommunityCalloutCardGridBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: 'Community',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const CommunityMetaQuery = graphql`
  query CommunityMeta {
    meta: sanityCommunityLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function CommunityPage(): JSX.Element {
  return (
    <Layout theme="Rock Center">
      <CommunityHeroBlock id="community-intro" />
      <CommunityFeaturedEventsBlock id="community-featured-events" />
      <CommunityImageCalloutBlock id="community-image-callout" />
      <CommunityCalloutCardGridBlock
        id="community-callout-grid"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
