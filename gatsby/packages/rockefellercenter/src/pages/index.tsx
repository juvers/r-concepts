/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import HomeHeroBlock from '~blocks/HomeHeroBlock';
import HomeFeaturedStoriesBlock from '~blocks/HomeFeaturedStoriesBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import HomeFeaturedEventsBlock from '~blocks/HomeFeaturedEventsBlock';
import HomeFlexSpaceBlock from '~blocks/HomeFlexSpaceBlock';
import OnlyHereBlock from '~blocks/OnlyHereBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  logoLink: null,
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const HomeMetaQuery = graphql`
  query HomeMeta {
    meta: sanityHomePage {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HomeHeroBlock id="home-hero" />
      <OnlyHereBlock id="home-only-here" theme="Rock Center Cream" />
      <HomeFeaturedEventsBlock />
      <HomeFlexSpaceBlock id="home-flex-space" />
      <HomeFeaturedStoriesBlock
        id="home-featured-stories"
        theme="Rock Center Navy"
      />
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
