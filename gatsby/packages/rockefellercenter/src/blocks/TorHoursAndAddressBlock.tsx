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

const TOR_HOURS_AND_ADDRESS_QUERY = graphql`
  query TorHeroAndAddress {
    sanityAttractionTor(
      _id: {eq: "topOfTheRock"}
      _type: {eq: "attraction.tor"}
    ) {
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
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      hero {
        contactLinkUrl
      }
    }
  }
`;

const TorHoursAndAddressBlock = (): JSX.Element => {
  const {
    sanityAttractionTor,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TorHeroAndAddressQuery>(
    TOR_HOURS_AND_ADDRESS_QUERY,
  );

  invariant(dataJson, 'Tor JSON data is required!');

  const torHoursAndAddressProps = useMemo(() => {
    if (!sanityAttractionTor?.hour)
      throw new Error('Expected valid TOR hour data');

    const hours = getHoursProps(sanityAttractionTor.hour);

    const location = getLocationProps(sanityAttractionTor?.location);

    if (!sanityAttractionTor?.contactsInfo)
      throw new Error('Expected TOR contacts info');

    const contactsInfo = sanityAttractionTor.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      hours,
      location,
      contactsInfo,
      contactLinkUrl: dataJson.hero.contactLinkUrl,
    };
  }, [sanityAttractionTor, dataJson]);

  return (
    torHoursAndAddressProps && <HoursAndAddress {...torHoursAndAddressProps} />
  );
};

export default TorHoursAndAddressBlock;
