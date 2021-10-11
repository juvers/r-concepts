/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import TorFaqBlock from '~blocks/TorFaqBlock';
import TorHeroBlock from '~blocks/TorHeroBlock';
import TorReviewBlock from '~blocks/TorReviewBlock';
import TorWideCtaBlock from '~blocks/TorWideCtaBlock';
import TorCrossLinkBlock from '~blocks/TorCrossLinkBlock';
import TorTicketInfoBlock from '~blocks/TorTicketInfoBlock';
import JourneyToTheTopBlock from '~blocks/JourneyToTheTopBlock';
import TorTicketOfferingsBlock from '~blocks/TorTicketOfferingsBlock';
import TorFeaturedGalleryBlock from '~blocks/TorFeaturedGalleryBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import TorTicketComparisonToolBlock from '~blocks/TorTicketComparisonToolBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Top of the Rock',
  logo: 'Observation Deck',
  cta: {
    to: '/buy-tickets/#top-of-the-rock-observation-deck',
    label: 'Buy Tickets',
  },
};

export const AttractionTorMetaQuery = graphql`
  query AttractionTorMeta {
    meta: sanityAttractionTor {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function TopOfTheRockObservationDeckPage(): JSX.Element {
  return (
    <Layout theme="Top of the Rock">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Top of the Rock"
        cta={config.cta}
        links={[
          {url: '#ticket-offerings', label: 'Ticket Offerings'},
          {url: '#the-experience', label: 'The Experience'},
          {url: '#compare-tickets', label: 'Compare Tickets'},
          {url: '#faqs', label: 'FAQs'},
        ]}
      />
      <TorHeroBlock />
      <TorTicketOfferingsBlock id="ticket-offerings" theme="Top of the Rock" />
      <TorTicketInfoBlock />
      <TorWideCtaBlock theme="Top of the Rock" />
      <TorFeaturedGalleryBlock id="the-experience" theme="Top of the Rock" />
      <JourneyToTheTopBlock />
      <TorTicketComparisonToolBlock
        id="compare-tickets"
        theme="Top of the Rock Blue"
      />
      <TorReviewBlock theme="Top of the Rock Yellow" />
      <TorFaqBlock id="faqs" theme="Top of the Rock" />
      <ShareYourExperienceBlock
        theme="Top of the Rock Olive"
        hashTags={['#topoftherock']}
        labels={['topoftherock']}
      />
      <TorCrossLinkBlock theme="Top of the Rock" />
    </Layout>
  );
}
