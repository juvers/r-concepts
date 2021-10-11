/**@jsx jsx */
import {jsx, Box, Text, Flex, Button} from '@tishman/components';
import {useState, useEffect} from 'react';
import {useErrorHandler} from 'react-error-boundary';
import userStore from '~buy-tickets/store/user/userStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import {
  TicketType,
  ContinueButton,
  TicketLine,
  calculatePrice,
} from '~components/BuyTickets';
import {TishmanFlow} from '~buy-tickets/constants/constants';

export interface TicketLineData {
  label: string;
  price: number;
  ticketTypeId: number;
}
export interface TicketQuantityProps {
  limit: number;
  hideLabel?: boolean;
  description?: string;
  ticketTypes: TicketLineData[];
  handleContinue: () => void;
}

export const TicketQuantity = ({
  ticketTypes,
  description,
  hideLabel,
  limit,
  handleContinue,
}: TicketQuantityProps): JSX.Element => {
  const handleError = useErrorHandler();
  const [userState, setUserState] = useState(userStore.initialState);
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);
  const isRockPass = userState.flow === TishmanFlow.ROCK_PASS;
  const isCityPass =
    userState.flow === TishmanFlow.CITY_PASS ||
    userState.flow === TishmanFlow.C3;
  const ticketList = isRockPass
    ? userState.packageSelectionList
    : userState.ticketSelectionList;

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    userSub.add(ticketSub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (ticketList.some((t: TicketType) => t.TicketCount > 0)) {
      const total = ticketList.reduce((total: number, ticket: TicketType) => {
        return total + ticket.TicketCount;
      }, 0);
      userStore.sendData({
        canContinue: true,
        totalNumberOfTickets: total,
        totalPrice: isRockPass
          ? calculatePrice(ticketList, ticketState.PackageTypes, isRockPass)
          : calculatePrice(ticketList, ticketState.TicketTypes, isRockPass),
      });
    } else {
      userStore.sendData({
        canContinue: false,
      });
    }
  }, [ticketList, isRockPass, ticketState]);

  function isBelowTicketLimit() {
    return userState.totalNumberOfTickets < limit;
  }

  function decreaseQuantity(ticketCount: number, ticketTypeId: number) {
    if (ticketCount > 0) {
      const ticketData = ticketList.reduce(
        (list: TicketType[], ticket: TicketType) => {
          if (ticket.TicketTypeId === ticketTypeId) {
            ticket.TicketCount = ticketCount - 1;
            list.push(ticket);
          } else list.push(ticket);

          return list;
        },
        [] as TicketType[],
      );

      const updateStoreTicketData = isRockPass
        ? {
            packageSelectionList: ticketData,
            totalPrice: calculatePrice(
              ticketList,
              ticketState.PackageTypes,
              isRockPass,
            ),
            totalNumberOfTickets: userState.totalNumberOfTickets - 1,
          }
        : {
            ticketSelectionList: ticketData,
            totalPrice: calculatePrice(
              ticketList,
              ticketState.TicketTypes,
              isRockPass,
            ),
            totalNumberOfTickets: userState.totalNumberOfTickets - 1,
          };

      userStore.sendData({
        ...updateStoreTicketData,
      });
    }
  }

  function increaseQuantity(ticketCount: number, ticketTypeId: number) {
    if (isBelowTicketLimit()) {
      const ticketData = ticketList.reduce(
        (list: TicketType[], ticket: TicketType) => {
          if (ticket.TicketTypeId === ticketTypeId) {
            ticket.TicketCount = ticketCount + 1;
            list.push(ticket);
          } else list.push(ticket);

          return list;
        },
        [] as TicketType[],
      );

      const updateStoreTicketData = isRockPass
        ? {
            packageSelectionList: ticketData,
            totalPrice: calculatePrice(
              ticketList,
              ticketState.PackageTypes,
              isRockPass,
            ),
            totalNumberOfTickets: userState.totalNumberOfTickets + 1,
          }
        : {
            ticketSelectionList: ticketData,
            totalPrice: calculatePrice(
              ticketList,
              ticketState.TicketTypes,
              isRockPass,
            ),
            totalNumberOfTickets: userState.totalNumberOfTickets + 1,
          };

      userStore.sendData({
        canContinue: true,
        ...updateStoreTicketData,
      });
    } else {
      const error = new Error(
        'Unfortunately, you cannot buy more than 21 tickets in a single transaction. Please call our Group Sales department at 212.698.2000 or 877.NYC.ROCK (877.692.7625) to purchase tickets for groups of 22 or more.',
      );
      error.name = 'Sorry, you’ve exceed the ticket limit';
      handleError(error);
    }
  }
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: ['column', 'column', 'row'],
      }}
    >
      <Text sx={{maxWidth: 317}}>{description}</Text>
      <Flex
        sx={{width: ['100%', 365], mt: [4, 4, -5], flexDirection: 'column'}}
      >
        <Box sx={{mb: 20}}>
          {ticketTypes.map((ticket, i: number) => {
            return (
              <TicketLine
                hideLabel={hideLabel}
                key={ticket.ticketTypeId}
                ticketTypeId={ticket.ticketTypeId}
                label={ticket.label}
                price={ticket.price}
                ticketCount={ticketList[i] ? ticketList[i].TicketCount : 0}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            );
          })}
        </Box>
        <ContinueButton
          sx={{mt: 3, alignSelf: hideLabel ? ['unset', 'center'] : 'unset'}}
          handleClick={() => {
            handleContinue();
          }}
        />
        {isCityPass && (
          <Button
            disabled={!userState.canContinue}
            variant="underline"
            sx={{mt: 3, mx: 'auto', width: 'fit-content'}}
            onClick={() => {
              userStore.sendData({
                currentStep: 2,
                skipToBilling: true,
                loading: true,
              });
            }}
          >
            Skip Booking & Purchase Now
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
