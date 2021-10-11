import {HoursAndAddressProps} from '@tishman/components';

export const getLocationProps = (
  location?: Pick<
    GatsbyTypes.SanityLocation,
    'title' | 'address1' | 'address2'
  >,
): HoursAndAddressProps['location'] => {
  if (!location) throw new Error('Expected valid location data');
  // location.title is optional hence not throwing error
  if (!location?.address1) throw new Error('Expected valid address 1 data');
  if (!location?.address2) throw new Error('Expected valid address 2 data');

  return {
    title: location?.title,
    address1: location?.address1,
    address2: location?.address2,
  };
};
