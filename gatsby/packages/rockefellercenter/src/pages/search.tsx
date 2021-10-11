/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import {SearchFormBlock} from '~blocks/SearchFormBlock';
import {SearchResultsBlock} from '~blocks/SearchResultsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rockefeller Center',
  pageName: 'Search Results',
  hideSearchToggleButton: true,
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query SearchMeta {
    meta: dataJson(id: {eq: "search"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function Search(): JSX.Element {
  return (
    <Layout>
      <SearchFormBlock />
      <SearchResultsBlock />
    </Layout>
  );
}
