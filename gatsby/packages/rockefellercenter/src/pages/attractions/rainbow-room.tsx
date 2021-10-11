/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import RainbowRoomHeroBlock from '~blocks/RainbowRoomHeroBlock';
import RainbowRoomCrossLinkBlock from '~blocks/RainbowRoomCrossLinkBlock';
import RainbowRoomFeaturedGalleryBlock from '~blocks/RainbowRoomFeaturedGalleryBlock';
import RainbowRoomCalloutGridBlock from '~blocks/RainbowRoomCalloutGridBlock';
import RainbowRoomFeaturedGallery2Block from '~blocks/RainbowRoomFeaturedGallery2Block';
import RainbowRoomHistoryBlock from '~blocks/RainbowRoomHistoryBlock';
import RainbowRoomPressBlock from '~blocks/RainbowRoomPressBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import RainbowRoomFeaturedEventsBlock from '~blocks/RainbowRoomFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rainbow Room',
  logoLink: null,
  pageName: null,
  cta: {to: '/contact/rainbow-room', label: 'Plan an Event'},
  rightNav: {to: 'https://www.diningclubrockcenter.com/', label: 'Dining Club'},
};

export const AttractionRainbowMetaQuery = graphql`
  query AttractionRainbowMeta {
    meta: sanityAttractionRainbow {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    events: sanityAttractionRainbow(
      _id: {eq: "rainbowRoom"}
      _type: {eq: "attraction.rainbow"}
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

export default function RainbowRoomPage({
  data: {
    events: {featuredEvents},
  },
}: {
  data: {events: {featuredEvents?: {id: string}[]}};
}): JSX.Element {
  const menuLinks = featuredEvents?.length
    ? [
        {url: '#public-events', label: 'Public Events'},
        {url: '#private-events', label: 'Private Events'},
        {url: '#private-dining', label: 'Private Dining'},
        {url: '#history', label: 'History'},
      ]
    : [
        {url: '#private-events', label: 'Private Events'},
        {url: '#private-dining', label: 'Private Dining'},
        {url: '#history', label: 'History'},
      ];

  return (
    <Layout theme="Rock Center Black">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Rainbow Room"
        cta={config.cta}
        links={menuLinks}
      />
      <RainbowRoomHeroBlock />
      <RainbowRoomFeaturedEventsBlock id="public-events" theme="Rock Center" />
      <RainbowRoomFeaturedGalleryBlock
        id="private-events"
        theme="Rock Center"
      />
      <RainbowRoomCalloutGridBlock id="private-dining" theme="Rock Center" />
      <RainbowRoomFeaturedGallery2Block theme="Rock Center" />
      <RainbowRoomPressBlock theme="Rock Center Cream" />
      <RainbowRoomHistoryBlock id="history" />
      <RainbowRoomCrossLinkBlock theme="Rock Center" />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#rainbowroom', '#rainbowroomnyc', '#barsixtyfive']}
        labels={['rainbowroom', 'rainbowroomnyc', 'barsixtyfive']}
      />
    </Layout>
  );
}
