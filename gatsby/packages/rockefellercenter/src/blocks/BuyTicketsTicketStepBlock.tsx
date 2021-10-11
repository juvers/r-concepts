/**@jsx jsx */
import {jsx, Text} from '@tishman/components';
import invariant from 'invariant';
import {useMemo, useEffect, useState, useCallback} from 'react';
import {
  TicketQuantity,
  Step,
  TicketLineData,
  getTicketDisplayTitle,
} from '~components/BuyTickets';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';
import userStore from '~buy-tickets/store/user/userStore';
import {TishmanFlow} from '~buy-tickets/constants/constants';

import type {BuyTicketsData, TicketType} from '~components/BuyTickets';
import {useLocation} from '@reach/router';
type ApiTicket = {
  TicketPriceExcludingTax: number;
  PackagePriceExcludingTax: number;
  TicketTypeId?: number;
  PackageTypeId?: number;
};

const BuyTicketsTicketStepBlock = ({
  data,
  hideLabel,
}: {
  hideLabel?: boolean;
  data: BuyTicketsData;
}): JSX.Element => {
  const location = useLocation();
  const [systemState, setSystemState] = useState(
    systemVariableStore.initialState,
  );
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);
  const [userState, setUserState] = useState(userStore.initialState);
  const page = data.page;
  const isRockPass = userState.flow === TishmanFlow.ROCK_PASS;
  const isCityPass =
    userState.flow === TishmanFlow.CITY_PASS ||
    userState.flow === TishmanFlow.C3;
  const ticketList = isRockPass
    ? userState.packageSelectionList
    : userState.ticketSelectionList;

  useEffect(() => {
    const systemSub = systemVariableStore.subscribe(setSystemState);
    const userSub = userStore.subscribe(setUserState);
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    systemSub.add(userSub, ticketSub);
    return () => systemSub.unsubscribe();
  }, [location]);

  invariant(page, 'Expected valid buy tickets page json');

  const getTicketTypes = useCallback(
    (tickets: TicketLineData[], list: ApiTicket[]) => {
      return tickets.reduce(
        (
          ticketList: TicketLineData[],
          ticket: Omit<TicketLineData, 'price'>,
        ) => {
          const apiTicket = list.find((item) => {
            if (isRockPass) return item.PackageTypeId === ticket.ticketTypeId;
            return item.TicketTypeId === ticket.ticketTypeId;
          });
          if (apiTicket)
            ticketList.push({
              ...ticket,
              price: isRockPass
                ? apiTicket.PackagePriceExcludingTax
                : apiTicket.TicketPriceExcludingTax,
            });
          return ticketList;
        },
        [] as TicketLineData[],
      );
    },
    [isRockPass],
  );

  const getTicketLimit = useCallback(() => {
    const ticketLimit = systemState.systemVariables.find(
      (item: {Name: string; Value: number}) =>
        item.Name === 'IndividualTicketLimit',
    );
    const bookletLimit = systemState.systemVariables.find(
      (item: {Name: string; Value: number}) =>
        item.Name === 'MaximumWebsiteCityPassRedemptions',
    );

    if (bookletLimit && ticketLimit)
      return isCityPass ? bookletLimit.Value : ticketLimit.Value;
    return 0;
  }, [systemState.systemVariables, isCityPass]);

  const stepData = useMemo(() => {
    if (!page.ticketStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.ticketStep.title,
      description: page.ticketStep.description,
      ticketTypes: getTicketTypes(
        page.ticketStep.ticketTypes,
        isRockPass ? ticketState.PackageTypes : ticketState.TicketTypes,
      ),
      individualTicketLimit: getTicketLimit(),
    };
  }, [page, ticketState, getTicketLimit, getTicketTypes, isRockPass]);

  const Summary = (): JSX.Element => {
    return (
      ticketList.length &&
      ticketList
        .filter((item: TicketType) => item.TicketCount > 0)
        .map((ticket: TicketType) => (
          <Text key={ticket.TicketTypeId}>
            {`${ticket.TicketCount} ${
              ticket.TicketLabel
            } ${getTicketDisplayTitle(userState.flow, ticket.TicketCount)}`}
          </Text>
        ))
    );
  };

  return (
    <Step
      stepNumber={1}
      title={stepData.title}
      summary={<Summary />}
      showLoadingModal={userState.loading && userState.currentStep === 1}
    >
      <TicketQuantity
        hideLabel={hideLabel}
        handleContinue={() => {
          userStore.sendData({
            currentStep: userState.currentStep + 1,
            loading: true,
            ticketsForAnalytics: stepData.ticketTypes,
          });
        }}
        description={stepData.description}
        limit={stepData.individualTicketLimit}
        ticketTypes={stepData.ticketTypes}
      />
    </Step>
  );
};

export default BuyTicketsTicketStepBlock;
