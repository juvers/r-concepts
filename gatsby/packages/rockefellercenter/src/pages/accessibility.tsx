/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import AccessibilityPageBlock from '~blocks/AccessibilityPageBlock';
import {Layout} from '~layouts';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Accessibility and Inclusion',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const query = graphql`
  query AccessibilityMeta {
    meta: dataJson(id: {eq: "accessibility"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function AccessibilityPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Black">
      <AccessibilityPageBlock />
    </Layout>
  );
}
