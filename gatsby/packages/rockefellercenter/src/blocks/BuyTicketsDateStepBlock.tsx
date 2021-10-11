/**@jsx jsx */
import {jsx, Text} from '@tishman/components';
import invariant from 'invariant';
import {format} from 'date-fns';
import {useMemo, useEffect, useState, useCallback} from 'react';
import {useErrorHandler} from 'react-error-boundary';
import {Step, DatePicker} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import futureCapacityForecastStore from '~buy-tickets/store/odt/futureCapacityForecastStore';
import {getItem$} from '~buy-tickets/services/http-client';
import dateService from '~buy-tickets/services/date-service';

import type {BuyTicketsData} from '~components/BuyTickets';
import {useLocation} from '@reach/router';
const {getMonthStartDate, getOffsetDate} = dateService(12);

const BuyTicketsDateStepBlock = ({
  data,
  stepNumber,
}: {
  stepNumber: number;
  data: BuyTicketsData;
}): JSX.Element => {
  const location = useLocation();
  const page = data.page;
  const handleError = useErrorHandler();
  const [userState, setUserState] = useState(userStore.initialState);

  const getDates = useCallback(() => {
    getItem$(
      `FutureCapacityForecast?DateFrom=${getMonthStartDate}&DateTo=${getOffsetDate}&Attraction=${userState.attraction}`,
    ).subscribe((res) => {
      futureCapacityForecastStore.sendData(res);
      window.dataLayer.push({
        event: 'Continue Button Clicked',
        Step: '2: Date',
        Referrer: document.referrer || null,
        PageName: location.pathname,
        UTC: new Date().toUTCString(),
        Error: null,
        FromStep: 'Ticket Quantity',
      });
      userStore.sendData({loading: false});
    }),
      (error: Error) => {
        handleError(error);
        const errorCollection = {
          message: error.message,
          name: error.name,
          stack: error.stack,
        };
        window.dataLayer.push({
          event: 'Continue Button Clicked',
          Step: '2: Date',
          Referrer: document.referrer || null,
          PageName: location.pathname,
          UTC: new Date().toUTCString(),
          Error: JSON.stringify(errorCollection),
          FromStep: 'Ticket Quantity',
        });
      };
  }, [userState.attraction, location.pathname, handleError]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (userState.loading && userState.currentStep === stepNumber) {
      getDates();
    }
  }, [userState.loading, getDates, stepNumber, userState.currentStep]);

  invariant(page, 'Expected valid buy tickets page json');

  const stepData = useMemo(() => {
    if (!page.dateStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.dateStep.title,
      description: page.dateStep.description,
    };
  }, [page]);

  const Summary = (): JSX.Element => (
    <Text>{format(userState.date, 'MMMM dd, yyyy')}</Text>
  );

  return (
    <Step
      title={stepData.title}
      stepNumber={stepNumber}
      summary={userState.date ? <Summary /> : undefined}
      showLoadingModal={
        userState.loading && userState.currentStep === stepNumber
      }
    >
      <DatePicker
        selectedDate={userState.date}
        description={stepData.description}
        onContinue={(date: Date | undefined) => {
          if (date)
            userStore.sendData({
              date,
              currentStep: userState.currentStep + 1,
              loading: true,
            });
        }}
      />
    </Step>
  );
};

export default BuyTicketsDateStepBlock;
