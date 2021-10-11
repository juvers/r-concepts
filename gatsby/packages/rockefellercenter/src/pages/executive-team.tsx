/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import type {PageConfig} from '~PageConfig';
import ExecutiveIntroTextBlock from '~blocks/ExecutiveIntroTextBlock';
import ExecutiveCardBlock from '~blocks/ExecutiveCardBlock';
import ExecutiveCrossLinkBlock from '~blocks/ExecutiveCrossLinkBlock';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: 'Executive Team',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export default function ExecutiveLandingPage(): JSX.Element {
  return (
    <Layout>
      <ExecutiveIntroTextBlock />
      <ExecutiveCardBlock />
      <ExecutiveCrossLinkBlock theme="Rock Center Cream" />
    </Layout>
  );
}
