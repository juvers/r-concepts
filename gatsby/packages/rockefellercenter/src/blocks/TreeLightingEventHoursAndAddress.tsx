/** @jsx jsx */
import {H} from '@hzdg/sectioning';
import {Link, ArrowLink, jsx, Box, Text} from '@tishman/components';
import {Fragment} from 'react';

export interface ContactsInfoProps {
  /** info type, currently we support email and phone */
  type: string;
  /** info value, currently either email address or phone number */
  value: string;
}

export interface TreeLightingEventHoursAndAddressProps {
  /** Title above hours block */
  hoursHeading?: string;
  /** Array of hours text,
   * use getHoursProps() to format sanity hours data  */
  hours?: string[] | null;
  /**
   * Title above address block.
   *
   * if not provided, hours block will not be rendered */
  /**
   * String containing broadcast information
   * if not provided, broadcast block will not be rendered
   */
  broadcastInfo?: string | string[] | null;
  broadcastInfoHeading?: string;
  addressHeading?: string;
  /** location object
   *
   * if both location and contactsInfo are not provided,
   * address block will not be rendered
   */
  location?: {
    /** google map url  */
    url?: string;
    /** location title  */
    title?: string;
    /** street address */
    address1?: string;
    /** city, state, zip address */
    address2?: string;
  };
  /**
   * contactsInfo is a sanity object
   * which we loop through and add phone and email links
   *
   * if both location and contactsInfo are not provided,
   * address block will not be rendered
   *  */
  contactsInfo?: ContactsInfoProps[];
  /** The url for the contactUs link */
  contactLinkUrl?: string;
}

const removeCharactersFromPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

const TreeLightingEventHoursAndAddress = ({
  hoursHeading = `Visiting Hours`,
  hours,
  broadcastInfoHeading = `Broadcast Info`,
  broadcastInfo,
  addressHeading = `Contact & Directions`,
  location,
  contactsInfo,
  contactLinkUrl,
}: TreeLightingEventHoursAndAddressProps): JSX.Element => {
  const linkStyles = {
    variant: 'text.hoursAndDirections',
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  const addressElement = location && (
    <Fragment>
      {location.address1 && (
        <Text variant={'hoursAndDirections'}>{location.address1}</Text>
      )}
      {location.address2 && (
        <Text variant={'hoursAndDirections'}>{location.address2}</Text>
      )}
    </Fragment>
  );

  return (
    <Box sx={{flexShrink: 0, maxWidth: 250}}>
      {hours && (
        <Box
          sx={{
            mb: 4,
          }}
        >
          <H
            sx={{
              variant: 'styles.h3',
              fontFamily: 'body',
              mb: 2,
            }}
          >
            {hoursHeading}
          </H>
          {hours.map((text) => (
            <Text key={text} variant={'hoursAndDirections'}>
              {text}
            </Text>
          ))}
        </Box>
      )}
      {broadcastInfo && (
        <Box
          sx={{
            mb: 4,
          }}
        >
          <H
            sx={{
              variant: 'styles.h3',
              fontFamily: 'body',
              mb: 2,
            }}
          >
            {broadcastInfoHeading}
          </H>
          <Text key="treelighting-broadcastinfo" variant={'hoursAndDirections'}>
            {broadcastInfo}
          </Text>
        </Box>
      )}
      {(location || contactsInfo) && (
        <Box
          sx={{
            mb: 4,
          }}
        >
          <H
            sx={{
              variant: 'styles.h3',
              fontFamily: 'body',
              mb: 2,
            }}
          >
            {addressHeading}
          </H>

          {location?.url ? (
            <Link sx={linkStyles} href={location.url} target={'_blank'}>
              {addressElement}
            </Link>
          ) : (
            addressElement
          )}

          {contactsInfo &&
            contactsInfo.map((contact) =>
              contact.type === 'phone' ? (
                <Link
                  key={contact.value}
                  sx={linkStyles}
                  href={`tel:+1${removeCharactersFromPhone(contact.value)}`}
                >
                  {contact.value}
                </Link>
              ) : (
                <Link
                  key={contact.value}
                  sx={linkStyles}
                  href={`mailto:${contact.value}`}
                >
                  {contact.value}
                </Link>
              ),
            )}
        </Box>
      )}
      {contactLinkUrl && <ArrowLink href={contactLinkUrl} label="Contact Us" />}
    </Box>
  );
};

export default TreeLightingEventHoursAndAddress;
