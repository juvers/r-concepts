/** @jsx jsx */
import {useState, useEffect} from 'react';
import {jsx, Box, Flex, Text, Divider, Spinner} from '@tishman/components';
import userStore from '~buy-tickets/store/user/userStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {getTicketDisplayTitle} from '~components/BuyTickets';

import type {Tickets} from '~components/BuyTickets';

const spaceBetween = {justifyContent: 'space-between', mb: 2};

export function RefundSummary(): JSX.Element {
  const [userState, setUserState] = useState(userStore.initialState);
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );
  const isRockPass = Boolean(allPostsState?.refund?.PackageList?.length);
  const ticketList = isRockPass
    ? allPostsState?.refund?.PackageList
    : allPostsState?.refund?.TicketList;

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(ticketSub, postsSub);
    return () => userSub.unsubscribe();
  }, []);

  return userState.loading && !userState.processPayment ? (
    <Spinner />
  ) : (
    <Box>
      <Text sx={{mt: [0, 4], mb: 3}} variant="rockCenterPageName">
        Order Summary
      </Text>
      {ticketList.map((ticket: Tickets) => {
        const apiTicket = isRockPass
          ? ticketState.PackageTypes.find(
              (t: Tickets) => t.PackageTypeId === ticket.PackageTypeId,
            )
          : ticketState.TicketTypes.find(
              (t: Tickets) => t.TicketTypeId === ticket.TicketTypeId,
            );

        return (
          <Flex
            key={isRockPass ? ticket.PackageTypeId : ticket.TicketTypeId}
            sx={spaceBetween}
          >
            <Text variant="largeP">
              {`${isRockPass ? ticket.PackageCount : ticket.TicketCount} ${
                isRockPass
                  ? apiTicket.PackageTypeName
                  : apiTicket.TicketTypeName
              } ${getTicketDisplayTitle(
                '',
                isRockPass ? ticket.PackageCount : ticket.TicketCount,
              )}`}
            </Text>
            <Text variant="largeP">
              $
              {isRockPass
                ? apiTicket.PackagePriceExcludingTax * ticket.PackageCount
                : apiTicket.TicketPriceExcludingTax * ticket.TicketCount}
            </Text>
          </Flex>
        );
      })}
      <Flex sx={{...spaceBetween, mb: 3}}>
        <Text variant="largeP">Taxes</Text>
        <Text variant="largeP">
          +${allPostsState.refund ? allPostsState.refund.RefundTaxValue : ''}
        </Text>
      </Flex>
      <Divider />
      <Flex sx={{...spaceBetween, mt: 3}}>
        <Text variant="executiveTitle">Total</Text>
        <Text variant="largeP" sx={{fontWeight: 'medium'}}>
          $
          {allPostsState.refund
            ? allPostsState.refund.RefundTotalIncludingTax
            : ''}
        </Text>
      </Flex>
    </Box>
  );
}
