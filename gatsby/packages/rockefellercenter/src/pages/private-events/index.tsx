/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import PrivateEventsHeroBlock from '~blocks/PrivateEventsHeroBlock';
import PrivateEventsCalloutGridBlock from '~blocks/PrivateEventsCalloutGridBlock';
import PrivateEventsImageCallout2Block from '~blocks/PrivateEventsImageCallout2Block';
import PrivateEventsCrossLinkBlock from '~blocks/PrivateEventsCrossLinkBlock';
import PrivateEventsImageCalloutBlock from '~blocks/PrivateEventsImageCalloutBlock';
import PrivateEventsFeaturedStoriesBlock from '~blocks/PrivateEventsFeaturedStoriesBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  pageName: 'Private Events',
  cta: {to: '/contact/private-events', label: 'Plan an Event'},
};

export const query = graphql`
  query PrivateEventsLPMeta {
    meta: dataJson(id: {eq: "private-events"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function PrivateEventsPage(): JSX.Element {
  return (
    <Layout>
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Private Events"
        cta={config.cta}
        links={[
          {url: '#620-loft-garden', label: '620 Loft & Garden'},
          {url: '#rainbow-room-venues', label: 'Rainbow Room Venues'},
          {url: '#the-rink', label: 'The Rink'},
        ]}
      />
      <PrivateEventsHeroBlock />
      <PrivateEventsImageCalloutBlock
        id="620-loft-garden"
        theme="Rock Center Black"
      />
      <PrivateEventsCalloutGridBlock
        id="rainbow-room-venues"
        theme="Rock Center Cream"
      />
      <PrivateEventsImageCallout2Block id="the-rink" theme="Rock Center" />
      <PrivateEventsFeaturedStoriesBlock theme="Rock Center Green" />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={[
          '#rainbowroom',
          '#620loftandgarden',
          '#rainbowroomwedding',
          '#620loftandgardenwedding',
        ]}
        labels={[
          'rainbowroom',
          '620loftandgarden',
          'rainbowroomwedding',
          '620loftandgardenwedding',
        ]}
      />
      <PrivateEventsCrossLinkBlock theme="Rock Center" />
    </Layout>
  );
}
