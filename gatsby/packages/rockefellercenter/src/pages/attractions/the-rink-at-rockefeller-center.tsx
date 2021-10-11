/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';

import RinkHeroBlock from '~blocks/RinkHeroBlock';
import RinkFaqBlock from '~blocks/RinkFaqBlock';
import RinkWideCtaBlock from '~blocks/RinkWideCtaBlock';
import RinkTicketOfferingsBlock from '~blocks/RinkTicketOfferingsBlock';
import RinkCalloutGridBlock from '~blocks/RinkCalloutGridBlock';
import RinkCrossLinkBlock from '~blocks/RinkCrossLinkBlock';
import RinkHistoryBlock from '~blocks/RinkHistoryBlock';
import RinkFeaturedEventsBlock from '~blocks/RinkFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'The Rink Navy',
  logo: 'The Rink',
  logoLink: null,
  cta: {
    to: '/the-center-newsletter',
    label: 'Subscribe Now',
  },
};

export const AttractionRinkMetaQuery = graphql`
  query AttractionRinkMeta {
    meta: sanityAttractionRink {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    events: sanityAttractionRink(
      _id: {eq: "theRink"}
      _type: {eq: "attraction.rink"}
    ) {
      featuredEvents {
        ... on SanityEventTreeLighting {
          id
        }
        ... on SanityEvent {
          id
        }
      }
    }
  }
`;

export default function TheRinkAtRockefellerCenterPage({
  data: {
    events: {featuredEvents},
  },
}: {
  data: {events: {featuredEvents?: {id: string}[]}};
}): JSX.Element {
  const menuLinks = featuredEvents?.length
    ? [
        {url: '#ticket-packages', label: 'Ticket Packages'},
        {url: '#events', label: 'Events'},
        {url: '#experiences', label: 'Experiences'},
        {url: '#history', label: 'History'},
        {url: '#faqs', label: 'FAQs'},
      ]
    : [
        {url: '#ticket-packages', label: 'Ticket Packages'},
        {url: '#experiences', label: 'Experiences'},
        {url: '#history', label: 'History'},
        {url: '#faqs', label: 'FAQs'},
      ];

  return (
    <Layout theme="The Rink Navy">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore the Rink"
        rightNav={{to: '/contact/rink-private-events', label: 'Plan an Event'}}
        cta={config.cta}
        links={menuLinks}
      />
      <RinkHeroBlock theme="The Rink Navy" />
      <RinkTicketOfferingsBlock id="ticket-packages" theme="The Rink" />
      <RinkWideCtaBlock theme="The Rink" />
      <RinkFeaturedEventsBlock id="events" theme="The Rink" />
      <RinkCalloutGridBlock id="experiences" theme="The Rink" />
      <RinkHistoryBlock id="history" theme="The Rink Navy" />
      <RinkFaqBlock id="faqs" theme="The Rink" />
      <RinkCrossLinkBlock theme="The Rink Blue" />
    </Layout>
  );
}
