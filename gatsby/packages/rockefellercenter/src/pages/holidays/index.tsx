/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import HolidaysHeroBlock from '~blocks/HolidaysHeroBlock';
import HolidaysWideCtaBlock from '~blocks/HolidaysWideCtaBlock';
import HolidaysImageCalloutBlock from '~blocks/HolidaysImageCalloutBlock';
import HolidaysCalloutGridBlock from '~blocks/HolidaysCalloutGridBlock';
import HolidaysCrossLinkBlock from '~blocks/HolidaysCrossLinkBlock';
import HolidaysFeaturedStoriesBlock from '~blocks/HolidaysFeaturedStoriesBlock';
import HolidaysPressBlock from '~blocks/HolidaysPressBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import HolidaysFeaturedEventsBlock from '~blocks/HolidaysFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Navy',
  pageName: 'The Holidays',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const AttractionHolidaysQuery = graphql`
  query AttractionHolidays {
    events: sanityAttractionHoliday(
      _id: {eq: "theHolidays"}
      _type: {eq: "attraction.holiday"}
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

export default function HolidaysPage({
  data: {
    events: {featuredEvents},
  },
}: {
  data: {events: {featuredEvents?: {id: string}[]}};
}): JSX.Element {
  const menuLinks = featuredEvents?.length
    ? [
        {url: '#upcoming-events', label: 'Upcoming Events'},
        {url: '#christmas-tree', label: 'The Christmas Tree'},
        {
          url: '#christmas-at-rockefeller-center',
          label: 'Christmas at Rockefeller Center',
        },
        {url: '#gift-shop', label: 'Gift Shop'},
      ]
    : [
        {url: '#christmas-tree', label: 'The Christmas Tree'},
        {
          url: '#christmas-at-rockefeller-center',
          label: 'Christmas at Rockefeller Center',
        },
        {url: '#gift-shop', label: 'Gift Shop'},
      ];

  return (
    <Layout theme="Rock Center Navy">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore The Holidays"
        cta={config.cta}
        links={menuLinks}
      />
      <HolidaysHeroBlock />
      <HolidaysFeaturedEventsBlock id="upcoming-events" theme="Rock Center" />
      <HolidaysImageCalloutBlock
        id="christmas-tree"
        theme="Rock Center Green"
      />
      <HolidaysCalloutGridBlock
        id="christmas-at-rockefeller-center"
        theme="Rock Center Cream"
      />
      <HolidaysWideCtaBlock id="gift-shop" theme="Rock Center" />
      <HolidaysPressBlock theme="Rock Center Green" />
      <HolidaysFeaturedStoriesBlock theme="Rock Center Black" />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={[
          'rockcenterxmas',
          'rockefellercenter',
          'rockcenter',
          'rockefellerplaza',
        ]}
      />
      <HolidaysCrossLinkBlock id="holidays-cross-links" theme="Rock Center" />
    </Layout>
  );
}
