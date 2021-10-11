/**@jsx jsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {jsx, Flex, Box, SxStyleProp, Text} from '@tishman/components';
import {Fragment, useEffect, useState} from 'react';
import {format, getHours, getMinutes, parseISO} from 'date-fns';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';

import type {Tickets} from '~components/BuyTickets';

interface TicketData extends Tickets {
  TicketTypeName: string;
  ChargeAmountExcludingTax: number;
}

interface ReceiptProps {
  datetime: string;
  ticketList: Array<Tickets>;
}

const LineItem = (props: {
  leftText: string;
  rightText: string;
  itemSx?: SxStyleProp;
}): JSX.Element => {
  return (
    <Flex
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        py: 1,
        ...props.itemSx,
      }}
    >
      <Box sx={{fontWeight: 500}}>{props.leftText}</Box>
      <Box sx={{textAlign: 'right'}}>{props.rightText}</Box>
    </Flex>
  );
};

const itemWithDividerSx: SxStyleProp = {
  pb: 3,
  mb: 3,
  borderBottom: 'solid 1px #777',
  '@media print': {
    pb: '5.5px',
  },
};

const LEGAL_SYSTEM_VARIABLES = [2201, -1103];
const CITYPASS_TICKET_TYPES = [72, 73, 98, 99];

export const PrintReceipt = ({
  ticketList,
  datetime,
}: ReceiptProps): JSX.Element => {
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );
  const [systemState, setSystemState] = useState(
    systemVariableStore.initialState,
  );
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);

  const transactionType = (): string => {
    if (datetime) {
      return `${getHours(parseISO(datetime))}` === '00' &&
        `${getMinutes(parseISO(datetime))}` === '00'
        ? 'Unscheduled Ticket'
        : 'Scheduled Ticket';
    }
    return 'Unscheduled';
  };

  const renderLegal = (): JSX.Element[] => {
    return systemState.systemVariables
      .filter((item: any) =>
        LEGAL_SYSTEM_VARIABLES.includes(item.SystemVariableId),
      )
      .reverse()
      .map((item: any) => (
        <Text
          key={item.Name}
          sx={{
            fontSize: 0,
            my: 2,
            '@media print': {
              fontSize: '8px',
            },
          }}
        >
          {item.Value.split(/\\n+/g).map((str: string, i: number) => (
            <p key={item.SystemVariableId + i} sx={{my: 2}}>
              {str}
            </p>
          ))}
        </Text>
      ));
  };

  useEffect(() => {
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    const userSub = allPostsStore.subscribe(setAllPostsState);
    const varSub = systemVariableStore.subscribe(setSystemState);
    ticketSub.add(userSub, varSub);
    return () => ticketSub.unsubscribe();
  }, []);

  return (
    <Box
      id="printTicketBody"
      sx={{
        visibility:
          ticketList &&
          ticketList.some((x) => CITYPASS_TICKET_TYPES.includes(x.TicketTypeId))
            ? 'hidden'
            : 'visible',
        p: [2, 4, 6],
        '@media print': {
          py: 4,
          pr: 4,
          pl: 5,
        },
      }}
    >
      <Text
        variant="mediumTitle"
        sx={{paddingBottom: 3, borderBottom: 'solid 1px #777', marginBottom: 3}}
      >
        Your Receipt
      </Text>
      <LineItem
        leftText="Order Number:"
        rightText={allPostsState?.sale?.SaleBarcode}
      />
      <LineItem leftText="Transaction:" rightText={transactionType()} />
      <LineItem
        itemSx={itemWithDividerSx}
        leftText="Date:"
        rightText={datetime ? format(parseISO(datetime), 'MM/dd/yyyy') : ''}
      />
      {ticketList &&
        allPostsState.ticket &&
        ticketList.map((ticket: Tickets) => {
          const isRockPass = Boolean(ticket.PackageTypeId);
          const packagePrice = () => {
            const packageType = ticketState.PackageTypes.find(
              (i: any) => i.PackageTypeId === ticket.PackageTypeId,
            );
            if (packageType) return packageType.PackagePriceExcludingTax;
            return 0;
          };
          const dataTicket: TicketData = allPostsState?.ticket.find(
            (t: TicketData) =>
              isRockPass
                ? t.TicketTypeId === ticket.PackageTypeId
                : t.TicketTypeId === ticket.TicketTypeId,
          );
          const leftText = `${
            isRockPass ? ticket.PackageCount : ticket.TicketCount
          } ${
            isRockPass
              ? `Rock Pass${ticket.PackageCount > 1 ? 'es' : ''}`
              : dataTicket.TicketTypeName
          }`;
          const rightText = `$${
            Math.round(
              ((isRockPass
                ? ticket.PackageCount * packagePrice()
                : ticket.TicketCount * dataTicket.ChargeAmountExcludingTax) +
                Number.EPSILON) *
                100,
            ) / 100
          }`;

          return (
            <Fragment key={dataTicket.TicketTypeName}>
              <LineItem leftText={leftText} rightText={rightText} />
              {isRockPass && (
                <Fragment>
                  <LineItem
                    leftText={`\u00A0\u00A0\u00A0\u00A0${ticket.PackageCount} ${dataTicket.TicketTypeName}`}
                    rightText=""
                  />
                  <LineItem
                    leftText={`\u00A0\u00A0\u00A0\u00A0${
                      ticket.PackageCount
                    } Tour${ticket.PackageCount > 1 ? 's' : ''}, Rock Center`}
                    rightText=""
                  />
                </Fragment>
              )}
            </Fragment>
          );
        })}
      <LineItem
        leftText="Subtotal"
        rightText={`$${allPostsState?.sale?.SaleTotalExcludingTax}`}
      />
      <LineItem
        itemSx={itemWithDividerSx}
        leftText="Sales Tax"
        rightText={`$${allPostsState?.sale?.SaleTotalTax}`}
      />
      <LineItem
        itemSx={{fontWeight: 'bold', ...itemWithDividerSx}}
        leftText="Total"
        rightText={`$${allPostsState?.sale?.SaleTotalIncludingTax}`}
      />
      <Box
        sx={{
          mt: 4,
          '@media print': {
            mt: 0,
          },
        }}
      >
        {systemState.systemVariables && renderLegal()}
      </Box>
    </Box>
  );
};
