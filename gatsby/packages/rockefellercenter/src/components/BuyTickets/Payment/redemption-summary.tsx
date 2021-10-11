/** @jsx jsx */
import {useState, useEffect} from 'react';
import {format} from 'date-fns';
import {jsx, Box, Flex, Text, Spinner} from '@tishman/components';
import userStore from '~buy-tickets/store/user/userStore';
import {getTicketDisplayTitle} from '~components/BuyTickets';
import {TishmanFlow} from '~buy-tickets/constants/constants';

import type {TicketType} from '~components/BuyTickets';

const spaceBetween = {justifyContent: 'space-between', mb: 2};

export function RedemptionSummary(): JSX.Element {
  const [userState, setUserState] = useState(userStore.initialState);
  const isRockPass = userState.flow === TishmanFlow.ROCK_PASS;
  const ticketList = isRockPass
    ? userState.packageSelectionList
    : userState.ticketSelectionList;

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  const renderTimes = () => {
    return isRockPass ? (
      <Box sx={spaceBetween}>
        {userState.datetime && (
          <Text variant="largeP">{`${format(
            userState.datetime,
            'h:mmaaa',
          )}—Rock Center Tour`}</Text>
        )}
        {userState.datetime2 && (
          <Text variant="largeP">{`${format(
            userState.datetime2,
            'h:mmaaa',
          )}—Top of the Rock`}</Text>
        )}
      </Box>
    ) : (
      <Flex sx={spaceBetween}>
        {userState.datetime && (
          <Text variant="largeP">{`${format(userState.datetime, 'h:mmaaa')}${
            userState.isSunset ? ' (Sunset)' : ''
          }`}</Text>
        )}
      </Flex>
    );
  };

  return userState.loading && !userState.processPayment ? (
    <Spinner />
  ) : (
    <Box>
      <Text sx={{mt: [0, 4], mb: 3}} variant="rockCenterPageName">
        Order Summary
      </Text>
      {ticketList
        .filter((item: TicketType) => item.TicketCount > 0)
        .map((ticket: TicketType) => {
          return (
            <Flex key={ticket.TicketTypeId} sx={spaceBetween}>
              <Text variant="largeP" key={ticket.TicketTypeId}>
                {`${ticket.TicketCount} ${
                  ticket.TicketLabel
                } ${getTicketDisplayTitle(userState.flow, ticket.TicketCount)}`}
              </Text>
            </Flex>
          );
        })}
      <Flex sx={spaceBetween}>
        {userState.date && (
          <Text variant="largeP">{`${format(
            userState.date,
            'MMMM dd, yyyy',
          )}`}</Text>
        )}
      </Flex>
      {renderTimes()}
    </Box>
  );
}
