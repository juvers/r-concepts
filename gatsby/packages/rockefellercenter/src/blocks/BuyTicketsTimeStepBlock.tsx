/**@jsx jsx */
import {jsx, Text} from '@tishman/components';
import invariant from 'invariant';
import {format} from 'date-fns';
import {useMemo, useEffect, useState} from 'react';
import {useErrorHandler} from 'react-error-boundary';
import {Step, TimeSlot} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import {
  SUNSET_ADD_ON_PRICE,
  TishmanFlow,
} from '~buy-tickets/constants/constants';

import type {BuyTicketsData} from '~components/BuyTickets';

const BuyTicketsTimeStepBlock = ({
  data,
  stepNumber,
}: {
  stepNumber: number;
  data: BuyTicketsData;
}): JSX.Element => {
  const page = data.page;
  const handleError = useErrorHandler();
  const [userState, setUserState] = useState(userStore.initialState);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  invariant(page, 'Expected valid buy tickets page json');

  const stepData = useMemo(() => {
    if (!page.timeStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.timeStep.title,
      description: page.timeStep.description,
    };
  }, [page]);

  const Summary = (): JSX.Element => (
    <Text>{`${format(userState.datetime, 'h:mmaaa')}${
      userState.isSunset ? ' (Sunset +$10)' : ''
    }`}</Text>
  );
  return (
    <Step
      title={stepData.title}
      stepNumber={stepNumber}
      summary={userState.datetime ? <Summary /> : undefined}
      showLoadingModal={
        userState.loading && userState.currentStep === stepNumber
      }
    >
      <TimeSlot
        description={stepData.description}
        selectedDate={userState.datetime}
        onUnavailable={() => {
          if (userState.flow === TishmanFlow.DECK) {
            handleError(new Error('ANYTIME'));
          }
          return;
        }}
        onContinue={(datetime: string | null, isSunset: boolean) => {
          if (datetime) {
            const sunsetPrice =
              userState.totalNumberOfTickets * SUNSET_ADD_ON_PRICE +
              userState.totalPrice;
            userStore.sendData({
              isSunset,
              datetime: new Date(datetime),
              currentStep: userState.currentStep + 1,
              totalPrice: isSunset ? sunsetPrice : userState.totalPrice,
              loading: true,
            });
            process.env.NODE_ENV === 'development'
              ? null
              : userState.flow === TishmanFlow.DECK ||
                userState.flow === TishmanFlow.TOUR
              ? handleError(new Error('UPSELL'))
              : null;
          }
        }}
      />
    </Step>
  );
};

export default BuyTicketsTimeStepBlock;
