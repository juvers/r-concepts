/**@jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Text,
  SunsetIcon,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import {useState, useEffect, useCallback} from 'react';
import {format} from 'date-fns';
import {useErrorHandler} from 'react-error-boundary';
import Select from './Select/index';
import {getItem$} from '~buy-tickets/services/http-client';
import deckCapacityStore from '~buy-tickets/store/odt/deckCapacityStore';
import tourCapacityStore from '~buy-tickets/store/odt/tourCapacityStore';
import userStore from '~buy-tickets/store/user/userStore';
import {ContinueButton, useIsMounted} from '~components/BuyTickets';
import {TishmanFlow} from '~buy-tickets/constants/constants';

interface IRecreatedData {
  FullTime: string;
  HourTime: string;
  MinuteTime: string;
}

interface IData {
  StartDateTime: string;
  EndDateTime: string;
  AvailableCapacity: number;
  TotalCapacity: number;
  IsSunsetTimeslot: boolean;
}

export interface TimeSlotProps {
  description: string;
  onContinue: (timeSlot: string | null, isSunset: boolean) => void;
  onUnavailable: () => void;
  selectedDate?: string;
  minutesAheadAllowed?: number;
  minutesAheadFrom?: Date;
}

const extractTime = (x: string) => {
  const fullTime = new Date(x).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  const hourTime =
    fullTime.slice(0, fullTime.indexOf(':')) +
    fullTime.slice(fullTime.indexOf(' '));

  const minuteTime = fullTime.slice(fullTime.indexOf(':'));
  return {
    FullTime: fullTime,
    HourTime: hourTime,
    MinuteTime: minuteTime,
  };
};

const recreateData = (arr: Array<IData>) => {
  return arr
    .map((x) => {
      return {
        ...x,
        ...extractTime(x.StartDateTime),
      };
    })
    .reduce(
      (
        acc: Record<string, Array<IData | IRecreatedData>>,
        curr: IRecreatedData,
      ) => {
        const key = curr.HourTime;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      },
      {},
    );
};

export const TimeSlot = (props: TimeSlotProps): JSX.Element => {
  const isMounted = useIsMounted();
  const handleError = useErrorHandler();
  const [deckCapacityState, setDeckCapacityState] = useState(
    deckCapacityStore.initialState,
  );
  const [tourCapacityState, setTourCapacityState] = useState(
    tourCapacityStore.initialState,
  );

  const [userState, setUserState] = useState(userStore.initialState);

  const loadData = useCallback(async () => {
    if (userState.date && userState.attraction === 1) {
      getItem$(
        `DeckCapacity?DateTime=${format(userState.date, 'yyyy-MM-dd')}`,
      ).subscribe(
        (res) => {
          userStore.sendData({loading: false});
          deckCapacityStore.sendData(res);
          window.dataLayer.push({
            event: 'Continue Button Clicked',
            Step: '3: Time',
            Referrer: document.referrer || null,
            PageName: location.pathname,
            UTC: new Date().toUTCString(),
            Error: null,
            FromStep: 'Date',
          });
        },
        (error) => {
          window.dataLayer.push({
            event: 'Continue Button Clicked',
            Step: '3: Time',
            Referrer: document.referrer || null,
            PageName: location.pathname,
            UTC: new Date().toUTCString(),
            Error: JSON.stringify(error),
            FromStep: 'Date',
          });
          handleError(error);
        },
      );
    } else if (userState.date && userState.attraction === 2) {
      getItem$(
        `TourCapacity?DateTime=${format(userState.date, 'yyyy-MM-dd')}`,
      ).subscribe(
        (res) => {
          userStore.sendData({loading: false});
          tourCapacityStore.sendData(res);
        },
        (error) => {
          handleError(error);
        },
      );
    }
  }, [userState.date, userState.attraction, handleError]);

  const [selectedMinute, setSelectedMinute] = useState<null | string>(null);
  const [isSunset, setIsSunset] = useState(false);
  const setSunsetIndicator = (timeslot: Record<string, string>) => {
    if (
      userState.flow === TishmanFlow.DECK ||
      userState.flow === TishmanFlow.ROCK_PASS ||
      userState.flow === TishmanFlow.REDEMPTION
    ) {
      setIsSunset(Boolean(timeslot.IsSunsetTimeslot));
    }
    setSelectedMinute(timeslot.StartDateTime);
  };

  useEffect(() => {
    if (isMounted()) {
      loadData();
    }
  }, [isMounted, loadData]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const deckCapacitySub = deckCapacityStore.subscribe(setDeckCapacityState);
    const tourCapacitySub = tourCapacityStore.subscribe(setTourCapacityState);
    userSub.add(deckCapacitySub, tourCapacitySub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedMinute ?? props.selectedDate)
      userStore.sendData({canContinue: true});
    else userStore.sendData({canContinue: false});
  }, [selectedMinute, props.selectedDate]);

  const handleContinue = () => {
    props.onContinue(selectedMinute, isSunset);
  };

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
      <Flex sx={{flexGrow: 1}}>
        <Text sx={{width: '286px'}}>{props.description}</Text>
        {props.description ? (
          userState.flow !== TishmanFlow.ROCK_PASS ? (
            <ThemeProvider theme={getThemeByName('Top of the Rock Yellow')}>
              <SunsetIcon sx={{color: 'background'}} />
            </ThemeProvider>
          ) : null
        ) : null}
      </Flex>
      <Box
        sx={{
          width: '300px',
          margin: 0,
          mt: [4, 4, -5],
        }}
      >
        <Select
          hourData={Object.keys(
            recreateData(
              userState.attraction === 1
                ? deckCapacityState.DeckCapacity
                : tourCapacityState.TourCapacity,
            ),
          )}
          minuteData={recreateData(
            userState.attraction === 1
              ? deckCapacityState.DeckCapacity
              : tourCapacityState.TourCapacity,
          )}
          onMinuteChanged={setSunsetIndicator}
          onUnavailable={props.onUnavailable}
          selectedDate={props.selectedDate}
          flow={userState.flow}
          minutesAheadFrom={props.minutesAheadFrom}
          minutesAheadAllowed={props.minutesAheadAllowed}
        />
        <ContinueButton
          sx={{width: '100%', mt: 4}}
          handleClick={handleContinue}
        />
      </Box>
      {isSunset ? (
        <Box sx={{width: '70px'}}>
          <SunsetIcon
            style={{
              width: '70px',
              color: '#FFD758',
              fontWeight: 500,
            }}
          />
          <Box sx={{textAlign: 'center', fontWeight: 500, fontSize: '14px'}}>
            Sunset
          </Box>
        </Box>
      ) : (
        <Box sx={{width: '70px'}}></Box>
      )}
    </Box>
  );
};
