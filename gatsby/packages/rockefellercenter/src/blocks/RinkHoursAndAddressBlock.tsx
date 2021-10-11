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

const RINK_HOURS_AND_ADDRESS_QUERY = graphql`
  query RinkHeroAndAddress {
    sanityAttractionRink(_id: {eq: "theRink"}, _type: {eq: "attraction.rink"}) {
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
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
      hero {
        contactLinkUrl
      }
    }
  }
`;

const RinkHoursAndAddressBlock = (): JSX.Element => {
  const {
    sanityAttractionRink,
    dataJson,
  } = useStaticQuery<GatsbyTypes.RinkHeroAndAddressQuery>(
    RINK_HOURS_AND_ADDRESS_QUERY,
  );

  invariant(dataJson, 'Rink JSON data is required!');

  const rinkHoursAndAddressProps = useMemo(() => {
    if (!sanityAttractionRink?.hour)
      throw new Error('Expected valid rink hour data');

    const hours = getHoursProps(sanityAttractionRink.hour);

    const location = getLocationProps(sanityAttractionRink?.location);

    if (!sanityAttractionRink?.contactsInfo)
      throw new Error('Expected rink contacts info');

    const contactsInfo = sanityAttractionRink.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      hours,
      location,
      contactsInfo,
      contactLinkUrl: dataJson.hero.contactLinkUrl,
    };
  }, [sanityAttractionRink, dataJson]);

  return (
    rinkHoursAndAddressProps && (
      <HoursAndAddress {...rinkHoursAndAddressProps} />
    )
  );
};

export default RinkHoursAndAddressBlock;
