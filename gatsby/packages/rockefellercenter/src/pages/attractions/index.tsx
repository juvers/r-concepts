/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import OnlyHereHeroBlock from '~blocks/OnlyHereHeroBlock';
import OnlyHereCalloutGridBlock from '~blocks/OnlyHereCalloutGridBlock';
import OnlyHereCrossLinkBlock from '~blocks/OnlyHereCrossLinkBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  pageName: 'Only Here',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const query = graphql`
  query OnlyHereMeta {
    meta: dataJson(id: {eq: "only-here"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function AttractionsPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Cream">
      <OnlyHereHeroBlock id="only-here-intro-text" theme="Rock Center Cream" />
      <OnlyHereCalloutGridBlock
        id="only-here-callout-grid"
        theme="Rock Center Cream"
      />
      <OnlyHereCrossLinkBlock id="only-here-cross-link" theme="Rock Center" />
    </Layout>
  );
}
