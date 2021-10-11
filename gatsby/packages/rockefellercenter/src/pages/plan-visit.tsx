/** @jsx jsx */
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import {jsx} from '@tishman/components';
import type {PageConfig} from '~PageConfig';
import PlanYourVisitBlock from '~blocks/PlanYourVisitBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import PlanYourVisitCrossLinkBlock from '~blocks/PlanYourVisitCrossLinkBlock';

export const config: PageConfig = {
  pageName: 'Plan Your Visit',
  theme: 'Rock Center Navy',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query PlanYourVisitMeta {
    meta: dataJson(id: {eq: "plan-your-visit"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function PlanYourVisitPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Navy">
      <PlanYourVisitBlock theme="Rock Center" />
      <PlanYourVisitCrossLinkBlock theme="Rock Center" />
      <ShareYourExperienceBlock
        id="share-your-experience"
        theme="Rock Center Cream"
        hashTags={[
          '#rockefellercenter',
          '#rockcenter',
          '#rockefellerplaza',
          '#topoftherock',
        ]}
        labels={[
          'rockefellercenter',
          'rockcenter',
          'rockefellerplaza',
          'topoftherock',
        ]}
      />
    </Layout>
  );
}
