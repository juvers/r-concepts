/**@jsx jsx */
import {jsx, Text} from '@tishman/components';
import invariant from 'invariant';
import {format} from 'date-fns';
import {useMemo, useEffect, useState, Fragment} from 'react';
import {Step, TimeSlot} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import {TishmanAttraction} from '~buy-tickets/constants/constants';

import type {BuyTicketsData} from '~components/BuyTickets';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';

const BuyTicketsComboStepBlock = ({
  data,
  firstStepNumber,
  secondStepNumber,
}: {
  firstStepNumber: number;
  secondStepNumber: number;
  data: BuyTicketsData;
}): JSX.Element => {
  const page = data.page;
  const [userState, setUserState] = useState(userStore.initialState);
  const [systemState, setSystemState] = useState(
    systemVariableStore.initialState,
  );

  const minMinBeforeBooking = (): number => {
    return systemState.systemVariables.find(
      (item: {Name: string; Value: number}) =>
        item.Name === 'MinimumMinutesBeforeBookingTime',
    )?.Value;
  };

  const minMinTourBeforeDeck = (): number => {
    return systemState.systemVariables.find(
      (item: {Name: string; Value: number}) =>
        item.Name === 'MinimumMinutesWhenTourBeforeDeck',
    )?.Value;
  };

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const varSub = systemVariableStore.subscribe(setSystemState);
    userSub.add(varSub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (userState.currentStep === firstStepNumber)
      userStore.sendData({attraction: TishmanAttraction.RockefellerCenterTour});
    else if (userState.currentStep === secondStepNumber)
      userStore.sendData({
        attraction: TishmanAttraction.TopOfTheRockObservationDeck,
      });
  }, [userState.currentStep, firstStepNumber, secondStepNumber]);

  invariant(page, 'Expected valid buy tickets page json');

  const stepData = useMemo(() => {
    if (!page.comboStep.tour.title)
      throw new Error('Expected buy tickets page tour title');
    if (!page.comboStep.deck.title)
      throw new Error('Expected buy tickets page deck title');
    return {
      tourTitle: page.comboStep.tour.title,
      tourDescription: page.comboStep.tour.description,
      deckTitle: page.comboStep.deck.title,
      deckDescription: page.comboStep.deck.description,
    };
  }, [page]);

  const DeckSummary = (): JSX.Element => (
    <Text>{`${format(userState.datetime2, 'h:mmaaa')}${
      userState.isSunset ? ' (Sunset +$10)' : ''
    }`}</Text>
  );

  const TourSummary = (): JSX.Element => (
    <Text>{format(userState.datetime, 'h:mmaaa')}</Text>
  );

  return (
    <Fragment>
      <Step
        title={stepData.tourTitle}
        stepNumber={firstStepNumber}
        summary={userState.datetime ? <TourSummary /> : undefined}
        showLoadingModal={
          userState.currentStep === firstStepNumber && userState.loading
        }
      >
        <TimeSlot
          description={stepData.tourDescription}
          selectedDate={userState.datetime}
          minutesAheadAllowed={minMinBeforeBooking()}
          onUnavailable={() => {
            return;
          }}
          onContinue={(datetime: string | null, isSunset: boolean) => {
            if (datetime) {
              userStore.sendData({
                isSunset,
                datetime: new Date(datetime),
                currentStep: userState.currentStep + 1,
                attraction: TishmanAttraction.TopOfTheRockObservationDeck,
                loading: true,
              });
            }
          }}
        />
      </Step>
      <Step
        title={stepData.deckTitle}
        stepNumber={secondStepNumber}
        summary={userState.datetime ? <DeckSummary /> : undefined}
        showLoadingModal={
          userState.currentStep === secondStepNumber && userState.loading
        }
      >
        <TimeSlot
          description={stepData.deckDescription}
          selectedDate={userState.datetime2}
          minutesAheadAllowed={minMinTourBeforeDeck()}
          minutesAheadFrom={userState.datetime}
          onUnavailable={() => {
            return;
          }}
          onContinue={(datetime: string | null, isSunset: boolean) => {
            if (datetime) {
              userStore.sendData({
                isSunset,
                datetime2: new Date(datetime),
                currentStep: userState.currentStep + 1,
                attraction: TishmanAttraction.RockefellerCenterTour,
                loading: true,
              });
            }
          }}
        />
      </Step>
    </Fragment>
  );
};

export default BuyTicketsComboStepBlock;
