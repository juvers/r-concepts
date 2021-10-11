import {ContactsInfoProps} from '@tishman/components';

export const getContactsInfoProps = (
  contact?: Pick<GatsbyTypes.SanityContactInfo, 'type' | 'value'>,
): ContactsInfoProps => {
  if (!contact) throw new Error('Expected TOR contacts info');
  if (!contact?.type) throw new Error('Expected TOR contacts info type');
  if (!contact?.value) throw new Error('Expected TOR contacts info value');
  return {
    type: contact.type,
    value: contact.value,
  };
};
