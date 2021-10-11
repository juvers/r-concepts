/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import CultureHeroBlock from '~blocks/CultureHeroBlock';
import CultureCalloutCardGridBlock from '~blocks/CultureCalloutCardGridBlock';
import CultureFeaturedStoriesBlock from '~blocks/CultureFeaturedStoriesBlock';
import CultureFeaturedEventsBlock from '~blocks/CultureFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: 'Culture',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const CultureMetaQuery = graphql`
  query CultureMeta {
    meta: sanityCultureLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function CulturePage(): JSX.Element {
  return (
    <Layout theme="Rock Center">
      <CultureHeroBlock id="culture-hero" theme="Rock Center" />
      <CultureCalloutCardGridBlock
        id="culture-callout-grid"
        theme="Rock Center"
      />
      <CultureFeaturedStoriesBlock
        id="culture-featured-stories"
        theme="Rock Center Green"
      />
      <CultureFeaturedEventsBlock
        id="culture-featured-events"
        theme="Rock Center"
      />
    </Layout>
  );
}
