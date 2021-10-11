/* eslint-disable @typescript-eslint/no-explicit-any */
/**@jsx jsx */
import {jsx} from '@tishman/components';
import invariant from 'invariant';
import {formatISO, getYear, getMonth, getDate} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {useMemo, useEffect, useState, useCallback} from 'react';
import {useErrorHandler} from 'react-error-boundary';
import {
  Step,
  PaymentComponent,
  useIsMounted,
  RedemptionComponent,
} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {postItem$} from '~buy-tickets/services/http-client';
import type {
  BuyTicketsData,
  TicketType,
  PackageType,
  BookletType,
} from '~components/BuyTickets';
import {TishmanFlow} from '~buy-tickets/constants/constants';
import {useLocation} from '@reach/router';
const BuyTicketsPurchaseStepBlock = ({
  data,
  stepNumber,
  startTime,
}: // stopTime,
// resetTime,
{
  stepNumber: number;
  data: BuyTicketsData;
  startTime?: () => void;
  stopTime?: () => void;
  resetTime?: () => void;
}): JSX.Element => {
  const location = useLocation();
  const page = data.page;
  const handleError = useErrorHandler();
  const [userState, setUserState] = useState(userStore.initialState);
  const [, setAllPostsState] = useState(allPostsStore.initialState);
  const isRockPass = userState.flow === TishmanFlow.ROCK_PASS;
  const isMounted = useIsMounted();
  const [isAsync, setIsAsync] = useState(true);
  const isCityPass =
    userState.flow === TishmanFlow.CITY_PASS ||
    userState.flow === TishmanFlow.C3;

  const strTime = useCallback(() => {
    if (startTime) startTime();
  }, [startTime]);
  // remove stpTime and rstTime if handlers are not needed here
  // const stpTime = useCallback(() => stopTime(), [stopTime]);
  // const rstTime = useCallback(() => resetTime(), [resetTime]);

  const saleObject = useMemo(() => {
    return {
      DeckDateTime:
        userState.datetime2 && isRockPass
          ? formatISO(utcToZonedTime(userState.datetime2, 'America/New_York'))
          : userState.datetime && userState.attraction === 1
          ? formatISO(utcToZonedTime(userState.datetime, 'America/New_York'))
          : userState.date && userState.attraction === 1
          ? formatISO(
              utcToZonedTime(
                new Date(
                  getYear(userState.date),
                  getMonth(userState.date),
                  getDate(userState.date),
                  0,
                  0,
                  1,
                ),
                'America/New_York',
              ),
            )
          : null, //convert time to eastern and format as ISO
      TourDateTime:
        userState.datetime && isRockPass
          ? formatISO(utcToZonedTime(userState.datetime, 'America/New_York'))
          : userState.datetime && userState.attraction === 2
          ? formatISO(utcToZonedTime(userState.datetime, 'America/New_York'))
          : userState.date && userState.attraction === 2
          ? formatISO(
              utcToZonedTime(
                new Date(
                  getYear(userState.date),
                  getMonth(userState.date),
                  getDate(userState.date),
                  0,
                  0,
                  1,
                ),
                'America/New_York',
              ),
            )
          : null,
      IsVoucher: false,
      IsSunset: userState.isSunset,
      // Remove ticketLabel from object before it goes to odt
      TicketSelectionList: isCityPass
        ? []
        : userState.ticketSelectionList.reduce(
            (list: Omit<TicketType, 'TicketLabel'>[], item: TicketType) => {
              if (item.TicketCount > 0) {
                list.push({
                  TicketTypeId: item.TicketTypeId,
                  TicketCount: item.TicketCount,
                });
              }
              return list;
            },
            [] as Omit<TicketType, 'TicketLabel'>[],
          ),
      PackageSelectionList: userState.packageSelectionList.reduce(
        (list: PackageType[], item: TicketType) => {
          if (item.TicketCount > 0) {
            list.push({
              PackageTypeId: item.TicketTypeId,
              PackageCount: item.TicketCount,
            });
          }
          return list;
        },
        [] as PackageType[],
      ),
      CityPassSelectionList: isCityPass
        ? userState.ticketSelectionList.reduce(
            (list: BookletType[], item: TicketType) => {
              if (item.TicketCount > 0) {
                list.push({
                  TicketTypeId: item.TicketTypeId,
                  BookletCount: item.TicketCount,
                });
              }
              return list;
            },
            [] as BookletType[],
          )
        : [],
      AutoRedemption: isCityPass,
    };
  }, [userState, isCityPass, isRockPass]);

  const postSale = useCallback(
    (url: string, data: any, title: string) => {
      postItem$(url, data).subscribe(
        (response: any) => {
          strTime();
          userStore.sendData({loading: false});
          allPostsStore.sendData(response, title);
          window.dataLayer.push({
            event: 'Continue Button Clicked',
            Step: '4: Contact & Billing Info',
            Referrer: document.referrer || null,
            PageName: location.pathname,
            UTC: new Date().toUTCString(),
            Error: null,
            FromStep: 'Time',
          });
        },
        (error: Error) => {
          const errorCollection = {
            message: error.message,
            name: error.name,
            stack: error.stack,
          };
          window.dataLayer.push({
            event: 'Continue Button Clicked',
            Step: '4: Contact & Billing Info',
            Referrer: document.referrer || null,
            PageName: location.pathname,
            UTC: new Date().toUTCString(),
            Error: JSON.stringify(errorCollection),
            FromStep: 'Time',
          });
          userStore.sendData({currentStep: 1, loading: false});
          setIsAsync(true);
          handleError(error);
        },
      );
    },
    [strTime, location.pathname, handleError],
  );

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const postSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(postSub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (userState.loading && userState.currentStep === stepNumber && isAsync) {
      const effect = async () => {
        isCityPass
          ? postSale('CityPass/Sale', saleObject, 'sale')
          : postSale('Sale', saleObject, 'sale');
        if (!isMounted()) return;
        setIsAsync(false);
      };
      effect();
    }
  }, [
    userState.loading,
    userState.currentStep,
    isAsync,
    postSale,
    isMounted,
    stepNumber,
    isCityPass,
    saleObject,
  ]);

  invariant(page, 'Expected valid buy tickets page json');

  const stepData = useMemo(() => {
    if (!page.purchaseStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.purchaseStep.title,
      description: page.purchaseStep.description,
    };
  }, [page]);

  return (
    <Step
      title={stepData.title}
      stepNumber={stepNumber}
      showLoadingModal={
        userState.loading && userState.currentStep === stepNumber
      }
    >
      {userState.flow === TishmanFlow.REDEMPTION ? (
        <RedemptionComponent />
      ) : (
        <PaymentComponent />
      )}
    </Step>
  );
};

export default BuyTicketsPurchaseStepBlock;
