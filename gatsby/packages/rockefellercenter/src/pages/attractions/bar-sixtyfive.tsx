/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import BarSixtyFiveHeroBlock from '~blocks/BarSixtyFiveHeroBlock';
/** import BarSixtyFiveBeforeYouGoBlock from '~blocks/BarSixtyFiveBeforeYouGoBlock'; */
import BarSixtyFiveCalloutGridBlock from '~blocks/BarSixtyFiveCalloutGridBlock';
import BarSixtyFiveImageCalloutBlock from '~blocks/BarSixtyFiveImageCalloutBlock';
import BarSixtyFiveCrossLinkBlock from '~blocks/BarSixtyFiveCrossLinkBlock';
import BarSixtyFiveFeaturedStoriesBlock from '~blocks/BarSixtyFiveFeaturedStoriesBlock';
import BarSixtyFivePressBlock from '~blocks/BarSixtyFivePressBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import BarSixtyFiveFeaturedEventsBlock from '~blocks/BarSixtyFiveFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rainbow Room',
  pageName: 'Bar SixtyFive',
  logoLink: {to: '/attractions/rainbow-room', label: 'Rainbow Room'},
  cta: {to: '/contact/rainbow-room', label: 'Inquire'},
};

export const AttractionBarMetaQuery = graphql`
  query AttractionBarMeta {
    meta: sanityAttractionBar {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    events: sanityAttractionBar(
      _id: {eq: "bar65"}
      _type: {eq: "attraction.bar"}
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

export default function BarSixtyFivePage({
  data: {
    events: {featuredEvents},
  },
}: {
  data: {events: {featuredEvents?: {id: string}[]}};
}): JSX.Element {
  const menuLinks = featuredEvents?.length
    ? [
        {url: '#upcoming-events', label: 'Upcoming Events'},
        {url: '#menus', label: 'Menus'},
        {url: '#private-events', label: 'Private Events'},
      ]
    : [
        {url: '#menus', label: 'Menus'},
        {url: '#private-events', label: 'Private Events'},
      ];

  return (
    <Layout theme="Rock Center Black">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Bar SixtyFive"
        cta={config.cta}
        links={menuLinks}
      />
      <BarSixtyFiveHeroBlock />
      {/* <BarSixtyFiveBeforeYouGoBlock />  */}
      <BarSixtyFiveFeaturedEventsBlock
        id="upcoming-events"
        theme="Rock Center"
      />
      <BarSixtyFiveCalloutGridBlock id="menus" theme="Rock Center" />
      <BarSixtyFiveImageCalloutBlock id="private-events" theme="Rock Center" />
      <BarSixtyFivePressBlock theme="Rock Center Cream" />
      <BarSixtyFiveFeaturedStoriesBlock theme="Rock Center Black" />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#barsixtyfive', '#rainbowroom']}
        labels={['barsixtyfive', 'rainbowroom']}
      />
      <BarSixtyFiveCrossLinkBlock theme="Rock Center" />
    </Layout>
  );
}
