import {TStringString} from '~buy-tickets/models/types';

// use default parameter offset of 1 should no parameter be passed
const d = new Date();
function dateService(offset = 1): TStringString {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const options: TStringString = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const estOptions: TStringString = {
    timeZone: 'America/New_York',
    // timeZoneName: 'short',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const getCurrentDate = d.toLocaleDateString('en-CA');
  const getMonthStartDate = new Date(year, month).toLocaleDateString('en-CA');
  const getOffsetDate = new Date(year, month + offset).toLocaleDateString(
    'en-CA',
  );
  const getDescriptiveDate = new Date(year, month + offset).toLocaleDateString(
    'en-CA',
    options,
  );
  const getEasternTime = new Intl.DateTimeFormat('en-CA', estOptions).format(d);
  return {
    getCurrentDate,
    getMonthStartDate,
    getOffsetDate,
    getDescriptiveDate,
    getEasternTime,
  };
}

export default dateService;
