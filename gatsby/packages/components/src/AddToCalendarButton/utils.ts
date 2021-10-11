import {format, parseISO} from 'date-fns';

export enum Calenders {
  GOOGLE = 'google',
  ICAL = 'iCal',
  OUTLOOK = 'outlook',
}

interface CalendarShareProps {
  description: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  timezone?: string;
  url: string;
}

/**
 * Takes an event object and a type of URL and returns either a calendar event
 * URL or the contents of an ics file.
 * @param {string} event.description
 * @param {string} event.endDateTime
 * @param {string} event.location
 * @param {string} event.startDateTime
 * @param {string} event.title
 * @param {string} event.timezone
 */
export const buildShareUrl = (
  {
    description = '',
    endDateTime,
    location = '',
    startDateTime,
    timezone = 'America/New_York',
    title = '',
    url,
  }: CalendarShareProps,
  type: Calenders,
): string => {
  const encodeURI = type === Calenders.GOOGLE;

  const data = {
    description: encodeURI ? encodeURIComponent(description) : description,
    endDateTime: formatDate(endDateTime),
    startDateTime: formatDate(startDateTime),
    location: encodeURI ? encodeURIComponent(location) : location,
    timezone,
    title: encodeURI ? encodeURIComponent(title) : title,
    url,
  };

  switch (type) {
    case Calenders.GOOGLE:
      return googleShareUrl(data);
    default:
      return buildShareFile(data);
  }
};

/**
 * Takes an event object and returns a Google Calendar Event URL
 * @param {string} event.description
 * @param {string} event.endDateTime
 * @param {string} event.location
 * @param {string} event.startDateTime
 * @param {string} event.title
 * @param {string} event.timezone
 * @returns {string} Google Calendar Event URL
 */

const googleShareUrl = ({
  description,
  endDateTime,
  location,
  startDateTime,
  timezone,
  title,
}: CalendarShareProps) =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDateTime}/${endDateTime}${
    timezone && `&ctz=${timezone}`
  }&location=${location}&text=${title}&details=${description}`;

/**
 * Converts ISO String with UTC timezone to date consumable by calendar
 * apps.
 * @param {string} ISO Date string
 * @returns {string} Date in YYYYMMDDTHHmmss format
 */

const formatDate = (date: string) => {
  return `${format(parseISO(date), 'yyyyMMdd')}T${format(
    parseISO(date),
    'HHmmss',
  )}`;
};

/**
 * Takes an event object and returns an array to be downloaded as ics file
 * @param {string} event.description
 * @param {string} event.endDateTime
 * @param {string} event.location
 * @param {string} event.startDateTime
 * @param {string} event.title
 * @param {string} event.timezone
 * @param {string} event.url
 * @returns {array} ICS Content
 */

const buildShareFile = ({
  description = '',
  endDateTime,
  location = '',
  startDateTime,
  timezone = 'America/New_York',
  title = '',
  url,
}: CalendarShareProps) => {
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `URL:${url}`,
    'METHOD:PUBLISH',
    timezone === ''
      ? `DTSTART:${startDateTime}`
      : `DTSTART;TZID=${timezone}:${startDateTime}`,
    timezone === ''
      ? `DTEND:${endDateTime}`
      : `DTEND;TZID=${timezone}:${endDateTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${escapeICSDescription(description)}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  return isMobile()
    ? encodeURI(`data:text/calendar;charset=utf8,${content}`)
    : content;
};

const isMobile = (): boolean => {
  if (typeof window !== 'undefined') {
    return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
      window.navigator.userAgent || window.navigator.vendor,
    );
  }
  return false;
};

export const isInternetExplorer = (): boolean => {
  if (typeof window !== 'undefined') {
    return (
      /MSIE/.test(window.navigator.userAgent) ||
      /Trident/.test(window.navigator.userAgent)
    );
  }
  return false;
};

const escapeICSDescription = (description: string): string =>
  description.replace(/(\r?\n|<br ?\/?>)/g, '\\n');
