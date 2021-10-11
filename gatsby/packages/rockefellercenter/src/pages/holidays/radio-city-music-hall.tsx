/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {Layout} from '~layouts';
import RadioCityMusicHallHeroBlock from '~blocks/RadioCityMusicHallHeroBlock';
import RadioCityMusicHallImageCalloutBlock from '~blocks/RadioCityMusicHallImageCalloutBlock';
import RadioCityMusicHallCalloutGridBlock from '~blocks/RadioCityMusicHallCalloutGridBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import RadioCityMusicHallCrossLinkBlock from '~blocks/RadioCityMusicHallCrossLinkBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Radio City Music Hall',
  cta: {
    to: 'https://www.rockettes.com/christmas/calendar/',
    label: 'Buy Tickets',
  },
};

export default function RockefellerCenterChristmasTreeLightingPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Black">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Radio City Music Hall"
        cta={config.cta}
        links={[
          {url: '#christmas-spectacular', label: 'Christmas Spectacular'},
          {url: '#stage-door-tour', label: 'Stage Door Tour'},
        ]}
      />
      <RadioCityMusicHallHeroBlock />
      <RadioCityMusicHallImageCalloutBlock
        id="christmas-spectacular"
        theme="Rock Center"
      />
      <RadioCityMusicHallCalloutGridBlock
        id="stage-door-tour"
        theme="The Rink"
      />
      <ShareYourExperienceBlock
        theme="Rock Center Lavender"
        hashTags={['#RockEats', '#RockShops', '#TopoftheRock', '#RockCenter']}
        labels={['RockEats', 'RockShops', 'TopoftheRock', 'RockCenter']}
      />
      <RadioCityMusicHallCrossLinkBlock
        id="radio-city-music-hall-cross-links"
        theme="Rock Center"
      />
    </Layout>
  );
}
