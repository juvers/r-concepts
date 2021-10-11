/** @jsx jsx */
import {jsx, HoursAndAddress} from '@tishman/components';
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {
  getHoursProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import invariant from 'invariant';

const TOUR_HOURS_AND_ADDRESS_QUERY = graphql`
  query TourHoursAndAddress {
    sanityAttractionRc(_id: {eq: "rcTour"}, _type: {eq: "attraction.rc"}) {
      hour {
        hours {
          day
          opensAt
          closesAt
        }
        hourText
      }
      location {
        title
        address1
        address2
      }
      contactsInfo {
        type
        value
      }
    }
    dataJson(id: {eq: "rockefeller-center-tour"}) {
      hero {
        contactLinkUrl
      }
    }
  }
`;

const RockCenterHoursAndAddressBlock = (): JSX.Element => {
  const {
    sanityAttractionRc,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TourHoursAndAddressQuery>(
    TOUR_HOURS_AND_ADDRESS_QUERY,
  );

  invariant(dataJson, 'Tour JSON data is required!');

  const tourHoursAndAddressProps = useMemo(() => {
    if (!sanityAttractionRc?.hour)
      throw new Error('Expected valid rock center hour data');

    const hours = getHoursProps(sanityAttractionRc.hour);

    const location = getLocationProps(sanityAttractionRc?.location);

    if (!sanityAttractionRc?.contactsInfo)
      throw new Error('Expected rock center contacts info');

    const contactsInfo = sanityAttractionRc.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      hours,
      location,
      contactsInfo,
      contactLinkUrl: dataJson.hero.contactLinkUrl,
    };
  }, [sanityAttractionRc, dataJson]);

  return (
    tourHoursAndAddressProps && (
      <HoursAndAddress {...tourHoursAndAddressProps} />
    )
  );
};

export default RockCenterHoursAndAddressBlock;
