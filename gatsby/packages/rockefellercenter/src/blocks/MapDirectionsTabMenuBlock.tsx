/**@jsx jsx */
import {jsx} from '@tishman/components';
import {useLocation} from '@reach/router';
import {Fragment} from 'react';
import DirectionsHeroBlock from './DirectionsHeroBlock';
import DirectionsSubwayBlock from './DirectionsSubwayBlock';
import DirectionsBusBlock from './DirectionsBusBlock';
import DirectionsCitiBikeBlock from './DirectionsCitiBikeBlock';
import DirectionsCrossLinkBlock from './DirectionsCrossLinkBlock';
import DirectionsStaticIllustrationBlock from './DirectionsStaticIllustrationBlock';
import DirectionsFaqBlock from './DirectionsFaqBlock';
import RockefellerCenterMapBlock from './RockefellerCenterMapBlock';

const MapDirectionsTabMenuBlock = ({
  initialHash,
}: {
  initialHash: '#directions' | '#map';
}): JSX.Element | null => {
  switch (useLocation().hash ?? initialHash) {
    case '#directions':
      return (
        <Fragment>
          <DirectionsHeroBlock id="directions-hero" theme="Rock Center Cream" />
          <DirectionsSubwayBlock
            id="directions-subway"
            theme="Rock Center Cream"
          />
          <DirectionsBusBlock id="directions-bus" theme="Rock Center Cream" />
          <DirectionsCitiBikeBlock
            id="directions-citi-bike"
            theme="Rock Center Cream"
          />
          <DirectionsStaticIllustrationBlock
            id="directions-static-illustration"
            theme="Rock Center Cream"
          />
          <DirectionsFaqBlock id="directions-faq" theme="Rock Center Cream" />
          <DirectionsCrossLinkBlock
            id="directions-cross-link"
            theme="Rock Center"
          />
        </Fragment>
      );
    case '#map':
      return (
        <RockefellerCenterMapBlock
          id="rockefeller-center-map-block"
          theme="Rock Center Cream"
        />
      );
    default:
      return null;
  }
};

export default MapDirectionsTabMenuBlock;
