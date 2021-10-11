/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import {useState, useEffect, useRef, useCallback, SyntheticEvent} from 'react';
import {format} from 'date-fns';
import {
  jsx,
  Box,
  Flex,
  Text,
  Grid,
  Divider,
  Input,
  Spinner,
  Button,
  ThemeProvider,
  getThemeByName,
  SuccessCheckmark,
} from '@tishman/components';
import userStore from '~buy-tickets/store/user/userStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {getTicketDisplayTitle, useIsMounted} from '~components/BuyTickets';
import {
  TishmanFlow,
  SUNSET_ADD_ON_PRICE,
} from '~buy-tickets/constants/constants';
import {getItem$, postItem$} from '~buy-tickets/services/http-client';

import type {TicketType, PackageType} from '~components/BuyTickets';

const spaceBetween = {justifyContent: 'space-between', mb: 2};

export function OrderSummary({
  showPromoCodeField = false,
}: {
  showPromoCodeField?: boolean;
}): JSX.Element {
  const [userState, setUserState] = useState(userStore.initialState);
  const isMounted = useIsMounted();
  const [isAsync, setIsAsync] = useState(false);
  const [promo, setPromo] = useState({
    clicksApplied: 0,
    promoCode: '',
    submitting: false,
    promoStatus: '',
  });
  const [ticketState, setTicketState] = useState(ticketTypesStore.initialState);
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );
  const isRockPass = userState.flow === TishmanFlow.ROCK_PASS;
  const ticketList = isRockPass
    ? userState.packageSelectionList
    : userState.ticketSelectionList;

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const ticketSub = ticketTypesStore.subscribe(setTicketState);
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(ticketSub, postsSub);
    return () => userSub.unsubscribe();
  }, []);

  const checkIfEmpty = (x: string) => (x.length < 2 ? true : false);
  const applyRef = useRef<any>();
  const applyPromoCode = useCallback(() => {
    const saleid = allPostsState?.sale?.SaleId;
    const promoData = applyRef.current.value;
    setPromo({
      ...promo,
      clicksApplied: promo.clicksApplied + 1,
    });
    postItem$(`PromotionCode/Apply?saleId=${saleid}`, promoData).subscribe(
      (x: any) => {
        setPromo({
          ...promo,
          clicksApplied: promo.clicksApplied + 1,
          submitting: true,
        });
        if (x.status) {
          setPromo({...promo, promoStatus: 'Succeeded'});
        } else {
          setPromo({
            ...promo,
            clicksApplied: promo.clicksApplied + 1,
            promoStatus: 'Failed',
          });
        }
        getItem$(`Sale?saleId=${saleid}`).subscribe(
          (y) => {
            console.log('Get updated value after promo application: ', y);
            allPostsStore.sendData(y, 'promoSale');
          },
          (error) =>
            console.log(
              'Error from failed get after promo application: ',
              error,
            ),
        );
        return x;
      },
      (error: any) => {
        console.log('Error: ', error);
        setPromo({
          ...promo,
          clicksApplied: promo.clicksApplied + 1,
          promoStatus: 'Failed',
        });
      },
    );
  }, [allPostsState?.sale?.SaleId, promo]);
  useEffect(() => {
    if (isAsync) {
      const effect = async () => {
        applyPromoCode();
        if (!isMounted()) return;
        setIsAsync(false);
      };
      effect();
    }
  }, [isAsync, isMounted, applyPromoCode]);

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
        <Text variant="largeP">
          {userState.isSunset
            ? `+$${SUNSET_ADD_ON_PRICE * userState.totalNumberOfTickets}`
            : null}
        </Text>
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
          const apiTicket = isRockPass
            ? ticketState.PackageTypes.find(
                (t: PackageType) => t.PackageTypeId === ticket.TicketTypeId,
              )
            : ticketState.TicketTypes.find(
                (t: TicketType) => t.TicketTypeId === ticket.TicketTypeId,
              );

          return (
            <Flex key={ticket.TicketTypeId} sx={spaceBetween}>
              <Text variant="largeP" key={ticket.TicketTypeId}>
                {`${ticket.TicketCount} ${
                  ticket.TicketLabel
                } ${getTicketDisplayTitle(userState.flow, ticket.TicketCount)}`}
              </Text>
              <Text variant="largeP">
                $
                {isRockPass
                  ? apiTicket.PackagePriceExcludingTax * ticket.TicketCount
                  : apiTicket.TicketPriceExcludingTax * ticket.TicketCount}
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
      {promo.clicksApplied > 0 && promo.promoStatus === 'Succeeded' && (
        <Flex sx={{...spaceBetween, mb: 3}}>
          <Text variant="largeP">Promo discount</Text>
          <ThemeProvider theme={getThemeByName('Top of the Rock Olive')}>
            <Text variant="largeP" sx={{color: 'background'}}>
              -$
              {allPostsState.promoSale
                ? allPostsState.promoSale.DiscountAmount
                : ''}
            </Text>
          </ThemeProvider>
        </Flex>
      )}
      <Flex sx={{...spaceBetween, mb: 3}}>
        <Text variant="largeP">Taxes</Text>
        <Text variant="largeP">
          +${allPostsState.sale ? allPostsState.sale.SaleTotalTax : ''}
        </Text>
      </Flex>
      <Divider />
      <Flex sx={{...spaceBetween, mt: 3}}>
        <Text variant="executiveTitle">Total</Text>
        <Text variant="largeP" sx={{fontWeight: 'medium'}}>
          ${allPostsState.sale ? allPostsState.sale.SaleTotalIncludingTax : ''}
        </Text>
      </Flex>
      {showPromoCodeField && (
        <Box sx={{mt: 5}}>
          <Text variant="executiveTitle">Enter a Promo Code</Text>
          <Grid gap={2} columns={[2, '3fr 1fr']}>
            <Box sx={{position: 'relative'}}>
              <Input
                ref={applyRef}
                text=""
                name="promoCode"
                value={promo.promoCode}
                placeholder="Type Code Here"
                onChange={(e) =>
                  setPromo({...promo, promoCode: e.target.value})
                }
              />
              {promo.clicksApplied > 0 && promo.promoStatus === 'Succeeded' && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '1.6em',
                    right: '0.1em',
                  }}
                >
                  <ThemeProvider
                    theme={getThemeByName('Top of the Rock Olive')}
                  >
                    <SuccessCheckmark sx={{fill: 'background'}} />
                  </ThemeProvider>
                </Box>
              )}
            </Box>

            <Button
              variant="inverted"
              disabled={checkIfEmpty(promo.promoCode)}
              sx={{
                padding: '0',
                minWidth: '6rem',
                maxHeight: '4rem',
              }}
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                setIsAsync(true);
              }}
            >
              Apply
            </Button>

            {promo.clicksApplied > 0 && promo.promoStatus === 'Failed' && (
              <Text variant="formError">
                This is not a valid promo code. Please enter a valid code
              </Text>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
