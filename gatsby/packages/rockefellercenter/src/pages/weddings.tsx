/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import WeddingsHeroBlock from '~blocks/WeddingsHeroBlock';
import WeddingsCalloutGridBlock from '~blocks/WeddingsCalloutGridBlock';
import WeddingsImageCalloutBlock from '~blocks/WeddingsImageCalloutBlock';
import WeddingsFeaturedGalleryBlock from '~blocks/WeddingsFeaturedGalleryBlock';
import WeddingsImageGridBlock from '~blocks/WeddingsImageGridBlock';
import WeddingsFeaturedGallery2Block from '~blocks/WeddingsFeaturedGallery2Block';
import WeddingsImageGrid2Block from '~blocks/WeddingsImageGrid2Block';
import WeddingsFeaturedStoriesBlock from '~blocks/WeddingsFeaturedStoriesBlock';
import WeddingsPressBlock from '~blocks/WeddingsPressBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  logo: 'Rockefeller Center',
  pageName: 'Weddings',
  cta: {
    to: '/contact/private-events',
    label: 'Plan Your Wedding',
  },
};

export const AttractionWeddingMetaQuery = graphql`
  query AttractionWeddingMeta {
    meta: sanityAttractionWedding {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function WeddingsPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Cream">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Weddings"
        cta={config.cta}
        links={[
          {url: '#rainbow-room', label: 'Rainbow Room'},
          {url: '#620-loft-and-garden', label: '620 Loft & Garden'},
          {url: '#elopement-packages', label: 'Elopement Packages'},
          {url: '#engagement-packages', label: 'Engagement Packages'},
          {url: '#press', label: 'Press'},
        ]}
      />
      <WeddingsHeroBlock />
      <WeddingsFeaturedGalleryBlock
        id="rainbow-room"
        theme="Rock Center Black"
      />
      <WeddingsImageGridBlock theme="Rock Center Black" />
      <WeddingsFeaturedGallery2Block
        id="620-loft-and-garden"
        theme="Rock Center"
      />
      <WeddingsImageGrid2Block theme="Rock Center" />
      <WeddingsImageCalloutBlock
        id="elopement-packages"
        theme="Rock Center Green"
      />
      <WeddingsCalloutGridBlock
        id="engagement-packages"
        theme="Rock Center Cream"
      />
      <WeddingsPressBlock id="press" theme="Rock Center Black" />
      <WeddingsFeaturedStoriesBlock theme="Rock Center Green" />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={[
          '#RockefellerCenterWeddings',
          '#RockCenterWeddings',
          '#RainbowRoomWeddings',
          '#620LoftWeddings',
        ]}
        labels={[
          'rockefellercenterweddings',
          'rockcenterweddings',
          'rainbowroomweddings',
          '620loftweddings',
        ]}
      />
    </Layout>
  );
}
