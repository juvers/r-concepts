/**@jsx jsx */
import {jsx, Text} from '@tishman/components';
import invariant from 'invariant';
import {BuyTicketsData, Step, CityPassCodes} from '~components/BuyTickets';
import {useMemo, useEffect, useState} from 'react';
import userStore from '~buy-tickets/store/user/userStore';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';

import type {Tickets, CityPassType} from '~components/BuyTickets';

const BuyTicketsCityPassStepBlock = ({
  data,
  stepNumber,
}: {
  stepNumber: number;
  data: BuyTicketsData;
}): JSX.Element => {
  const page = data.page;
  const [userState, setUserState] = useState(userStore.initialState);
  const [systemState, setSystemState] = useState(
    systemVariableStore.initialState,
  );

  invariant(page, 'Expected valid buy tickets page json');

  const maximumWebsiteCityPassRedemptions = (): number => {
    return systemState.systemVariables.find(
      (item: {Name: string; Value: number}) =>
        item.Name === 'MaximumWebsiteCityPassRedemptions',
    )?.Value;
  };

  const stepData = useMemo(() => {
    if (!page.ticketStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.ticketStep.title,
      description: page.ticketStep.description,
    };
  }, [page]);

  const convertCodeToTickets = () => {
    return userState.ticketSelectionList.reduce(
      (list: Tickets[], ticket: Tickets) => {
        const barcode = userState.redemptionCodes.filter(
          (t: CityPassType) => t.TicketTypeId === ticket.TicketTypeId,
        );
        if (barcode.length > 0) {
          list.push({...ticket, TicketCount: barcode.length});
        } else list.push(ticket);
        return list;
      },
      [],
    );
  };

  const Summary = (): JSX.Element => {
    return (
      userState.redemptionCodes.length &&
      userState.redemptionCodes.map((code: CityPassType) => (
        <Text key={code.CityPassBarcode}>{code.CityPassBarcode}</Text>
      ))
    );
  };

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const systemSub = systemVariableStore.subscribe(setSystemState);
    userSub.add(systemSub);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Step
      title={stepData.title}
      stepNumber={stepNumber}
      summary={<Summary />}
      showLoadingModal={
        userState.loading && userState.currentStep === stepNumber
      }
    >
      <CityPassCodes
        limit={maximumWebsiteCityPassRedemptions()}
        description={stepData.description}
        onContinue={() => {
          userStore.sendData({
            currentStep: userState.currentStep + 1,
            loading: true,
            ticketSelectionList: convertCodeToTickets(),
          });
        }}
      />
    </Step>
  );
};

export default BuyTicketsCityPassStepBlock;
