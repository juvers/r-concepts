/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import HistoryHeroBlock from '~blocks/HistoryHeroBlock';
import HistoryHistoryBlock from '~blocks/HistoryHistoryBlock';
import HistoryWideCtaBlock from '~blocks/HistoryWideCtaBlock';
import HistoryImageCalloutBlock from '~blocks/HistoryImageCalloutBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'History',
  cta: {to: '/buy-tickets#rockefeller-center-tour', label: 'Buy Tickets'},
};

export const query = graphql`
  query HistoryMeta {
    meta: dataJson(id: {eq: "history"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function HistoryPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Black">
      <HistoryHeroBlock id="history-hero" />
      <HistoryHistoryBlock id="history-history" />
      <HistoryWideCtaBlock id="history-wide-cta" />
      <HistoryImageCalloutBlock
        id="history-image-callout"
        theme="Rock Center"
      />
      <ShareYourExperienceBlock
        id="history-share-your-experience"
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={['rockefellercenter', 'rockcenter', 'rockefellerplaza']}
      />
    </Layout>
  );
}
