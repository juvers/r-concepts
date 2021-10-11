export const stripTimeFromDates = (datestring: string): string => {
  const strp = datestring?.split(' ');
  if (typeof strp[0] !== 'undefined' && typeof strp[1] !== 'undefined') {
    return strp[0] + ' ' + strp[1].replace(',', '');
  }
  return datestring;
};
