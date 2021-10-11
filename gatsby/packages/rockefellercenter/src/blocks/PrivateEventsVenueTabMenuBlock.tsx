/**@jsx jsx */
import {jsx} from '@tishman/components';
import {useLocation} from '@reach/router';
import PrivateEventsVenueGalleryBlock from '~blocks/PrivateEventsVenueGalleryBlock';
import PrivateEventsVenueFloorPlanBlock from '~blocks/PrivateEventsVenueFloorPlanBlock';
import PrivateEventsVenueSampleMenuBlock from '~blocks/PrivateEventsVenueSampleMenuBlock';
import PrivateEventsVenueVendorsBlock from '~blocks/PrivateEventsVenueVendorsBlock';
import PrivateEventsVenueCompareBlock from '~blocks/PrivateEventsVenueCompareBlock';

const PrivateEventsVenueTabMenuBlock = ({
  initialHash,
  data,
}: {
  initialHash:
    | '#photo-gallery'
    | '#floor-plan-capacities'
    | '#sample-menus'
    | '#vendors'
    | '#compare';
  data:
    | GatsbyTypes.sanityRainbowRoomVenueQuery
    | GatsbyTypes.sanityPrivateDiningVenueQuery
    | GatsbyTypes.sanitySixTwentyVenueQuery
    | GatsbyTypes.sanityBarSixtyFiveVenueQuery
    | GatsbyTypes.sanityGalleryVenueQuery;
}): JSX.Element | null => {
  switch (useLocation().hash ?? initialHash) {
    case '#photo-gallery':
      return <PrivateEventsVenueGalleryBlock data={data} />;
    case '#floor-plan-capacities':
      return <PrivateEventsVenueFloorPlanBlock data={data} />;
    case '#sample-menus':
      return <PrivateEventsVenueSampleMenuBlock data={data} />;
    case '#vendors':
      return <PrivateEventsVenueVendorsBlock data={data} />;
    case '#compare':
      return <PrivateEventsVenueCompareBlock data={data} />;
    default:
      return <PrivateEventsVenueGalleryBlock data={data} />;
  }
};

export default PrivateEventsVenueTabMenuBlock;
