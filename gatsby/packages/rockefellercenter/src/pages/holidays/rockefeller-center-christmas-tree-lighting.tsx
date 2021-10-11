/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import TreeLightingEventHeroBlock from '~blocks/TreeLightingEventHeroBlock';
import TreeCalloutGridBlock from '~blocks/TreeCalloutGridBlock';
import TreeHistoryBlock from '~blocks/TreeHistoryBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import TreeLightingEventFeaturedStoriesBlock from '~blocks/TreeLightingEventFeaturedStoriesBlock';
import TreeLightingEventFaqBlock from '~blocks/TreeLightingEventFaqBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Green',
  pageName: 'The Christmas Tree Lighting',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const query = graphql`
  query RockefellerCenterChristmasTreeLightingMeta {
    meta: sanityEventTreeLighting {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function RockefellerCenterChristmasTreeLightingPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Green">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Tree Lighting"
        cta={config.cta}
        links={[
          {url: '#viewing-details', label: 'Viewing Details'},
          {url: '#tree-history', label: 'Tree History'},
          {url: '#faqs', label: 'FAQs'},
        ]}
      />
      <TreeLightingEventHeroBlock />
      <TreeHistoryBlock id="tree-history" />
      <TreeLightingEventFaqBlock id="faqs" theme="Rock Center" />
      <TreeCalloutGridBlock theme="Rock Center Black" />
      <TreeLightingEventFeaturedStoriesBlock />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={['rockefellercenter', 'rockcenter', 'rockefellerplaza']}
      />
    </Layout>
  );
}
