/**@jsx jsx */
import {useCallback, useEffect, useState} from 'react';
import {getMonth, getYear} from 'date-fns';
import {
  SxStyleProp,
  jsx,
  Box,
  Flex,
  Text,
  CalendarArrow,
  UmbrellaSvg,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import futureCapacityForecastStore from '~buy-tickets/store/odt/futureCapacityForecastStore';
import {FutureCapacityForecast, ContinueButton} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';

export interface DatePickerProps {
  selectedDate?: Date;
  description?: string;
  onContinue: (date: Date | undefined) => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface dayProps {
  selected: boolean;
  enabled: boolean;
  day: number;
}

const generateCalendarData = (
  month: number,
  year: number,
  availability: FutureCapacityForecast[],
  selectedDate: Date | undefined,
) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  return {
    name: MONTHS[firstDayOfMonth.getMonth()],
    month: firstDayOfMonth.getMonth(),
    year: firstDayOfMonth.getFullYear(),
    startingDay: firstDayOfMonth.getDay(),
    length: lastDayOfMonth.getDate(),
    days: Array(lastDayOfMonth.getDate())
      .fill({
        selected: false,
        enabled: false,
      })
      .map((day: dayProps, i: number) => {
        const forecast = availability.find(
          (day) =>
            new Date(day.Date).toUTCString() ===
            new Date(year, month, i + 1).toUTCString(),
        );
        return {
          day: i + 1,
          selected: selectedDate
            ? new Date(year, month, i + 1).toUTCString() ===
              selectedDate.toUTCString()
            : false,
          enabled: forecast ? forecast.AvailableCapacity > 0 : false,
        };
      }),
  };
};

export const DatePicker = (props: DatePickerProps): JSX.Element => {
  const [, setUserState] = useState(userStore.initialState);
  const [forecastState, setForecastState] = useState(
    futureCapacityForecastStore.initialState,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    props.selectedDate,
  );
  const [selectedMonth, setSelectedMonth] = useState(
    props.selectedDate
      ? {
          month: getMonth(props.selectedDate),
          year: getYear(props.selectedDate),
        }
      : {
          month: new Date(Date.now()).getMonth(),
          year: new Date(Date.now()).getFullYear(),
        },
  );
  const [calendarData, setCalendarData] = useState({
    name: '',
    startingDay: 1,
    length: 30,
    days: Array(30).fill({selected: false, enabled: false}),
  });

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const forecastSub = futureCapacityForecastStore.subscribe(setForecastState);
    userSub.add(forecastSub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedDate) userStore.sendData({canContinue: true});
    else userStore.sendData({canContinue: false});
  }, [selectedDate]);

  useEffect(() => {
    setCalendarData(
      generateCalendarData(
        selectedMonth.month,
        selectedMonth.year,
        forecastState.FutureCapacityForecast,
        selectedDate,
      ),
    );
  }, [forecastState, selectedDate, selectedMonth]);

  const daysSx: SxStyleProp = {
    width: ['38px', '48px'],
    height: ['38px', '48px'],
    lineHeight: ['38px', '48px'],
    borderRadius: ['19px', '24px'],
    margin: ['0 4px 4px 0', '0 17px 17px 0'],
    fontSize: ['16px', '24px'],
    position: 'relative',
    textAlign: 'center',
    userSelect: 'none',
  };

  const daysOfWeekSx: SxStyleProp = {
    ...daysSx,
    cursor: 'pointer',
  };
  const daysOfMonthSx: SxStyleProp = {
    ...daysSx,
    cursor: 'pointer',
    background: '#d8d8d8',
    color: '#131415',
    ':hover': {
      background: '#000',
      color: '#fff',
    },
  };
  const daysOfMonthDisabledSx: SxStyleProp = {
    ...daysSx,
    cursor: 'pointer',
    background: '#EAEAEA',
    color: '#A9A9A9',
  };
  const daysOfMonthSelectedSx: SxStyleProp = {
    ...daysSx,
    cursor: 'pointer',
    background: '#d8d8d8',
    ':hover': {
      background: '#000',
      color: '#fff',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      background: 'transparent',
      border: 'solid 2px #000',
      width: ['42px', '60px'],
      height: ['42px', '60px'],
      top: ['-4px', '-8px'],
      left: ['-4px', '-8px'],
      borderRadius: '30px',
      opacity: 1.0,
    },
  };
  const spacerSx: SxStyleProp = {
    ...daysSx,
    opacity: 0,
  };

  const isCurrentOrPastMonth = (): boolean => {
    return (
      new Date(selectedMonth.year, selectedMonth.month, 1) <
      new Date(
        new Date(Date.now()).getFullYear(),
        new Date(Date.now()).getMonth() + 1,
        -1,
      )
    );
  };

  const getDateStyle = (day: dayProps): SxStyleProp => {
    if (day.selected) return daysOfMonthSelectedSx;
    if (day.enabled) return daysOfMonthSx;
    return daysOfMonthDisabledSx;
  };

  const getBackButtonStyle = (): SxStyleProp => {
    const style = {
      transform: 'scaleX(-1)',
      marginRight: 16,
      cursor: 'pointer',
    };

    if (isCurrentOrPastMonth()) return {...style, opacity: 0.5};
    return style;
  };

  const backMonth = (): void => {
    if (!isCurrentOrPastMonth())
      setSelectedMonth({
        month: selectedMonth.month == 1 ? 12 : selectedMonth.month - 1,
        year:
          selectedMonth.month == 1
            ? selectedMonth.year - 1
            : selectedMonth.year,
      });
  };

  const forwardMonth = (): void => {
    setSelectedMonth({
      month: selectedMonth.month == 12 ? 1 : selectedMonth.month + 1,
      year:
        selectedMonth.month == 12 ? selectedMonth.year + 1 : selectedMonth.year,
    });
  };

  const selectDate = useCallback(
    (selectedDay: number): void => {
      setSelectedDate(
        new Date(selectedMonth.year, selectedMonth.month, selectedDay),
      );
    },
    [selectedMonth],
  );

  const handleContinue = (): void => {
    return props.onContinue(selectedDate);
  };

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
      <Flex sx={{flexGrow: 1, mb: 3}}>
        <Text sx={{width: '286px'}}>{props.description}</Text>
        {props.description && (
          <ThemeProvider theme={getThemeByName('Top of the Rock Blue')}>
            <UmbrellaSvg
              sx={{transform: 'scale(0.56)', color: 'background', mt: -2}}
            />
          </ThemeProvider>
        )}
      </Flex>
      <Box
        sx={{
          width: '455px',
          margin: 0,
          mt: [4, 4, 4, -5],
        }}
      >
        <Flex
          sx={{
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text variant="mediumTitle">{calendarData.name}</Text>
          <Flex>
            <Box sx={getBackButtonStyle()} onClick={backMonth}>
              <CalendarArrow />
            </Box>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={forwardMonth}
            >
              <CalendarArrow />
            </Box>
          </Flex>
        </Flex>
        <Flex
          sx={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'left',
            alignItems: 'baseline',
            margin: 0,
            padding: 0,
          }}
        >
          <Box sx={daysOfWeekSx}>S</Box>
          <Box sx={daysOfWeekSx}>M</Box>
          <Box sx={daysOfWeekSx}>T</Box>
          <Box sx={daysOfWeekSx}>W</Box>
          <Box sx={daysOfWeekSx}>T</Box>
          <Box sx={daysOfWeekSx}>F</Box>
          <Box sx={daysOfWeekSx}>S</Box>
        </Flex>
        <Flex
          sx={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'left',
            alignItems: 'baseline',
            margin: 0,
            padding: 0,
          }}
        >
          {Array(calendarData.startingDay)
            .fill(null)
            .map((leadDay: null, i: number) => {
              return (
                <Box key={'blank-' + i} sx={spacerSx}>
                  &nbsp;
                </Box>
              );
            })}
          {calendarData.days.map((day: dayProps, i: number) => {
            return (
              <Box
                key={'day-' + i}
                sx={getDateStyle(day)}
                onClick={() => {
                  if (day.enabled) selectDate(day.day);
                }}
              >
                {day.day}
              </Box>
            );
          })}
        </Flex>
        <ContinueButton
          sx={{width: '100%', mt: 3}}
          handleClick={handleContinue}
        />
      </Box>
    </Box>
  );
};
