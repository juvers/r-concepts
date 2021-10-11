/** @jsx jsx */
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import {jsx} from '@tishman/components';
import ArtandHistoryHeroBlock from '~blocks/ArtandHistoryHeroBlock';
import ArtandHistoryFeaturedGalleryBlock from '~blocks/ArtandHistoryFeaturedGalleryBlock';
import ArtandHistoryImageGridBlock from '~blocks/ArtandHistoryImageGridBlock';
import ArtandHistoryWideCtaBlock from '~blocks/ArtandHistoryWideCtaBlock';
import ArtandHistoryImageCalloutBlock from '~blocks/ArtandHistoryImageCalloutBlock';
import ArtandHistoryFeaturedGallery2Block from '~blocks/ArtandHistoryFeaturedGallery2Block';
import ArtandHistoryHistoryBlock from '~blocks/ArtandHistoryHistoryBlock';
import ArtandHistoryFeaturedEventsBlock from '~blocks/ArtandHistoryFeaturedEventsBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Art & History',
  cta: {to: '/buy-tickets/#rockefeller-center-tour', label: 'Buy Tickets'},
};

export const query = graphql`
  query ArtAndHistoryMeta {
    meta: dataJson(id: {eq: "art-and-history"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function ArtandHistoryLandingPage(): JSX.Element {
  return (
    <Layout>
      <ArtandHistoryHeroBlock
        id="art-and-history-hero"
        theme="Rock Center Black"
      />
      <ArtandHistoryFeaturedGalleryBlock
        id="art-and-history-featured-gallery"
        theme="Rock Center Cream"
      />
      <ArtandHistoryImageGridBlock
        id="art-and-history-image-grid"
        theme="Rock Center Cream"
      />
      <ArtandHistoryFeaturedGallery2Block
        id="art-and-history-featured-gallery2"
        theme="Rock Center"
      />
      <ArtandHistoryHistoryBlock
        id="art-and-history-history"
        theme="Rock Center Black"
      />
      <ArtandHistoryImageCalloutBlock
        id="art-and-history-image-callout"
        theme="Rock Center Rust"
      />
      <ArtandHistoryFeaturedEventsBlock
        id="art-and-history-featured-events"
        theme="Rock Center"
      />
      <ArtandHistoryWideCtaBlock
        id="art-and-history-wide-cta"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
