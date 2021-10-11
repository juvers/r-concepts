/** @jsx jsx */
import {H} from '@hzdg/sectioning';
import {Link, ArrowLink, jsx, Box, Text} from '@tishman/components';
import {Fragment} from 'react';
import {format} from 'date-fns';

export interface ContactsInfoProps {
  /** info type, currently we support email and phone */
  type: string;
  /** info value, currently either email address or phone number */
  value: string;
}

export interface VirtualEventHoursAndAddressProps {
  /** Title above hours block */
  whenAndWhere?: string;
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

  /* ISO string formatt of start datetime */
  startDateTime: string;
  /* ISO string formatt of end datetime */
  endDateTime: string;

  admissionType: string;
}

const removeCharactersFromPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

const VirtualEventHoursAndAddress = ({
  whenAndWhere = `When & Where`,
  hours,
  location,
  contactsInfo,
  contactLinkUrl,
  startDateTime,
  admissionType,
}: VirtualEventHoursAndAddressProps): JSX.Element => {
  const startDate = new Date(startDateTime);
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
      <Box>
        <H
          sx={{
            variant: 'styles.h3',
            fontFamily: 'body',
            fontSize: 5,
            mb: 2,
          }}
        >
          {whenAndWhere}
        </H>
      </Box>
      <Box
        sx={{
          variant: 'text.body',
          fontSize: [2, 3],
          color: 'text',
        }}
      >
        {format(startDate, 'MMM d, yyyy')}
      </Box>
      {hours && (
        <Box>
          {hours.map((text) => (
            <Text key={text} variant={'hoursAndDirections'}>
              {text}
            </Text>
          ))}
        </Box>
      )}
      {(location || contactsInfo) && (
        <Box>
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
      {admissionType && (
        <Box>
          <Text key={admissionType} variant={'hoursAndDirections'}>
            {admissionType}
          </Text>
        </Box>
      )}
      {contactLinkUrl && <ArrowLink href={contactLinkUrl} label="Contact Us" />}
    </Box>
  );
};

export default VirtualEventHoursAndAddress;
