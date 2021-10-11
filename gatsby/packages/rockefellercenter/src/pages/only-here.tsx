/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import OnlyHereHeroBlock from '~blocks/OnlyHereHeroBlock';
import OnlyHereCalloutGridBlock from '~blocks/OnlyHereCalloutGridBlock';
import OnlyHereCrossLinkBlock from '~blocks/OnlyHereCrossLinkBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query OnlyHereMeta2 {
    meta: dataJson(id: {eq: "only-here"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function OnlyHerePage(): JSX.Element {
  return (
    <Layout>
      <OnlyHereHeroBlock id="only-here-intro-text" theme="Rock Center Black" />
      <OnlyHereCalloutGridBlock
        id="only-here-callout-grid"
        theme="Rock Center Black"
      />
      <OnlyHereCrossLinkBlock
        id="only-here-cross-link"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
