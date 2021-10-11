import {useRef, useCallback, useEffect} from 'react';
import {TishmanFlow} from '~buy-tickets/constants/constants';
import type {TicketType} from '~components/BuyTickets';

interface ODTTicketType {
  TicketPriceExcludingTax: number;
  PackagePriceExcludingTax: number;
  TicketTypeId?: number;
  PackageTypeId?: number;
  TaxAmount: number;
}

/** Takes the current list of selected ticket types and the
 * list of ODT ticket types, looks up the price and tax, calculates
 * and returns the total.
 */
export function calculatePrice(
  ticketList: TicketType[],
  ticketTypes: ODTTicketType[],
  isRockPass: boolean,
): number {
  return ticketList.reduce((total: number, ticket: TicketType) => {
    const apiTicket = ticketTypes.find((item: ODTTicketType) => {
      if (isRockPass) return item.PackageTypeId === ticket.TicketTypeId;
      return item.TicketTypeId === ticket.TicketTypeId;
    });

    if (!apiTicket)
      throw new Error(
        'Could not find matching ticket types in ODT TicketType response',
      );

    const price = isRockPass
      ? apiTicket.PackagePriceExcludingTax
      : apiTicket.TicketPriceExcludingTax;

    return (
      Math.round((ticket.TicketCount * price + total + Number.EPSILON) * 100) /
      100
    );
  }, 0);
}

export const useIsMounted = (): (() => boolean) => {
  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return isMounted;
};

/** Returns the correct ticket title to display for the TicketStep summary
 * Takes the current flow and the ticketCount
 */

export const getTicketDisplayTitle = (
  flow: string,
  ticketCount: number,
): string => {
  switch (flow) {
    case TishmanFlow.C3:
      return 'C3 Pass';
    case TishmanFlow.CITY_PASS:
      return 'CityPASS';
    default:
      return `Ticket${ticketCount > 1 ? 's' : ''}`;
  }
};
