import {format} from 'date-fns';
/**
 * Get Pretty Time String
 *
 * Utility function
 * Hours and Address component requires a lot of massaging
 * of time strings.
 * Problem 1 is all time strings are in 24 hours
 * problem 2 is time picker wont let you enter 24:00
 * This function will format all these types correctly
 * @param time
 *
 */
export const getPrettyTimeString = (time: string): string => {
  let [hour, minute] = time.split(':').map(Number);
  // use case 23:59 should be 24:00
  if (hour === 23 && minute === 59) {
    minute = 0;
    hour = hour + 1;
  }
  // if 16:00 => 4pm, if 16:30 => 4:30pm
  const pattern = minute === 0 ? 'ha' : 'h:mma';
  return format(new Date(0, 0, 1, hour, minute), pattern).toLowerCase();
};

type SanityHourDataProps = {
  hourText?: string;
  hours?: ReadonlyArray<
    | Pick<GatsbyTypes.SanityDayAndTime, 'day' | 'opensAt' | 'closesAt'>
    | undefined
  >;
};

/**
 * Get Hours Props
 *
 * This function takes in sanity hours structured data
 * and manipulates it to match what is shown in designs
 * it is very opinionated for this use case.
 *
 * it will
 * * format days in order from Monday to Sunday
 *
 * * format times to be:
 *   * change 24 hour time to 12 hour
 *   * `hour`:`minutes`(if not 00)`am||pm` 4pm, 4:30pm
 *   * if sanity time is 23:59, change to `12am`
 *
 * * format day time string to be `Monday: 4pm-10:30pm`
 *
 * * if times match previous day, combine
 *   * `Monday: 4pm-10:30pm`, `Tuesday: 4pm-10:30pm` = `Monday-Tuesday: 4pm-10:30pm`
 *
 * * if final array contains `Monday-Sunday: 4pm-10:30pm`
 *   * Change to `Daily from 4pm-10:30pm`
 *
 * * Lastly if sanityHourData contains hourText string
 *   * add to end of hours array so it will render with rest of the data
 *
 * @param sanityHourData data from sanity
 * @return hours = array of formatted hours strings
 */
export const getHoursProps = (
  sanityHourData: SanityHourDataProps,
): string[] => {
  // days of the week array
  // opinionated as we are forcing days to be Monday to Sunday
  // regardless of sanity hours data order
  if (!sanityHourData.hours?.length) {
    return sanityHourData.hourText
      ? [sanityHourData.hourText]
      : ([] as string[]);
  }

  const daysOfTheWeek = [
    {
      day: 'Monday',
      times: '',
    },
    {
      day: 'Tuesday',
      times: '',
    },
    {
      day: 'Wednesday',
      times: '',
    },
    {
      day: 'Thursday',
      times: '',
    },
    {
      day: 'Friday',
      times: '',
    },
    {
      day: 'Saturday',
      times: '',
    },
    {
      day: 'Sunday',
      times: '',
    },
  ];
  // First Loop through days of the week and add sanity values to each item.
  // if there is no sanity hours for a given day, assume it is closed
  // else format the time to match designs
  daysOfTheWeek.map((item) => {
    const sanityHours =
      sanityHourData.hours &&
      sanityHourData.hours.find((h) => h?.day === item.day);
    if (!sanityHours) {
      item.times = 'Closed';
    } else {
      const opensAt =
        sanityHours?.opensAt && getPrettyTimeString(sanityHours.opensAt);
      const closesAt =
        sanityHours?.closesAt && getPrettyTimeString(sanityHours.closesAt);
      item.times = opensAt && closesAt ? `${opensAt}–${closesAt}` : '';
    }
    return item;
  });

  // Next, loop through daysOfTheWeek and combine days together if they have the same times
  // if they do not match prevItem, add to hours array
  // else overwrite previous item to include the current item in loop
  let prevItem = {day: '', times: ''};
  const hours: string[] = [];

  daysOfTheWeek.map((item) => {
    if (item.times !== prevItem.times) {
      // add new item
      hours.push(`${item.day}: ${item.times}`);
      prevItem = item;
    } else {
      // overwrite previous item including new day
      // ie Monday-Tuesday: 4:30pm–12am
      hours[
        hours.length - 1
      ] = `${prevItem.day}-${item.day}: ${prevItem.times}`;
    }
  });

  // Next, if there is only one item in array and it has string Monday-Sunday
  // replace Monday-Sunday: with Daily from since its every day
  if (hours.length === 1 && hours[0].includes('Monday-Sunday:')) {
    hours[0] = hours[0].replace('Monday-Sunday:', 'Daily from');
  }
  // Lastly, if there is additional hourText, add to end of hours array
  sanityHourData.hourText && hours.push(sanityHourData.hourText);

  // return the nicely formatted array to render on the front end.
  return hours;
};
