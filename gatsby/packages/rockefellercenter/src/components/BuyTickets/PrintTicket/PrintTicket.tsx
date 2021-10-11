/**@jsx jsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {jsx, Box} from '@tishman/components';
import {useEffect, useState, forwardRef} from 'react';
import {format, parseISO} from 'date-fns';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import {SingleTicket} from '~components/BuyTickets';

import type {ComponentPropsWithRef} from 'react';

interface TicketImageData {
  TicketTypeId: number;
  IsDisplayImage: boolean;
  ImageUrl: string;
}

export const PrintTicket = forwardRef(function PrintTicket(
  props,
  ref?: ComponentPropsWithRef<'div'>['ref'],
): JSX.Element {
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);

  const datetime =
    allPostsState?.sale?.TourDateTime ?? allPostsState?.sale?.DeckDateTime;
  const ticketList = allPostsState?.sale?.PackageSelectionList.length
    ? allPostsState?.sale?.PackageSelectionList
    : allPostsState?.sale?.TicketSelectionList;

  const oneTicket = allPostsState.ticket?.length ? null : allPostsState.ticket;

  const getTicketData = (ticket: any) => {
    const ticketImage: {ImageUrl: string} =
      ticketState.TicketTypeImages &&
      ticketState.TicketTypeImages.find((item: TicketImageData) => {
        return item.TicketTypeId === ticket.TicketTypeId && item.IsDisplayImage;
      });
    const ticketTypeName = [1, 2, 3].includes(ticket.TicketTypeId)
      ? 'Top of the Rock'
      : null;

    const day = format(parseISO(ticket.ValidFrom), 'EEEE');
    const date = format(parseISO(ticket.ValidFrom), 'MMMM dd, yyyy');
    const time = `${format(parseISO(ticket.ValidFrom), 'h:mm a')} - ${format(
      parseISO(ticket.ValidTo),
      'h:mm a',
    )}`;

    return {
      ticketImage,
      ticketTypeName,
      day,
      date,
      time,
    };
  };

  const renderOne = (ticket: any): JSX.Element => {
    const {ticketTypeName, day, date, time, ticketImage} = getTicketData(
      ticket,
    );
    return (
      <SingleTicket
        ticketName={ticket.TicketTypeName}
        ticketName2={ticketTypeName}
        ticketNumber={ticket.TicketBarcode}
        day={day}
        date={date}
        time={time}
        datetime={datetime}
        ticketList={ticketList}
        imageUrl={ticketImage?.ImageUrl}
      />
    );
  };

  useEffect(() => {
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    const userSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(ticketSub);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        mt: 5,
        '@media print': {
          mt: 0,
          transform: 'scale(0.87)',
        },
      }}
    >
      {oneTicket
        ? renderOne(oneTicket)
        : allPostsState?.ticket?.map((ticket: any, index: number) => {
            const {
              ticketTypeName,
              day,
              date,
              time,
              ticketImage,
            } = getTicketData(ticket);
            return (
              <SingleTicket
                offset={1350 * index}
                key={ticket.TicketId}
                ticketName={ticket.TicketTypeName}
                ticketName2={ticketTypeName}
                ticketNumber={ticket.TicketBarcode}
                day={day}
                date={date}
                time={time}
                datetime={datetime}
                ticketList={ticketList}
                imageUrl={ticketImage?.ImageUrl}
              />
            );
          })}
    </Box>
  );
});
