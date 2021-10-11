/**@jsx jsx */
import {
  jsx,
  Flex,
  Text,
  FaceBookIconSmallSvg,
  TwitterIconSmallSvg,
  MailIcon,
  Link,
  AddToCalendarButton,
} from '@tishman/components';
import {
  addHours,
  getHours,
  getMinutes,
  getYear,
  getDate,
  getMonth,
  formatISO,
} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {TishmanFlow} from '~buy-tickets/constants/constants';

interface ShareTripProps {
  flow: string;
  datetime: Date;
}

function formatUrl(flow: string) {
  const baseUrl = 'https://rockefellercenter.com/buy-tickets';
  switch (flow) {
    case TishmanFlow.DECK:
      return `${baseUrl}/top-of-the-rock`;
    case TishmanFlow.TOUR:
      return `${baseUrl}/rock-center-tour`;
    case TishmanFlow.VIP:
      return `${baseUrl}/vip`;
    case TishmanFlow.ROCK_PASS:
      return `${baseUrl}/rock-pass`;
    case TishmanFlow.CITY_PASS:
      return `${baseUrl}/citypass`;
    case TishmanFlow.C3:
      return `${baseUrl}/c3`;
    default:
      return baseUrl;
  }
}

export const ShareTrip = ({flow, datetime}: ShareTripProps): JSX.Element => {
  const subject = encodeURIComponent(`Let's Take a Trip to the Top`);
  const body = encodeURIComponent(
    `Hi Friend -\n\nA visit to New York isn’t complete without a trip to Top of the Rock and Rockefeller Center. Spend the day exploring with me – buy your ticket online!\n\nwww.topoftherocknyc.com | www.rockefellercenter.com`,
  );
  const title = 'Visit to Top of the Rock';
  const location =
    'Rockefeller Center, 30 Rockefeller Plaza, New York, NY 10112';
  const description = formatUrl(flow);
  const startTime = formatISO(utcToZonedTime(datetime, 'America/New_York'));
  const endTime =
    getHours(datetime) === 0 && getMinutes(datetime) === 0
      ? formatISO(
          utcToZonedTime(
            new Date(
              getYear(datetime),
              getMonth(datetime),
              getDate(datetime),
              21,
              10,
              0,
            ),
            'America/New_York',
          ),
        )
      : formatISO(utcToZonedTime(addHours(datetime, 1), 'America/New_York'));

  return (
    <Flex
      sx={{
        mt: [2, 0],
        width: 152,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Text sx={{letterSpacing: 2, pt: 2}}>Share your trip</Text>
      <Flex sx={{justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Link to={`mailto:?subject=${subject}&body=${body}`}>
          <MailIcon />
        </Link>
        <AddToCalendarButton
          icon
          description={description}
          title={title}
          startDateTime={startTime}
          endDateTime={endTime}
          location={location}
          url={description}
        />
        <Link to="https://www.facebook.com/sharer.php?u=https://www.rockefellercenter.com/buy-tickets/">
          <FaceBookIconSmallSvg />
        </Link>
        <Link to="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.rockefellercenter.com%2Fbuy-tickets%2F&text=I%E2%80%99m%20going%20to%20see%20the%20view%20from%20%23TopOfTheRock%20at%20Rockefeller%20Center.%20">
          <TwitterIconSmallSvg />
        </Link>
      </Flex>
    </Flex>
  );
};
