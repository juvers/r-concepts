/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import AtlasHeroBlock from '~blocks/AtlasHeroBlock';
import AtlasFeaturedStoryBlock from '~blocks/AtlasFeaturedStoryBlock';
import AtlasStoriesBlock from '~blocks/AtlasStoriesBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Green',
  logo: 'Rockefeller Center',
  pageName: 'The Center Magazine',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};
export const StoryLpMetaQuery = graphql`
  query StoryLpMeta {
    meta: sanityStoryLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function AtlasPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Green">
      <AtlasHeroBlock id="atlas-hero" />
      <AtlasFeaturedStoryBlock id="atlas-featured-story" />
      <AtlasStoriesBlock id="atlas-stories" cta={config.cta} />
      <ShareYourExperienceBlock
        id="share-your-experience"
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={['rockefellercenter', 'rockcenter', 'rockefellerplaza']}
      />
    </Layout>
  );
}
