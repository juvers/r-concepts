/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import NewsAndUpdatesListBlock from '~blocks/NewsAndUpdatesListBlock';
import NewsAndUpdatesHeroBlock from '~blocks/NewsAndUpdatesHeroBlock';

import {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'News & Updates',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export default function NewsAndUpdates(): JSX.Element {
  return (
    <Layout theme="Rock Center Black">
      <NewsAndUpdatesHeroBlock />
      <NewsAndUpdatesListBlock />
    </Layout>
  );
}
